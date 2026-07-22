import AuthGate from "@/components/user/AuthGate";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
