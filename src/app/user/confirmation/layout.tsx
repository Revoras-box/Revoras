import AuthGate from "@/components/user/AuthGate";

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
