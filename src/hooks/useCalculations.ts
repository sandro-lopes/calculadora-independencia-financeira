import { useMemo } from 'react';
import {
  calcularResultadoCompleto,
  calcularSugestoes,
} from '@/utils/calculations';
import type { FormValues, Resultado } from '@/types';

export function useCalculations(inputs: FormValues | null): Resultado | null {
  return useMemo(() => {
    if (!inputs) return null;
    const resultado = calcularResultadoCompleto(inputs) as Omit<Resultado, 'sugestoes'>;
    const sugestoes = calcularSugestoes(resultado, inputs);
    return { ...resultado, sugestoes };
  }, [inputs]);
}
