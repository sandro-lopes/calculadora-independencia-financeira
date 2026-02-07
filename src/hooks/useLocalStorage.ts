import { useEffect, useCallback, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '@/types';

const STORAGE_KEY = 'calculadora-independencia-inputs';

export function useLocalStoragePersistence(
  form: UseFormReturn<FormValues>,
  defaultValues: FormValues
) {
  const isRestoring = useRef(false);

  const restore = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<FormValues>;
        if (parsed && typeof parsed === 'object') {
          isRestoring.current = true;
          const merged = { ...defaultValues, ...parsed };
          if (!Array.isArray(merged.eventosAvulsos)) merged.eventosAvulsos = [];
          merged.eventosAvulsos = merged.eventosAvulsos.map((e: Record<string, unknown>) => ({
            ...e,
            descricao: (e.descricao as string) ?? '',
            eventoId: (e.eventoId as string) ?? (e.id as string) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          })) as FormValues['eventosAvulsos'];
          form.reset(merged as FormValues);
          isRestoring.current = false;
        }
      }
    } catch {
      // ignore
    }
  }, [form, defaultValues]);

  useEffect(() => {
    restore();
  }, [restore]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const subscription = form.watch((values) => {
      if (isRestoring.current) return;
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        } catch {
          // ignore
        }
        timeoutId = null;
      }, 2000);
    });
    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [form]);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    form.reset(defaultValues);
  }, [form, defaultValues]);

  return { restore, clearStorage };
}
