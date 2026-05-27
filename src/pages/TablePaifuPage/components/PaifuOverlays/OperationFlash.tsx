import { operationPositionClasses } from '../paifuTableLayout';
import type { ActiveOperation } from './PaifuOverlays.types';

export function OperationFlash({
  operation,
}: {
  operation?: ActiveOperation;
}) {
  if (!operation) {
    return null;
  }

  return (
    <div
      key={operation.key}
      className={[
        'pointer-events-none absolute z-[12] text-3xl font-bold text-white opacity-100 [text-shadow:0_2px_12px_rgba(0,0,0,0.74)]',
        operationPositionClasses[operation.seat],
      ].join(' ')}
    >
      {operation.label}
    </div>
  );
}
