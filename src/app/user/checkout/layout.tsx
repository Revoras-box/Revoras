import AuthGate from "@/components/user/AuthGate";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
