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

export default function ProfileSettingsTab() {
  const { data, loading, refetch } = useProfile();
  const { mutate: updateProfile, loading: saving } = useMutation(api.updateProfile);
  const { mutate: updateNotifications } = useMutation(api.updateNotifications);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false, marketing: false });

  useEffect(() => {
    if (!data?.user) return;
    setName(data.user.name ?? "");
    setPhone(data.user.phone ?? "");
    setGender(data.user.gender ?? "");
    setNotifications({
      email: data.user.notification_settings?.email ?? true,
      push: data.user.notification_settings?.push ?? true,
      sms: data.user.notification_settings?.sms ?? false,
      marketing: data.user.notification_settings?.marketing ?? false,
    });
  }, [data]);

  const handleSaveProfile = async () => {
    const result = await updateProfile({ name, phone, gender });
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
