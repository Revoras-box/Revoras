import AuthGate from "@/components/user/AuthGate";

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
