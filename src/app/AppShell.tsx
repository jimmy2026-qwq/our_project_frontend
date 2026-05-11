import { Outlet, useLocation } from 'react-router-dom';

export function AppShell() {
  const location = useLocation();

  return (
    <div className="public-shell app-shell app-shell--mahjong template-app-shell gap-6">
      <div className="app-shell__scene" aria-hidden="true" />

      <main className="public-shell__content app-shell__content grid gap-[22px]">
        <section
          key={`${location.pathname}${location.search}`}
          className="template-route-root app-shell__route-stage"
        >
          <Outlet />
        </section>
      </main>
    </div>
  );
}
