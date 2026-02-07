import * as React from 'react';
import { cn } from '@/lib/utils';

function formatCurrencyDisplay(value: number): string {
  if (value === 0) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function parseCurrencyValue(str: string): number {
  const cleaned = str.replace(/\D/g, '');
  if (cleaned === '') return 0;
  return parseInt(cleaned, 10) / 100;
}

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = 0, onChange, onBlur, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('');
    const isControlled = value !== undefined && value !== null;

    React.useEffect(() => {
      if (isControlled) {
        setDisplayValue(value > 0 ? formatCurrencyDisplay(value) : '');
      }
    }, [value, isControlled]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '');
      const num = raw === '' ? 0 : parseInt(raw, 10) / 100;
      setDisplayValue(raw === '' ? '' : formatCurrencyDisplay(num));
      onChange?.(num);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (displayValue === '' || parseCurrencyValue(displayValue) === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(formatCurrencyDisplay(parseCurrencyValue(displayValue)));
      }
      onBlur?.(e);
    };

    return (
      <input
        type="text"
        inputMode="numeric"
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="R$ 0,00"
        maxLength={16}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        {...props}
      />
    );
  }
);
CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
