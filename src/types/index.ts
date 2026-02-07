import { z } from 'zod';

export const eventoAvulsoSchema = z.object({
  eventoId: z.string(),
  tipo: z.enum(['aporte', 'retirada']),
  valor: z.number().min(0),
  valorEm: z.enum(['nominal', 'presente']),
  idade: z.number().min(18).max(120),
  descricao: z.string().optional(),
});

export type EventoAvulso = z.infer<typeof eventoAvulsoSchema>;

export type Resultado = {
  faseAcumulacao: Array<{
    ano: number;
    idade: number;
    aporteMensal: number;
    patrimonioNominal: number;
    patrimonioReal: number;
    eventoAvulso?: number;
  }>;
  faseRetirada: Array<{
    ano: number;
    idade: number;
    retiradaMensal: number;
    patrimonioNominal: number;
    patrimonioReal: number;
    eventoAvulso?: number;
  }>;
  patrimonioNecessario: number;
  patrimonioProjetado: number;
  patrimonioProjetadoReal?: number;
  status: 'ok' | 'insuficiente' | 'superavitario';
  retiradaInicial: number;
  retiradaFinal: number;
  zerouAntes: boolean;
  anoQueZerou: number | null;
  trajetoriaAportes: {
    primeiroAno: number;
    ano5: number | null;
    ano10: number | null;
    ultimoAno: number | null;
  };
  anosAteAposentadoria: number;
  anosAposentadoria: number;
  herancaNominal?: number | null;
  herancaReal?: number | null;
  retiradaAjustada?: number | null;
  rendaMensalDesejada?: number;
  sugestoes?: {
    aporteSugerido: number | null;
    anosExtras: number | null;
  };
};

export const formSchema = z
  .object({
    idadeAtual: z.number().min(12).max(100),
    patrimonioAtual: z.number().min(0),
    poupancaMensal: z.number().min(0),
    idadeAposentadoria: z.number().min(18).max(100),
    rendaMensalDesejada: z.number().min(0),
    expectativaVida: z.number().min(60).max(120),
    inflacao: z.number().min(0).max(0.5),
    rentabilidade: z.number().min(0).max(1),
    eventosAvulsos: z.array(eventoAvulsoSchema),
  })
  .refine((d) => d.idadeAposentadoria > d.idadeAtual, {
    message: 'Idade de aposentadoria deve ser maior que idade atual',
    path: ['idadeAposentadoria'],
  })
  .refine((d) => d.expectativaVida > d.idadeAposentadoria, {
    message: 'Expectativa de vida deve ser maior que idade de aposentadoria',
    path: ['expectativaVida'],
  });

export type FormValues = z.infer<typeof formSchema>;

export const defaultValues: FormValues = {
  idadeAtual: 18,
  patrimonioAtual: 0,
  poupancaMensal: 3000,
  idadeAposentadoria: 60,
  rendaMensalDesejada: 15000,
  expectativaVida: 80,
  inflacao: 0.05,
  rentabilidade: 0.12,
  eventosAvulsos: [],
};
