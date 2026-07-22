import AuthGate from "@/components/user/AuthGate";

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
