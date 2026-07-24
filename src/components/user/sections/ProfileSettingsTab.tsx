"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, Input, Select, Switch, Button, CardSkeleton } from "@/components/ui";
import { useProfile, useMutation } from "@/lib/hooks";
import { api } from "@/lib/api";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

// The select values that aren't free-text. Anything the backend returns that
// isn't one of these is a custom value the user typed under "Other".
const PRESET_GENDERS = new Set(["male", "female", "prefer_not_to_say"]);

export default function ProfileSettingsTab() {
  const { data, loading, refetch } = useProfile();
  const { mutate: updateProfile, loading: saving } = useMutation(api.updateProfile);
  const { mutate: updateNotifications } = useMutation(api.updateNotifications);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [genderOther, setGenderOther] = useState("");
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false, marketing: false });

  useEffect(() => {
    if (!data?.user) return;
    setName(data.user.name ?? "");
    setPhone(data.user.phone ?? "");
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
    const result = await updateProfile({ name, phone, gender: genderValue });
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
    <div className="flex flex-col gap-6">
      <Card padding="lg" className="flex flex-col gap-4">
        <h3 className="font-headline text-lg font-bold text-on-surface">Personal details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
        <div>
          <Button loading={saving} onClick={handleSaveProfile}>
            Save changes
          </Button>
        </div>
      </Card>

      <Card padding="lg" className="flex flex-col gap-4">
        <h3 className="font-headline text-lg font-bold text-on-surface">Notification preferences</h3>
        <Switch label="Email" description="Booking confirmations and updates" checked={notifications.email} onCheckedChange={(v) => handleNotificationChange("email", v)} />
        <Switch label="Push" description="Real-time alerts on this device" checked={notifications.push} onCheckedChange={(v) => handleNotificationChange("push", v)} />
        <Switch label="SMS" description="Text message reminders" checked={notifications.sms} onCheckedChange={(v) => handleNotificationChange("sms", v)} />
        <Switch label="Marketing" description="Offers and product news" checked={notifications.marketing} onCheckedChange={(v) => handleNotificationChange("marketing", v)} />
      </Card>
    </div>
  );
}
