import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

function getRouteErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return error.statusText || error.data?.message || 'HTTP ' + error.status;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '未知路由错误';
}

export function RouteErrorFallback() {
  const error = useRouteError();

  return (
    <main className="grid min-h-screen place-items-center bg-[#0b1620] px-6 py-10 text-[#f2f7fb] [font-family:&quot;JetBrains_Sans&quot;,&quot;Segoe_UI&quot;,sans-serif]">
      <section className="grid max-w-xl gap-5 rounded-[24px] border border-[rgba(176,223,229,0.14)] bg-[rgba(8,18,29,0.94)] p-6 shadow-[0_24px_72px_rgba(0,0,0,0.28)]">
        <p className="m-0 text-sm text-[#ecc57a]">路由加载失败</p>
        <h1 className="m-0 text-2xl text-[#f2f7fb]">这个页面暂时打不开</h1>
        <p className="m-0 leading-7 text-[#9ab0c1]">
          通常是前端热更新后旧页面块失效，刷新页面即可恢复。
        </p>
        <p className="m-0 rounded-[16px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm leading-6 text-[#c7d6e2]">
          {getRouteErrorMessage(error)}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="min-h-11 rounded-2xl border border-[rgba(114,216,209,0.28)] bg-[rgba(5,14,23,0.88)] px-5 py-2.5 text-[#f2f7fb]"
            onClick={() => window.location.reload()}
          >
            刷新页面
          </button>
          <Link
            className="inline-flex min-h-11 items-center rounded-2xl border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] px-5 py-2.5 text-[#f2f7fb] no-underline"
            to="/public"
          >
            返回公共大厅
          </Link>
        </div>
      </section>
    </main>
  );
}
