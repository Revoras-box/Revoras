export function StepHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-medium uppercase tracking-widest text-primary">{eyebrow}</p>
      <h1 className="mt-1 font-headline text-2xl font-semibold text-on-surface sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
