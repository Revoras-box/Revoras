import { Card, Section } from "@/components/ui";
import type { BusinessDetail } from "@/lib/types";

interface BusinessPoliciesProps {
  business: BusinessDetail;
}

const POLICY_LABELS: { key: keyof NonNullable<BusinessDetail["policies"]>; label: string }[] = [
  { key: "cancellation", label: "Cancellation policy" },
  { key: "rescheduling", label: "Rescheduling policy" },
  { key: "refund", label: "Refund policy" },
  { key: "general", label: "General policy" },
];

export default function BusinessPolicies({ business }: BusinessPoliciesProps) {
  const policies = business.policies ?? {};
  const houseRules = business.house_rules ?? [];

  const policyEntries = POLICY_LABELS.filter(({ key }) => policies[key]);
  if (policyEntries.length === 0 && houseRules.length === 0) return null;

  return (
    <Section title="Policies & house rules">
      <div className="grid gap-4 md:grid-cols-2">
        {policyEntries.map(({ key, label }) => (
          <Card key={key} padding="md">
            <h4 className="mb-2 text-sm font-semibold text-on-surface">{label}</h4>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{policies[key]}</p>
          </Card>
        ))}
        {houseRules.length > 0 ? (
          <Card padding="md">
            <h4 className="mb-2 text-sm font-semibold text-on-surface">House rules</h4>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted">
              {houseRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </Section>
  );
}
