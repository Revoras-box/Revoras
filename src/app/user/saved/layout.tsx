import AuthGate from "@/components/user/AuthGate";

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
