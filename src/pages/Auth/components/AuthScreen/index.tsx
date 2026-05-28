import { AuthScreenCard } from './AuthScreenCard';
import { AuthScreenFrame } from './AuthScreenFrame';
import { AuthScreenIntro } from './AuthScreenIntro';
import type { AuthScreenProps } from './AuthScreen.types';

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

