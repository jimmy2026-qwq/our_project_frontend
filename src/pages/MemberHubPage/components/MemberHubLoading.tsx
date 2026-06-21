import { LoadingSection } from '@/components/ui';

/** 成员中心加载期间的进度状态。 */
export function MemberHubLoading() {
  return (
    <LoadingSection
      eyebrow="会员中心"
      title="会员工作台"
      description="正在读取操作身份、数据看板和俱乐部申请。"
    >
      正在加载会员工作台...
    </LoadingSection>
  );
}
