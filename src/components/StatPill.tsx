export function StatPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-[13px] font-medium text-fg-muted">
      {children}
    </span>
  );
}
