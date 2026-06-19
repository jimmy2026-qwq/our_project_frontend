// 役满爆牌动画依赖 keyframes、CSS 变量和多层径向渐变组合。
// Tailwind 无法稳定表达/渲染这个效果，所以这里刻意保留原生 CSS。
export function YakumanTileBurstStyles() {
  return (
    <style>{`
      .yakuman-burst-backdrop {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 50% 50%, rgba(255, 236, 166, 0.32), rgba(230, 75, 30, 0.16) 32%, rgba(0, 0, 0, 0.76) 72%);
        animation: yakuman-burst-backdrop 4.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        transform-origin: center;
      }

      .yakuman-burst-center {
        position: absolute;
        left: 50%;
        top: 50%;
        height: 360px;
        width: 360px;
        transform: translate(-50%, -50%);
      }

      .yakuman-burst-glow {
        height: 100%;
        width: 100%;
        border: 1px solid rgba(255, 216, 120, 0.24);
        border-radius: 9999px;
        background: radial-gradient(circle, rgba(255, 216, 120, 0.22), rgba(186, 44, 28, 0.12) 48%, transparent 70%);
        box-shadow: 0 0 86px rgba(255, 178, 82, 0.35), inset 0 0 64px rgba(255, 236, 166, 0.14);
        animation: yakuman-burst-glow 4.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        transform-origin: center;
      }

      .yakuman-burst-tile-anchor {
        position: absolute;
        left: 50%;
        top: 50%;
        display: block;
        width: 58px;
      }

      .yakuman-burst-tile {
        display: block;
        animation: yakuman-burst-tile 4.02s cubic-bezier(0.16, 0.8, 0.22, 1) var(--burst-delay) both;
        transform-origin: center;
      }

      .yakuman-burst-title-anchor {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 40;
      }

      .yakuman-burst-title {
        display: grid;
        justify-items: center;
        gap: 0.75rem;
        text-align: center;
        animation: yakuman-burst-title 4.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
      }

      @keyframes yakuman-burst-backdrop {
        0% {
          opacity: 0;
          transform: scale(0.92);
        }
        14% {
          opacity: 1;
          transform: scale(1);
        }
        76% {
          opacity: 1;
          transform: scale(1);
        }
        100% {
          opacity: 0;
          transform: scale(1.08);
        }
      }

      @keyframes yakuman-burst-glow {
        0% {
          opacity: 0;
          transform: scale(0.88);
        }
        14% {
          opacity: 1;
          transform: scale(1);
        }
        76% {
          opacity: 1;
          transform: scale(1);
        }
        100% {
          opacity: 0;
          transform: scale(1.16);
        }
      }

      @keyframes yakuman-burst-title {
        0% {
          opacity: 0;
          transform: scale(0.54) translateY(18px);
          filter: blur(5px);
        }
        14% {
          opacity: 1;
          transform: scale(1.08) translateY(0);
          filter: blur(0);
        }
        58% {
          opacity: 1;
          transform: scale(1) translateY(0);
          filter: blur(0);
        }
        100% {
          opacity: 0;
          transform: scale(1.72) translateY(-18px);
          filter: blur(2px);
        }
      }

      @keyframes yakuman-burst-tile {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.42) rotate(0deg);
          filter: brightness(1.18) drop-shadow(0 0 0 rgba(255, 216, 120, 0));
        }

        15% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.18) rotate(0deg);
          filter: brightness(1.22) drop-shadow(0 0 12px rgba(255, 216, 120, 0.48));
        }

        68% {
          opacity: 1;
          transform:
            translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y)))
            scale(1)
            rotate(var(--burst-rotate));
          filter: brightness(1.16) drop-shadow(0 16px 22px rgba(0, 0, 0, 0.38));
        }

        70% {
          opacity: 1;
          transform:
            translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y)))
            scale(1)
            rotate(var(--burst-rotate));
          filter: brightness(1.16) drop-shadow(0 16px 22px rgba(0, 0, 0, 0.38));
        }

        100% {
          opacity: 0;
          transform:
            translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y)))
            scale(0.92)
            rotate(var(--burst-rotate));
          filter: brightness(0.92) drop-shadow(0 18px 28px rgba(0, 0, 0, 0.42));
        }
      }
    `}</style>
  );
}
