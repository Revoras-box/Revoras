"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, QrCode } from "lucide-react";
import { Container, Card, Badge, Button, Avatar, Tabs, TabsPanel, CardSkeleton, EmptyState } from "@/components/ui";
import { useBookings } from "@/lib/hooks";
import { STATUS_LABEL, STATUS_TONE, categorize, type BookingCategory } from "@/lib/bookings";
import { formatBookingDateLabel, formatTimeLabel } from "@/components/user/sections/utils";
import CancelBookingModal from "@/components/user/sections/CancelBookingModal";
import type { BookingListItem } from "@/lib/types";

const TAB_ITEMS = [
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No-show" },
];

const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function BookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingCategory>("upcoming");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  // One fetch of all statuses (bookings lists are small per user), grouped
  // client-side via the shared categorize() so Today/Upcoming split cleanly.
  const { data, loading, refetch } = useBookings({});
  const all = useMemo(() => (data?.bookings ?? []) as BookingListItem[], [data]);

  const grouped = useMemo(() => {
    const g: Record<BookingCategory, BookingListItem[]> = { today: [], upcoming: [], completed: [], cancelled: [], no_show: [] };
    for (const b of all) g[categorize(b)].push(b);
    // Soonest first for active lists, most-recent first for terminal ones.
    g.today.sort((a, b) => a.start_time.localeCompare(b.start_time));
    g.upcoming.sort((a, b) => (a.booking_date + a.start_time).localeCompare(b.booking_date + b.start_time));
    return g;
  }, [all]);

  const afterCancel = () => {
    setVersion((v) => v + 1);
    refetch();
  };

  const renderList = (cat: BookingCategory) => {
    const list = grouped[cat];
    if (loading) return <div className="flex flex-col gap-4">{[1, 2].map((i) => <CardSkeleton key={i} />)}</div>;
    if (list.length === 0) {
      return (
        <EmptyState
          title={`No ${TAB_ITEMS.find((t) => t.value === cat)?.label.toLowerCase()} bookings`}
          description={cat === "today" || cat === "upcoming" ? "Book an appointment and it'll show up here." : "Nothing here yet."}
          action={cat === "upcoming" ? <Button onClick={() => router.push("/user")}>Find a studio</Button> : undefined}
        />
      );
    }
    return (
      <div className="flex flex-col gap-4">
        {list.map((b) => {
          const canCancel = ["pending", "confirmed"].includes(b.status);
          return (
            <Card key={b.id} padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar name={b.member_designation ?? b.studio_name} src={b.member_image ?? b.studio_image ?? undefined} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-on-surface">{b.studio_name}</p>
                    <Badge tone={STATUS_TONE[b.status]}>{STATUS_LABEL[b.status]}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted">
                    {formatBookingDateLabel(b.booking_date)} · {formatTimeLabel(b.start_time)}
                    {b.member_designation ? ` · ${b.member_designation}` : ""}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-primary tabular-nums">{inr(Number(b.total_amount))}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/user/bookings/${b.id}`}>
                  <Button intent="outline" size="sm"><QrCode size={14} /> View</Button>
                </Link>
                {canCancel ? (
                  <>
                    <Link href={`/user/book?studioId=${b.studio_id}&barberId=${b.business_member_id}&reschedule=${b.id}`}>
                      <Button intent="ghost" size="sm"><CalendarClock size={14} /> Reschedule</Button>
                    </Link>
                    <Button intent="ghost" size="sm" className="text-error" onClick={() => setCancelId(b.id)}>Cancel</Button>
                  </>
                ) : null}
                {b.status === "completed" ? (
                  <Link href={`/user/review?booking=${b.id}`}>
                    <Button size="sm">Leave review</Button>
                  </Link>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Container className="flex flex-col gap-6 py-8">
      <h1 className="font-headline text-2xl font-bold text-on-surface">Your bookings</h1>
      <Tabs items={TAB_ITEMS} value={activeTab} onValueChange={(v) => setActiveTab(v as BookingCategory)}>
        {TAB_ITEMS.map((t) => (
          <TabsPanel key={t.value} value={t.value}>
            {renderList(t.value as BookingCategory)}
          </TabsPanel>
        ))}
      </Tabs>

      {cancelId ? <CancelBookingModal bookingId={cancelId} onClose={() => setCancelId(null)} onCancelled={afterCancel} /> : null}
    </Container>
  );
}
