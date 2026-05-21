import type { HTMLAttributes, ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function InfoCard({
  title,
  description,
  aside,
  className,
  children,
}: Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="mb-2">{title}</CardTitle>
            {description ? <p className="leading-7 text-[#9ab0c1]">{description}</p> : null}
          </div>
          {aside}
        </div>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}
