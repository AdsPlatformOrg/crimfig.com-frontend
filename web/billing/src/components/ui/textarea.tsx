import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, style, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn('cf-input', className)}
      style={{ resize: 'vertical', ...style }}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export { Textarea };
