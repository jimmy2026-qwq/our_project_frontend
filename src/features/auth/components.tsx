import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Alert, AlertDescription, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui';
import { cx } from '@/lib/cx';

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
  footerPrompt: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  fields: AuthField[];
  errorMessage: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  extraActions?: ReactNode;
}

function AuthFieldInput({ field }: { field: AuthField }) {
  return (
    <label htmlFor={field.id} className="grid gap-2">
      <span className="text-sm font-medium text-[color:var(--text)]">{field.label}</span>
      <Input
        id={field.id}
        type={field.type ?? 'text'}
        autoComplete={field.autoComplete}
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
  footerPrompt,
  footerLinkLabel,
  footerLinkTo,
  fields,
  errorMessage,
  isSubmitting,
  onSubmit,
  extraActions,
}: AuthScreenProps) {
  useEffect(() => {
    document.body.classList.add('auth-screen-open');

    return () => {
      document.body.classList.remove('auth-screen-open');
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1620] px-6 py-10 text-[color:var(--text)]">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-5">
          <p className="inline-flex w-fit rounded-full border border-[rgba(236,197,122,0.22)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[color:var(--gold)]">
            {eyebrow}
          </p>
          <div className="grid gap-4">
            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-[#c7d0d8] sm:text-5xl">{title}</h1>
            {description ? (
              <p className="max-w-xl text-base leading-8 text-[color:var(--muted)]">{description}</p>
            ) : null}
          </div>
        </div>

        <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(6,17,26,0.84)]">
          <CardHeader className="grid gap-3 border-b border-[color:var(--line)]">
            <p className="text-sm uppercase tracking-[0.22em] text-[color:var(--gold)]">{eyebrow}</p>
            <CardTitle className="text-2xl text-white">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </CardHeader>
          <CardContent className="grid gap-5">
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

              <div className={cx('min-h-16', errorMessage ? 'opacity-100' : 'opacity-0')}>
                <Alert variant="danger">
                  <AlertDescription>{errorMessage || 'placeholder'}</AlertDescription>
                </Alert>
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? '提交中...' : submitLabel}
              </Button>
            </form>

            {extraActions ? <div className="grid gap-3">{extraActions}</div> : null}

            <p className="text-sm text-[color:var(--muted)]">
              {footerPrompt}{' '}
              <Link className="text-[color:var(--teal-strong)] no-underline hover:text-[#b2f4ef]" to={footerLinkTo}>
                {footerLinkLabel}
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
