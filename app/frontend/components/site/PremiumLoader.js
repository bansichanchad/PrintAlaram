'use client';

export default function PremiumLoader({ label = 'Loading' }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-cream" data-testid="page-loading-indicator">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-gold/25 border-t-gold animate-spin" />
        <p className="text-sm text-plum/60 font-serif-elegant">{label}…</p>
      </div>
    </div>
  );
}
