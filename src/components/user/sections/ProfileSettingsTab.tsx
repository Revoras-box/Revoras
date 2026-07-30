"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, Input, Select, Switch, Button, CardSkeleton } from "@/components/ui";
import { useProfile, useMutation } from "@/lib/hooks";
import { api } from "@/lib/api";
import { ProfileSection } from "./ProfileSection";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

// The select values that aren't free-text. Anything the backend returns that
// isn't one of these is a custom value the user typed under "Other".
const PRESET_GENDERS = new Set(["male", "female", "prefer_not_to_say"]);

/**
 * `date_of_birth` is a DATE column, but it does not arrive as one.
 *
 * node-postgres inflates a DATE into a JS Date at the *server's* midnight, and
 * JSON then serialises that as UTC — so a birthday saved as 1998-04-23 comes
 * back over the wire as "1998-04-22T18:30:00.000Z" from an IST server. Slicing
 * the first ten characters of that, the obvious thing to do, yields 1998-04-22
 * and the date drifts a day earlier every round trip.
 *
 * Reading the local components undoes exactly the offset that was applied, so
 * the field shows the day that was actually entered. The real fix is on the
 * server — a DATE has no time and no zone, so it should be sent as a plain
 * "YYYY-MM-DD" string — but that means changing the pg type parser globally,
 * and `booking_date` is a DATE column too, so it is not a change to make from
 * inside a profile form.
 */
const toDateInputValue = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function ProfileSettingsTab() {
  const { data, loading, refetch } = useProfile();
  const { mutate: updateProfile, loading: saving } = useMutation(api.updateProfile);
  const { mutate: updateNotifications } = useMutation(api.updateNotifications);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [genderOther, setGenderOther] = useState("");
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false, marketing: false });

  useEffect(() => {
    if (!data?.user) return;
    setName(data.user.name ?? "");
    setPhone(data.user.phone ?? "");
    // The API stores and accepts this, and the form simply never offered it —
    // so a date of birth could be read back but never entered.
    setDateOfBirth(toDateInputValue(data.user.date_of_birth));
    const savedGender = data.user.gender ?? "";
    if (savedGender && !PRESET_GENDERS.has(savedGender)) {
      // A custom value the user typed previously — reselect "Other" and refill it.
      setGender("other");
      setGenderOther(savedGender === "other" ? "" : savedGender);
    } else {
      setGender(savedGender);
      setGenderOther("");
    }
    setNotifications({
      email: data.user.notification_settings?.email ?? true,
      push: data.user.notification_settings?.push ?? true,
      sms: data.user.notification_settings?.sms ?? false,
      marketing: data.user.notification_settings?.marketing ?? false,
    });
  }, [data]);

  const handleSaveProfile = async () => {
    // Under "Other", the typed value is what we persist (falling back to the
    // literal "other" if they left it blank).
    const genderValue = gender === "other" ? genderOther.trim() || "other" : gender;

    /**
     * Empty optional fields are omitted, not sent as "".
     *
     * This form used to post `{ name, phone, gender }` unconditionally, and the
     * server validates phone as `z.string().min(7)`. A blank box is therefore a
     * 400 — "phone: Too small" — which means anybody who signed up with an email
     * and never added a phone number could not save this form at all, including
     * to change nothing but their name. Phone is nullable on the users table, so
     * that is most customers. The same applies to `dateOfBirth`, which is
     * validated against a strict YYYY-MM-DD pattern that "" cannot match.
     *
     * A consequence worth naming: because the update schema has no nullable
     * variant of these fields, omitting is also the only thing we *can* do —
     * there is no request that clears a phone number once one is set. Removing a
     * detail needs a server change, not a different payload from here.
     */
    const result = await updateProfile({
      name,
      ...(phone.trim() ? { phone: phone.trim() } : {}),
      ...(genderValue ? { gender: genderValue } : {}),
      ...(dateOfBirth ? { dateOfBirth } : {}),
    });
    if (result.success) {
      toast.success("Profile updated");
      refetch();
    } else {
      toast.error(result.error || "Failed to update profile");
    }
  };

  const handleNotificationChange = async (key: keyof typeof notifications, value: boolean) => {
    const next = { ...notifications, [key]: value };
    setNotifications(next);
    const result = await updateNotifications(next);
    if (!result.success) toast.error(result.error || "Failed to update notification settings");
  };

  if (loading) return <CardSkeleton />;

  return (
    <ProfileSection title="Settings" description="Your personal details and how we contact you.">
      <Card padding="lg" className="flex flex-col gap-4">
        <div>
          <h3 className="font-headline text-base font-bold text-on-surface">Personal details</h3>
          <p className="mt-0.5 text-sm text-muted">Used on your bookings so the studio knows who to expect.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          {/*
            Read-only on purpose. The account address is the sign-in credential
            and the server's update schema has no field for it, so an editable
            box here would accept a change and silently discard it.
          */}
          <Input label="Email" value={data?.user?.email ?? ""} readOnly disabled hint="Contact support to change your email" />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input
            label="Date of birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          <Select label="Gender" options={GENDER_OPTIONS} value={gender} onValueChange={setGender} placeholder="Select" />
          {gender === "other" && (
            <Input
              label="Please specify"
              value={genderOther}
              maxLength={20}
              placeholder="Type your gender"
              onChange={(e) => setGenderOther(e.target.value)}
            />
          )}
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button loading={saving} onClick={handleSaveProfile}>
            Save changes
          </Button>
        </div>
      </Card>

      <Card padding="lg" className="flex flex-col gap-4">
        <div>
          <h3 className="font-headline text-base font-bold text-on-surface">Notification preferences</h3>
          {/* These save on toggle, with no Save button anywhere near them — say
              so, rather than leaving people wondering if it took. */}
          <p className="mt-0.5 text-sm text-muted">Saved as soon as you change them.</p>
        </div>
        <Switch label="Email" description="Booking confirmations and updates" checked={notifications.email} onCheckedChange={(v) => handleNotificationChange("email", v)} />
        <Switch label="Push" description="Real-time alerts on this device" checked={notifications.push} onCheckedChange={(v) => handleNotificationChange("push", v)} />
        <Switch label="SMS" description="Text message reminders" checked={notifications.sms} onCheckedChange={(v) => handleNotificationChange("sms", v)} />
        <Switch label="Marketing" description="Offers and product news" checked={notifications.marketing} onCheckedChange={(v) => handleNotificationChange("marketing", v)} />
      </Card>
    </ProfileSection>
  );
}
