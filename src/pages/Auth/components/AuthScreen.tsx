import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cx } from '@/components/ui/cx';

const inputClassName = [
  'flex min-h-11 w-full min-w-0 rounded-[14px] border border-[rgba(176,223,229,0.14)]',
  'bg-[rgba(5,14,23,0.88)] px-3.5 py-[11px] text-[#f2f7fb]',
  'shadow-xs outline-none transition-[transform,border-color,background-color,box-shadow,color,opacity] duration-200',
  'placeholder:text-[#9ab0c1] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55',
  'focus-visible:border-[rgba(114,216,209,0.36)] focus-visible:shadow-[0_0_0_3px_rgba(114,216,209,0.12)]',
  'focus-visible:outline-none hover:enabled:-translate-y-px',
].join(' ');

const buttonBaseClassName = [
  'inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border px-5 py-3',
  'font-medium text-[#f2f7fb] no-underline transition-[transform,border-color,background-color,box-shadow,color,opacity] duration-200',
  'disabled:pointer-events-none disabled:opacity-55',
  'focus-visible:border-[rgba(114,216,209,0.36)] focus-visible:shadow-[0_0_0_3px_rgba(114,216,209,0.12)] focus-visible:outline-none',
  'hover:enabled:-translate-y-px',
].join(' ');

const primaryButtonClassName = cx(
  buttonBaseClassName,
  'border-[rgba(114,216,209,0.28)] bg-[rgba(5,14,23,0.88)]',
);

const outlineButtonClassName = cx(
  buttonBaseClassName,
  'border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)]',
);

interface AuthField {
  id: string;
  label: string;
  type?: 'text' | 'password';
  autoComplete?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

interface AuthScreenProps {
  eyebrow: string;
  title: string;
  description?: string;
  submitLabel: string;
  submittingLabel?: string;
  footerPrompt: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  fields: AuthField[];
  errorMessage: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  secondaryAction?: {
    label: string;
    disabled?: boolean;
    onClick: () => void;
  };
  extraActions?: ReactNode;
}

function AuthFieldInput({ field }: { field: AuthField }) {
  return (
    <label htmlFor={field.id} className="grid gap-2">
      <span className="text-sm font-medium text-[#f2f7fb]">
        {field.label}
      </span>
      <input
        id={field.id}
        type={field.type ?? 'text'}
        autoComplete={field.autoComplete}
        className={inputClassName}
        placeholder={field.placeholder}
        value={field.value}
        onChange={(event) => field.onChange(event.target.value)}
      />
    </label>
  );
}

export function AuthScreen({
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
    <main className={'relative z-10 min-h-screen overflow-hidden bg-[#0b1620] px-6 py-10 [font-family:"JetBrains_Sans","Segoe_UI",sans-serif] text-[#f2f7fb] [&_button]:[font-family:"JetBrains_Sans","Segoe_UI",sans-serif] [&_input]:[font-family:"JetBrains_Sans","Segoe_UI",sans-serif]'}>
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-5">
          <p className="inline-flex w-fit rounded-full border border-[rgba(236,197,122,0.22)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[#ecc57a]">
            {eyebrow}
          </p>
          <div className="grid gap-4">
            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-[#c7d0d8] sm:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="max-w-xl text-base leading-8 text-[#9ab0c1]">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <article className="flex flex-col rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(6,17,26,0.84)] shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-[18px]">
          <div className="grid gap-3 border-b border-[rgba(176,223,229,0.14)] p-[22px]">
            <p className="text-sm uppercase tracking-[0.22em] text-[#ecc57a]">
              {eyebrow}
            </p>
            <h3 className="m-0 text-2xl text-white">{title}</h3>
            {description ? (
              <p className="mt-2 mb-0 leading-7 text-[#9ab0c1]">
                {description}
              </p>
            ) : null}
          </div>
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

              <div
                className={cx(
                  'min-h-16',
                  errorMessage ? 'opacity-100' : 'opacity-0',
                )}
              >
                <div
                  role="alert"
                  className="grid w-full gap-2 rounded-[20px] border border-[rgba(236,122,122,0.28)] bg-[rgba(255,255,255,0.04)] px-[18px] py-4 text-sm"
                >
                  <div className="leading-[1.7] text-[#9ab0c1]">
                    {errorMessage || 'placeholder'}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={primaryButtonClassName}
                disabled={isSubmitting}
              >
                {isSubmitting ? submittingLabel : submitLabel}
              </button>
            </form>

            {secondaryAction ? (
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
            ) : extraActions ? (
              <div className="grid gap-3">{extraActions}</div>
            ) : null}

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
      </section>
    </main>
  );
}
