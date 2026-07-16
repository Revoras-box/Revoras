"use client";

import { useState } from "react";
import {
  Home,
  Calendar,
  Users,
  Scissors,
  BarChart3,
  Settings,
  Search,
  Heart,
  Bell,
  User,
  Star,
  MoreHorizontal,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import {
  Button,
  Spinner,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Badge,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Container,
  Section,
  PageHeader,
  Modal,
  Drawer,
  Sidebar,
  TopNav,
  BottomNav,
  toast,
  EmptyState,
  Skeleton,
  ListItemSkeleton,
  CardSkeleton,
  ErrorState,
  ConfirmDialog,
  ListItem,
  Tabs,
  TabsPanel,
  Pagination,
  DataTable,
  StatCard,
  ScheduleGrid,
  Timeline,
  RatingDisplay,
  CategoryChip,
  BusinessCard,
  ProfessionalCard,
  ServiceCard,
  BookingCard,
  TimeSlotPicker,
  type DataTableColumn,
} from "@/components/ui";
import { ICON_SIZE } from "@/lib/design-tokens";

/* ----------------------------- scaffolding ----------------------------- */

function Swatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-14 rounded-lg border border-border" style={{ background: `var(${varName})` }} />
      <div className="text-xs font-medium text-on-surface">{name}</div>
      <div className="text-[11px] font-mono text-muted">{varName}</div>
    </div>
  );
}

function Demo({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-6 border-t border-border first:border-t-0 first:pt-0">
      <div>
        <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
        {description ? <p className="text-xs text-muted mt-0.5">{description}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

/* --------------------------------- data --------------------------------- */

type Row = { id: string; business: string; owner: string; status: string; submitted: string };

const TABLE_ROWS: Row[] = [
  { id: "1", business: "The Gentleman's Chair", owner: "Aman Rao", status: "pending", submitted: "12 Jul" },
  { id: "2", business: "Blush & Blade", owner: "Sana Kapoor", status: "approved", submitted: "10 Jul" },
  { id: "3", business: "Curl & Co.", owner: "Devraj Iyer", status: "pending", submitted: "9 Jul" },
];

const TABLE_COLUMNS: DataTableColumn<Row>[] = [
  { key: "business", header: "Business", render: (r) => r.business },
  { key: "owner", header: "Owner", render: (r) => r.owner },
  {
    key: "status",
    header: "Status",
    render: (r) => <Badge tone={r.status === "approved" ? "success" : "warning"}>{r.status}</Badge>,
  },
  { key: "submitted", header: "Submitted", render: (r) => r.submitted, align: "right" },
];

const SIDEBAR_ITEMS = [
  { label: "Today", href: "#today", icon: <Home size={ICON_SIZE.md} />, active: true },
  { label: "Calendar", href: "#calendar", icon: <Calendar size={ICON_SIZE.md} /> },
  { label: "Team", href: "#team", icon: <Users size={ICON_SIZE.md} /> },
  { label: "Services", href: "#services", icon: <Scissors size={ICON_SIZE.md} /> },
  { label: "Analytics", href: "#analytics", icon: <BarChart3 size={ICON_SIZE.md} /> },
  { label: "Settings", href: "#settings", icon: <Settings size={ICON_SIZE.md} /> },
];

const BOTTOM_NAV_ITEMS = [
  { label: "Discover", href: "#discover", icon: <Home size={ICON_SIZE.md} />, active: true },
  { label: "Bookings", href: "#bookings", icon: <Calendar size={ICON_SIZE.md} /> },
  { label: "Favorites", href: "#favorites", icon: <Heart size={ICON_SIZE.md} /> },
  { label: "Profile", href: "#profile", icon: <User size={ICON_SIZE.md} /> },
];

/* -------------------------------- page ---------------------------------- */

export default function DesignSystemPage() {
  const { theme, toggle } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [switched, setSwitched] = useState(true);
  const [radio, setRadio] = useState("owner");
  const [page, setPage] = useState(3);
  const [slot, setSlot] = useState("14:30");
  const [favorite, setFavorite] = useState(false);
  const [serviceSelected, setServiceSelected] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopNav
        logo={<span className="font-headline text-lg font-bold text-primary">Revoras</span>}
        items={[
          { label: "Foundations", href: "#foundations", active: true },
          { label: "Components", href: "#components" },
        ]}
        actions={
          <Button intent="outline" size="sm" onClick={toggle}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>
        }
      />

      <Container width="lg" className="py-10">
        <PageHeader
          eyebrow="Design System v1 · Terra Jade"
          title="Revoras Design System"
          description="The frozen v1 language: jade primary + terracotta accent, on the Material-3-style token layer. Every primitive, layout, feedback, data, and booking component renders live against the real tokens — toggle the theme above to check light and dark."
        />

        {/* ---------------- Foundations ---------------- */}
        <Section id="foundations" title="Design tokens" description="Terra Jade (2026-07-15): jade brand primary, terracotta accent, warm-cream light / deep-forest dark surfaces. Names are frozen; only these values define the palette, so every component re-themes for free.">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4">
            <Swatch name="Primary (jade)" varName="--primary" />
            <Swatch name="Accent (terracotta)" varName="--accent" />
            <Swatch name="Accent container" varName="--accent-container" />
            <Swatch name="Secondary (success)" varName="--secondary" />
            <Swatch name="Tertiary" varName="--tertiary" />
            <Swatch name="Error" varName="--error" />
            <Swatch name="Surface" varName="--surface" />
            <Swatch name="Surface high" varName="--surface-container-high" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="brand-gradient h-10 w-40 rounded-lg" />
            <span className="brand-gradient-text font-headline text-2xl font-extrabold">Brand gradient</span>
          </div>

          <Card padding="md" className="mt-6">
            <div className="flex flex-col gap-3">
              <div className="font-headline text-2xl font-bold text-on-surface">Every chair, booked.</div>
              <div className="font-headline text-lg font-semibold text-on-surface">Upcoming appointments</div>
              <div className="text-sm text-on-surface">Haircut with Aman · The Gentleman&rsquo;s Chair · Sat, 4:30 PM</div>
              <div className="text-xs text-muted">Free cancellation up to 2 hours before your appointment</div>
              <div className="text-sm font-mono text-on-surface">REV8F2K-4QRT · ₹1,450</div>
            </div>
          </Card>
        </Section>

        <Divider className="my-10" />

        {/* ---------------- Primitives ---------------- */}
        <Section id="components" title="Primitives">
          <Demo title="Button" description="intent × size, plus loading/disabled states">
            <Button intent="primary">Primary</Button>
            <Button intent="secondary">Secondary</Button>
            <Button intent="outline">Outline</Button>
            <Button intent="ghost">Ghost</Button>
            <Button intent="danger">Danger</Button>
            <Button intent="primary" loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>
              {loading ? "Booking…" : "Click to load"}
            </Button>
            <Button intent="primary" size="icon" aria-label="More options">
              <MoreHorizontal size={ICON_SIZE.md} />
            </Button>
            <Button intent="outline" disabled>
              Disabled
            </Button>
          </Demo>

          <Demo title="Input / Textarea">
            <Input label="Full name" placeholder="Aman Rao" wrapperClassName="w-64" />
            <Input label="Email" placeholder="you@example.com" error="Enter a valid email" wrapperClassName="w-64" />
            <Input label="Search" placeholder="Search services…" leadingIcon={<Search size={ICON_SIZE.sm} />} wrapperClassName="w-64" />
            <Textarea label="Notes" placeholder="Anything the professional should know?" wrapperClassName="w-72" />
          </Demo>

          <Demo title="Select / Checkbox / Radio / Switch">
            <Select
              label="Category"
              placeholder="Choose a category"
              options={[
                { value: "haircut", label: "Haircut" },
                { value: "beard", label: "Beard" },
                { value: "spa", label: "Spa" },
              ]}
              defaultValue="haircut"
              className="w-52"
            />
            <Checkbox label="Also provides services" description="Shows this owner as bookable" checked={checked} onCheckedChange={setChecked} />
            <RadioGroup
              label="Role"
              value={radio}
              onValueChange={setRadio}
              orientation="horizontal"
              options={[
                { value: "owner", label: "Owner" },
                { value: "staff", label: "Staff" },
              ]}
            />
            <Switch label="Email notifications" checked={switched} onCheckedChange={setSwitched} />
          </Demo>

          <Demo title="Badge / Chip / Avatar / Tooltip">
            <Badge tone="neutral">Neutral</Badge>
            <Badge tone="primary">Primary</Badge>
            <Badge tone="success" dot>
              Confirmed
            </Badge>
            <Badge tone="warning" dot>
              Pending
            </Badge>
            <Badge tone="danger" dot>
              Cancelled
            </Badge>
            <CategoryChip selected>Haircut</CategoryChip>
            <CategoryChip>Beard</CategoryChip>
            <Chip onRemove={() => toast("Filter removed")}>Nearby</Chip>
            <Avatar name="Aman Rao" size="md" />
            <Avatar name="Sana Kapoor" size="md" />
            <Tooltip content="Business settings">
              <Button intent="ghost" size="icon" aria-label="Settings">
                <Settings size={ICON_SIZE.md} />
              </Button>
            </Tooltip>
            <Spinner />
          </Demo>
        </Section>

        <Divider className="my-10" />

        {/* ---------------- Layout ---------------- */}
        <Section title="Layout">
          <Demo title="Card">
            <Card className="w-72">
              <CardHeader>
                <div>
                  <CardTitle>Business profile</CardTitle>
                  <CardDescription>Basic details customers will see</CardDescription>
                </div>
              </CardHeader>
              <p className="text-sm text-on-surface">The Gentleman&rsquo;s Chair, Bandra West</p>
              <CardFooter>
                <Button intent="primary" size="sm">
                  Save
                </Button>
                <Button intent="ghost" size="sm">
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </Demo>

          <Demo title="Modal / Drawer / ConfirmDialog">
            <Button intent="outline" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
            <Button intent="outline" onClick={() => setDrawerOpen(true)}>
              Open drawer
            </Button>
            <Button intent="danger" onClick={() => setConfirmOpen(true)}>
              Remove member…
            </Button>
          </Demo>

          <Demo title="Sidebar (Business/Admin)">
            <div className="h-80 w-full overflow-hidden rounded-2xl border border-border flex">
              <Sidebar
                items={SIDEBAR_ITEMS}
                header={<div className="text-sm font-semibold text-on-surface px-1">The Gentleman&rsquo;s Chair ▾</div>}
                footer={<ListItem leading={<Avatar name="Aman Rao" size="sm" />} title="Aman Rao" subtitle="Owner" />}
              />
              <div className="flex-1 p-4 text-sm text-muted">Page content renders here inside AppShell.</div>
            </div>
          </Demo>

          <Demo title="Bottom nav (Customer, mobile)">
            <div className="relative h-20 w-80 overflow-hidden rounded-2xl border border-border">
              <BottomNav items={BOTTOM_NAV_ITEMS} className="absolute inset-x-0 bottom-0 md:flex" />
            </div>
            <p className="text-xs text-muted w-full">
              (Forced visible here for the demo — real usage relies on the component&rsquo;s own <code className="font-mono">md:hidden</code>, since Business/Admin use `Sidebar` at every width instead.)
            </p>
          </Demo>
        </Section>

        <Divider className="my-10" />

        {/* ---------------- Feedback ---------------- */}
        <Section title="Feedback">
          <Demo title="Toast">
            <Button intent="outline" onClick={() => toast.success("Booking confirmed")}>
              Success toast
            </Button>
            <Button intent="outline" onClick={() => toast.error("Couldn't reach the server")}>
              Error toast
            </Button>
          </Demo>

          <Demo title="Empty / Error states">
            <div className="w-72 rounded-xl border border-border">
              <EmptyState
                icon={<Calendar size={ICON_SIZE.lg} />}
                title="No bookings yet"
                description="Book your first appointment to see it here."
                action={<Button size="sm">Browse businesses</Button>}
              />
            </div>
            <div className="w-72 rounded-xl border border-border">
              <ErrorState onRetry={() => toast("Retrying…")} />
            </div>
          </Demo>

          <Demo title="Skeletons">
            <div className="w-64 rounded-xl border border-border divide-y divide-border">
              <ListItemSkeleton />
              <ListItemSkeleton />
            </div>
            <div className="w-48">
              <CardSkeleton />
            </div>
            <Skeleton className="h-4 w-32" />
          </Demo>
        </Section>

        <Divider className="my-10" />

        {/* ---------------- Data ---------------- */}
        <Section title="Data display">
          <Demo title="Stat cards">
            <StatCard label="Bookings today" value={8} icon={<Calendar size={ICON_SIZE.md} />} trend={12} />
            <StatCard label="Revenue today" value="₹6,200" trend={-4} />
            <StatCard label="New reviews" value={3} icon={<Star size={ICON_SIZE.md} />} />
          </Demo>

          <Demo title="Tabs">
            <Tabs items={[{ label: "Upcoming", value: "upcoming" }, { label: "Past", value: "past" }, { label: "Cancelled", value: "cancelled" }]} defaultValue="upcoming" className="w-full">
              <TabsPanel value="upcoming">
                <p className="text-sm text-muted">1 upcoming booking.</p>
              </TabsPanel>
              <TabsPanel value="past">
                <p className="text-sm text-muted">No past bookings.</p>
              </TabsPanel>
              <TabsPanel value="cancelled">
                <p className="text-sm text-muted">No cancelled bookings.</p>
              </TabsPanel>
            </Tabs>
          </Demo>

          <Demo title="Data table">
            <DataTable columns={TABLE_COLUMNS} data={TABLE_ROWS} rowKey={(r) => r.id} className="w-full" />
          </Demo>

          <Demo title="Pagination">
            <Pagination page={page} pages={9} onPageChange={setPage} />
          </Demo>

          <Demo title="Timeline">
            <Timeline
              className="w-96"
              events={[
                { id: "1", title: "Approved by Priya S.", timestamp: "12 Jul, 3:04 PM", tone: "success" },
                { id: "2", title: "Submitted for review", timestamp: "12 Jul, 9:12 AM", tone: "neutral" },
              ]}
            />
          </Demo>

          <Demo title="Schedule grid">
            <ScheduleGrid
              className="w-full"
              startHour={9}
              endHour={13}
              resources={[
                { id: "aman", label: "Aman (Owner)" },
                { id: "priya", label: "Priya" },
              ]}
              events={[
                { id: "e1", resourceId: "aman", label: "Haircut — Raj K.", startMinutes: 9 * 60 + 30, endMinutes: 10 * 60, tone: "success" },
                { id: "e2", resourceId: "aman", label: "Beard — Vikram", startMinutes: 11 * 60, endMinutes: 11 * 60 + 30, tone: "warning" },
                { id: "e3", resourceId: "priya", label: "Spa — Neha", startMinutes: 10 * 60, endMinutes: 11 * 60, tone: "primary" },
              ]}
            />
          </Demo>
        </Section>

        <Divider className="my-10" />

        {/* ---------------- Booking domain ---------------- */}
        <Section title="Booking-domain components">
          <Demo title="BusinessCard / ProfessionalCard / ServiceCard">
            <BusinessCard
              name="The Gentleman's Chair"
              category="Barbershop"
              rating={4.8}
              reviewCount={212}
              distanceLabel="1.2 km"
              isFavorite={favorite}
              onFavoriteToggle={() => setFavorite((f) => !f)}
              className="w-64"
            />
            <ProfessionalCard name="Aman Rao" designation="Owner · Barber" rating={4.9} reviewCount={140} specialties={["Fades", "Beard sculpting"]} isOwner />
            <ServiceCard name="Haircut" description="Classic scissor cut, wash included" price={450} duration={30} selected={serviceSelected} onSelect={() => setServiceSelected((s) => !s)} className="w-72" />
          </Demo>

          <Demo title="BookingCard (status mirrors bookings.status exactly)">
            <BookingCard
              businessName="The Gentleman's Chair"
              professionalName="Aman"
              serviceNames={["Haircut", "Beard trim"]}
              dateLabel="Sat, 20 Jul"
              timeLabel="4:30 PM"
              status="confirmed"
              confirmationCode="REV8F2K4QRT"
              className="w-80"
            />
            <BookingCard
              businessName="Blush & Blade"
              professionalName="Sana"
              serviceNames={["Hair color"]}
              dateLabel="Mon, 22 Jul"
              timeLabel="11:00 AM"
              status="pending"
              className="w-80"
            />
          </Demo>

          <Demo title="TimeSlotPicker / RatingDisplay">
            <TimeSlotPicker slots={["09:00", "09:30", "10:00", "14:00", "14:30", "15:00", "18:30"]} selected={slot} onSelect={setSlot} className="w-80" />
            <RatingDisplay value={4.7} count={89} />
          </Demo>
        </Section>
      </Container>

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="Reschedule booking" description="Pick a new date and time for this appointment." footer={<><Button intent="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => { setModalOpen(false); toast.success("Booking rescheduled"); }}>Confirm</Button></>}>
        <TimeSlotPicker slots={["10:00", "10:30", "11:00", "15:00"]} selected={slot} onSelect={setSlot} />
      </Modal>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} title="Filter businesses" description="Narrow down Discover results." side="right" footer={<Button className="w-full" onClick={() => setDrawerOpen(false)}>Apply filters</Button>}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <CategoryChip selected>Haircut</CategoryChip>
            <CategoryChip>Beard</CategoryChip>
            <CategoryChip>Spa</CategoryChip>
          </div>
          <Checkbox label="Open now" checked={checked} onCheckedChange={setChecked} />
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remove team member?"
        description="Priya will lose access to this business immediately. This can't be undone."
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          setConfirmOpen(false);
          toast.success("Member removed");
        }}
      />
    </div>
  );
}
