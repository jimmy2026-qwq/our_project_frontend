import { AuthScreenCard } from './AuthScreenCard';
import { AuthScreenFrame } from './AuthScreenFrame';
import { AuthScreenIntro } from './AuthScreenIntro';
import type { AuthScreenProps } from './objects/AuthScreenProps';

/** 组合认证页面框架、介绍和卡片的通用屏幕组件。 */
export function AuthScreen({
  eyebrow,
  title,
  description,
  ...cardProps
}: AuthScreenProps) {
  return (
    <AuthScreenFrame>
      <AuthScreenIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <AuthScreenCard
        eyebrow={eyebrow}
        title={title}
        description={description}
        {...cardProps}
      />
    </AuthScreenFrame>
  );
}
