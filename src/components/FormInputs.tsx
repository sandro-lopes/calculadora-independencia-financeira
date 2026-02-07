import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { PercentInput } from '@/components/ui/PercentInput';
import { EventosAvulsosForm } from '@/components/EventosAvulsosForm';
import type { FormValues } from '@/types';

export function FormInputs() {
  const form = useFormContext<FormValues>();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="idadeAtual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idade atual</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  min={12}
                  max={100}
                  value={field.value === 0 ? '' : String(field.value ?? '')}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    if (v === '') field.onChange(0);
                    else {
                      const n = parseInt(v, 10);
                      if (!isNaN(n)) field.onChange(Math.min(100, Math.max(0, n)));
                    }
                  }}
                  onBlur={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    if (v === '') field.onChange(18);
                    else {
                      const n = parseInt(v, 10);
                      if (!isNaN(n)) field.onChange(Math.min(100, Math.max(12, n)));
                    }
                    field.onBlur();
                  }}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patrimonioAtual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patrimônio atual (R$)</FormLabel>
              <FormControl>
                <CurrencyInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="poupancaMensal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poupança mensal atual (R$)</FormLabel>
              <FormControl>
                <CurrencyInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idadeAposentadoria"
          render={({ field }) => {
            const idadeAtual = form.watch('idadeAtual');
            const minIdade = idadeAtual + 1;
            return (
              <FormItem>
                <FormLabel>Idade de aposentadoria desejada</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    min={minIdade}
                    max={100}
                    value={field.value === 0 ? '' : String(field.value ?? '')}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '');
                      if (v === '') field.onChange(0);
                      else {
                        const n = parseInt(v, 10);
                        if (!isNaN(n)) field.onChange(Math.min(100, Math.max(0, n)));
                      }
                    }}
                    onBlur={(e) => {
                      const v = e.target.value.replace(/\D/g, '');
                      if (v === '') field.onChange(minIdade);
                      else {
                        const n = parseInt(v, 10);
                        if (!isNaN(n)) field.onChange(Math.min(100, Math.max(minIdade, n)));
                      }
                      field.onBlur();
                    }}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="rendaMensalDesejada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Renda mensal desejada na aposentadoria (R$, em poder de compra de hoje)</FormLabel>
              <FormControl>
                <CurrencyInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expectativaVida"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expectativa de vida (anos)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  min={60}
                  max={120}
                  value={field.value === 0 ? '' : String(field.value ?? '')}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    if (v === '') field.onChange(0);
                    else {
                      const n = parseInt(v, 10);
                      if (!isNaN(n)) field.onChange(Math.min(120, Math.max(0, n)));
                    }
                  }}
                  onBlur={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    if (v === '') field.onChange(60);
                    else {
                      const n = parseInt(v, 10);
                      if (!isNaN(n)) field.onChange(Math.min(120, Math.max(60, n)));
                    }
                    field.onBlur();
                  }}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inflacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inflação esperada</FormLabel>
              <FormControl>
                <PercentInput value={field.value} onChange={field.onChange} maxPercent={50} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rentabilidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rentabilidade nominal ao ano</FormLabel>
              <FormControl>
                <PercentInput value={field.value} onChange={field.onChange} maxPercent={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <EventosAvulsosForm />
    </div>
  );
}
