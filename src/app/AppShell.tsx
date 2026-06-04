import { Outlet, useLocation } from 'react-router-dom';

import { NotificationProvider } from '@/notifications';

const appShellClassNames = {
  root: 'relative mx-auto min-h-screen w-[min(1280px,calc(100%_-_32px))] px-0 pb-16 pt-[26px] [font-family:"JetBrains_Sans","Segoe_UI",sans-serif] [&_button]:[font-family:"JetBrains_Sans","Segoe_UI",sans-serif] [&_input]:[font-family:"JetBrains_Sans","Segoe_UI",sans-serif] [&_select]:[font-family:"JetBrains_Sans","Segoe_UI",sans-serif] [&_textarea]:[font-family:"JetBrains_Sans","Segoe_UI",sans-serif]',
  scene:
    'pointer-events-none fixed inset-0 -z-[3] bg-[url("/public-hall.jpeg")] bg-cover bg-center bg-no-repeat',
  content: 'relative z-[1] grid gap-[22px] bg-transparent shadow-none backdrop-blur-none',
  routeStage: 'relative z-[1] min-h-[60vh] bg-transparent shadow-none backdrop-blur-none',
};

export function AppShell() {
  const location = useLocation();

  return (
    <NotificationProvider>
      <div className={appShellClassNames.root}>
        <div className={appShellClassNames.scene} aria-hidden="true" />

        <main className={appShellClassNames.content}>
          <section
            key={location.pathname + location.search}
            className={appShellClassNames.routeStage}
          >
            <Outlet />
          </section>
        </main>
      </div>
    </NotificationProvider>
  );
}
