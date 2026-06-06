import { useAuth } from '@/app/auth/useAuth';
import { useShowcaseMode } from '@/app/showcaseMode';

export function ShowcaseModeToggle() {
  const { session } = useAuth();
  const [enabled, setEnabled] = useShowcaseMode();

  if (!session?.user.roles.isSuperAdmin) {
    return null;
  }

  return (
    <label className="fixed right-5 top-5 z-[80] inline-flex items-center gap-2 rounded-full border border-[rgba(242,247,251,0.3)] bg-[rgba(5,14,23,0.82)] px-3 py-2 text-xs font-semibold text-[#f2f7fb] shadow-[0_12px_32px_rgba(0,0,0,0.26)] backdrop-blur">
      <input
        type="checkbox"
        className="h-4 w-4 accent-[#f2f7fb]"
        checked={enabled}
        onChange={(event) => setEnabled(event.currentTarget.checked)}
      />
      <span>展示模式</span>
    </label>
  );
}
