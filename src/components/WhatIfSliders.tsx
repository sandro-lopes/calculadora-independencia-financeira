import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResultCards } from './ResultCards';
import { useCalculations } from '@/hooks/useCalculations';
import type { FormValues } from '@/types';

export function WhatIfSliders() {
  const form = useFormContext<FormValues>();
  const values = form.watch();
  const resultado = useCalculations(values);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
        <FormField
          control={form.control}
          name="inflacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inflação (0-50%): {(field.value * 100).toFixed(1)}%</FormLabel>
              <FormControl>
                <Slider
                  value={[field.value * 100]}
                  onValueChange={([v]) => field.onChange(v / 100)}
                  min={0}
                  max={50}
                  step={0.5}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rentabilidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rentabilidade (0-25%): {(field.value * 100).toFixed(1)}%</FormLabel>
              <FormControl>
                <Slider
                  value={[field.value * 100]}
                  onValueChange={([v]) => field.onChange(v / 100)}
                  min={0}
                  max={25}
                  step={0.5}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="poupancaMensal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Poupança mensal: R$ {field.value.toLocaleString('pt-BR')} / mês
              </FormLabel>
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={([v]) => field.onChange(v)}
                  min={0}
                  max={50000}
                  step={100}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idadeAposentadoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idade aposentadoria: {field.value} anos</FormLabel>
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={([v]) => field.onChange(v)}
                  min={values.idadeAtual + 1}
                  max={values.expectativaVida - 1}
                  step={1}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado em tempo real</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultCards resultado={resultado} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
