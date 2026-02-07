import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

function formatPercentDisplay(value: number): string {
  if (value === 0) return '';
  // value está em decimal (ex: 0.125), multiplica por 100 para percentual (12.5)
  const percent = value * 100;
  const formatted = percent.toFixed(2);
  return formatted.replace('.', ',');
}

function parsePercentInput(str: string): number {
  // Remove tudo exceto dígitos
  const cleaned = str.replace(/\D/g, '');
  if (cleaned === '') return 0;
  // Trata como centésimos de percentual: "1250" = 12.50%
  const percentValue = parseInt(cleaned, 10) / 100;
  // Converte percentual para decimal: 12.50% -> 0.125
  return percentValue / 100;
}

export interface PercentInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
  maxPercent?: number;
}

const PercentInput = React.forwardRef<HTMLInputElement, PercentInputProps>(
  ({ className, value = 0, onChange, maxPercent = 100, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('');

    React.useEffect(() => {
      setDisplayValue(value > 0 ? formatPercentDisplay(value) : '');
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '');
      const num = parsePercentInput(raw);
      const maxDecimal = maxPercent / 100;
      const clamped = Math.max(0, Math.min(maxDecimal, num));
      
      // Atualiza display com máscara
      setDisplayValue(raw === '' ? '' : formatPercentDisplay(clamped));
      onChange?.(clamped);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (displayValue === '' || value === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(formatPercentDisplay(value));
      }
      props.onBlur?.(e);
    };

    const increment = () => {
      const maxDecimal = maxPercent / 100;
      const newValue = Math.min(maxDecimal, value + 0.0025); // +0.25%
      onChange?.(newValue);
    };

    const decrement = () => {
      const newValue = Math.max(0, value - 0.0025); // -0.25%
      onChange?.(newValue);
    };

    return (
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0,00"
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-[52px] text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className
          )}
          {...props}
        />
        <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          %
        </div>
        <div className="absolute right-0 top-0 flex h-full flex-col border-l border-input">
          <button
            type="button"
            onClick={increment}
            className="flex h-[18px] w-7 items-center justify-center rounded-tr border-b border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={decrement}
            className="flex h-[18px] w-7 items-center justify-center rounded-br bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }
);
PercentInput.displayName = 'PercentInput';

export { PercentInput };
