import AuthGate from "@/components/user/AuthGate";

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
