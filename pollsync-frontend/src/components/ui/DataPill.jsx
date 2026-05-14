
export default function DataPill({ children, icon }) {
  return (
    <div className="bg-surface-container text-on-surface-variant font-jetbrains-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-outline-variant/30 inline-flex items-center gap-1.5">
      {icon && (
        <span className="material-symbols-outlined text-[14px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}
