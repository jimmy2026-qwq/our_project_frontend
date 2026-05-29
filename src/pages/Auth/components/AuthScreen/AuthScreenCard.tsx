import { Link } from 'react-router-dom';

import { cx } from '@/components/ui/cx';

import { AuthFieldInput } from './AuthFieldInput';
import {
  outlineButtonClassName,
  primaryButtonClassName,
} from './AuthScreen.styles';
import type { AuthScreenProps } from './AuthScreen.types';

export function AuthScreenCard({
  eyebrow,
  title,
  description,
  submitLabel,
  submittingLabel = '提交中...',
  footerPrompt,
  footerLinkLabel,
  footerLinkTo,
  fields,
  errorMessage,
  isSubmitting,
  onSubmit,
  secondaryAction,
  extraActions,
}: AuthScreenProps) {
  return (
    <article className="flex flex-col rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(6,17,26,0.84)] shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-[18px]">
      <AuthScreenCardHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <div className="grid gap-5 p-[22px]">
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          {fields.map((field) => (
            <AuthFieldInput key={field.id} field={field} />
          ))}

          <AuthScreenError message={errorMessage} />

          <button
            type="submit"
            className={primaryButtonClassName}
            disabled={isSubmitting}
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </form>

        <AuthScreenActions
          secondaryAction={secondaryAction}
          extraActions={extraActions}
        />

        <p className="text-sm text-[#9ab0c1]">
          {footerPrompt}{' '}
          <Link
            className="text-[#8fe8e1] no-underline hover:text-[#b2f4ef]"
            to={footerLinkTo}
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </article>
  );
}

function AuthScreenCardHeader({
  eyebrow,
  title,
  description,
}: Pick<AuthScreenProps, 'eyebrow' | 'title' | 'description'>) {
  return (
    <div className="grid gap-3 border-b border-[rgba(176,223,229,0.14)] p-[22px]">
      <p className="text-sm uppercase tracking-[0.22em] text-[#ecc57a]">
        {eyebrow}
      </p>
      <h3 className="m-0 text-2xl text-white">{title}</h3>
      {description ? (
        <p className="mt-2 mb-0 leading-7 text-[#9ab0c1]">{description}</p>
      ) : null}
    </div>
  );
}

function AuthScreenError({ message }: { message: string }) {
  return (
    <div className={cx('min-h-16', message ? 'opacity-100' : 'opacity-0')}>
      <div
        role="alert"
        className="grid w-full gap-2 rounded-[20px] border border-[rgba(236,122,122,0.28)] bg-[rgba(255,255,255,0.04)] px-[18px] py-4 text-sm"
      >
        <div className="leading-[1.7] text-[#9ab0c1]">
          {message || 'placeholder'}
        </div>
      </div>
    </div>
  );
}

function AuthScreenActions({
  secondaryAction,
  extraActions,
}: Pick<AuthScreenProps, 'secondaryAction' | 'extraActions'>) {
  if (secondaryAction) {
    return (
      <div className="grid gap-3">
        <button
          type="button"
          className={outlineButtonClassName}
          disabled={secondaryAction.disabled}
          onClick={secondaryAction.onClick}
        >
          {secondaryAction.label}
        </button>
      </div>
    );
  }

  if (extraActions) {
    return <div className="grid gap-3">{extraActions}</div>;
  }

  return null;
}
