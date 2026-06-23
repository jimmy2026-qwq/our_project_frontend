import { cx } from '@/components/ui/cx';
import { MahjongCommandTypes, type MahjongCommandType, type MahjongLegalAction } from '@/objects';

export interface DisplayActionButton {
  action?: MahjongLegalAction;
  commandType: MahjongCommandType;
  key: string;
  localSkipTsumo?: boolean;
}

export function getVisibleButtonActions(
  actions: MahjongLegalAction[],
  dismissedTsumoKey: string | null = null,
): DisplayActionButton[] {
  const collapsedActions = collapsePickerActions(actions);
  const tsumoKey = getTsumoActionKey(actions);
  const shouldHideTsumo = Boolean(
    dismissedTsumoKey && dismissedTsumoKey === tsumoKey,
  );
  const hasBackendPass = collapsedActions.some(
    (action) => action.commandType === MahjongCommandTypes.Pass,
  );
  const shouldAddLocalPass = Boolean(tsumoKey && !hasBackendPass);
  const visibleActions = shouldHideTsumo
    ? collapsedActions.filter(
        (action) => action.commandType !== MahjongCommandTypes.Tsumo,
      )
    : collapsedActions;
  const displayButtons: DisplayActionButton[] = [];

  for (const action of visibleActions) {
    const key = getActionIdentity(action);

    displayButtons.push({
      action,
      commandType: action.commandType,
      key,
    });

    if (
      action.commandType === MahjongCommandTypes.Tsumo &&
      shouldAddLocalPass
    ) {
      displayButtons.push({
        commandType: MahjongCommandTypes.Pass,
        key: `${key}:local-pass`,
        localSkipTsumo: true,
      });
    }
  }

  return displayButtons;
}

export function getTsumoActionKey(actions: MahjongLegalAction[]) {
  return actions
    .filter((action) => action.commandType === MahjongCommandTypes.Tsumo)
    .map(getActionIdentity)
    .sort()
    .join('|');
}

export function getActionButtonLabel(commandType: MahjongCommandType) {
  const labels: Record<MahjongCommandType, string> = {
    [MahjongCommandTypes.AbortiveDraw]: '流局',
    [MahjongCommandTypes.AddedKan]: '杠',
    [MahjongCommandTypes.Chi]: '吃',
    [MahjongCommandTypes.ClosedKan]: '杠',
    [MahjongCommandTypes.Discard]: '切牌',
    [MahjongCommandTypes.OpenKan]: '杠',
    [MahjongCommandTypes.Pass]: '跳过',
    [MahjongCommandTypes.Pon]: '碰',
    [MahjongCommandTypes.Riichi]: '立直',
    [MahjongCommandTypes.Ron]: '荣和',
    [MahjongCommandTypes.Tsumo]: '自摸',
  };

  return labels[commandType];
}

export function getActionButtonClassName(commandType: MahjongCommandType) {
  return cx(
    [
      'relative mt-7 inline-flex min-h-[46px] min-w-32 cursor-pointer items-center justify-center overflow-visible',
      'border px-[24px] pb-3 pt-5 text-center no-underline',
      '[font-family:"JetBrains_Sans","Segoe_UI",sans-serif] text-[0.98rem] font-black leading-none tracking-normal',
      'transition-[transform,border-color,background-color,box-shadow,color,opacity] duration-200',
      'shadow-[0_12px_26px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.12)]',
      'hover:enabled:-translate-y-px hover:enabled:shadow-[0_16px_34px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.16)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.2)]',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55',
    ].join(' '),
    getActionButtonToneClassName(commandType),
  );
}

export function getChiActionKey(actions: MahjongLegalAction[]) {
  return actions.map(getActionIdentity).sort().join('|');
}

function collapsePickerActions(actions: MahjongLegalAction[]) {
  let hasChi = false;
  let hasRiichi = false;

  return actions.filter((action) => {
    if (action.commandType === MahjongCommandTypes.Chi) {
      if (hasChi) {
        return false;
      }

      hasChi = true;
      return true;
    }

    if (action.commandType === MahjongCommandTypes.Riichi) {
      if (hasRiichi) {
        return false;
      }

      hasRiichi = true;
      return true;
    }

    return true;
  });
}

function getActionButtonToneClassName(commandType: MahjongCommandType) {
  if (
    commandType === MahjongCommandTypes.Chi ||
    commandType === MahjongCommandTypes.Pon ||
    commandType === MahjongCommandTypes.OpenKan ||
    commandType === MahjongCommandTypes.ClosedKan ||
    commandType === MahjongCommandTypes.AddedKan
  ) {
    return 'border-[rgba(95,214,145,0.48)] bg-[linear-gradient(180deg,rgba(43,148,93,0.94),rgba(23,103,71,0.94))] text-[#d7ffe5]';
  }

  if (commandType === MahjongCommandTypes.Riichi) {
    return 'border-[rgba(255,181,89,0.58)] bg-[linear-gradient(180deg,rgba(231,138,50,0.96),rgba(168,83,30,0.96))] text-[#fff0d2]';
  }

  if (
    commandType === MahjongCommandTypes.Ron ||
    commandType === MahjongCommandTypes.Tsumo
  ) {
    return 'border-[rgba(255,112,112,0.58)] bg-[linear-gradient(180deg,rgba(211,64,69,0.96),rgba(132,35,48,0.96))] text-[#ffe1e1]';
  }

  if (commandType === MahjongCommandTypes.Pass) {
    return 'border-[rgba(190,200,210,0.34)] bg-[linear-gradient(180deg,rgba(96,108,121,0.9),rgba(55,64,76,0.9))] text-[#edf2f7]';
  }

  return 'border-[rgba(219,175,98,0.36)] bg-[linear-gradient(180deg,rgba(83,124,210,0.92),rgba(56,85,162,0.92))] text-[#f5c98e]';
}

function getActionIdentity(action: MahjongLegalAction) {
  return [
    action.commandType,
    action.targetSequenceNo ?? '',
    action.tile ?? '',
    ...(action.tiles ?? []),
  ].join(':');
}
