import type { ComponentPropsWithoutRef } from 'react';

export default function SiteLink({ children, ...props }: ComponentPropsWithoutRef<'a'>) {
  return <a {...props}>{children}</a>;
}
