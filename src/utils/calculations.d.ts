export function rentabilidadeMensal(rentAnual: number): number;
export function aporteAnoN(aporteInicial: number, inflacao: number, ano: number): number;
export function valorReal(valorNominal: number, inflacao: number, anosDesdeHoje: number): number;
export function simularAcumulacao(params: {
  patrimonioInicial: number;
  aporteMensalInicial: number;
  inflacao: number;
  rentabilidade: number;
  idadeAtual: number;
  idadeAposentadoria: number;
  eventosAvulsos?: Array<{ id: string; tipo: string; valor: number; valorEm: string; idade: number }>;
}): Array<{
  ano: number;
  idade: number;
  aporteMensal: number;
  patrimonioNominal: number;
  patrimonioReal: number;
  eventoAvulso?: number;
}>;
export function simularRetirada(params: {
  patrimonioInicial: number;
  rendaMensalDesejada: number;
  inflacao: number;
  rentabilidade: number;
  idadeAposentadoria: number;
  idadeAtual: number;
  expectativaVida: number;
  anosAteAposentadoria: number;
  eventosAvulsos?: Array<{ id: string; tipo: string; valor: number; valorEm: string; idade: number }>;
}): { faseRetirada: Array<{ ano: number; idade: number; retiradaMensal: number; patrimonioNominal: number; patrimonioReal: number; eventoAvulso?: number }>; zerouAntes: boolean; anoQueZerou: number | null; patrimonioFinal: number };
export function calcularRetiradaQueEsgotaExatamente(params: {
  patrimonioInicial: number;
  inflacao: number;
  rentabilidade: number;
  anosAteAposentadoria: number;
  anosAposentadoria: number;
}): number;
export function calcularPatrimonioNecessario(
  rendaMensal: number,
  inflacao: number,
  rentabilidade: number,
  anosAposentadoria: number,
  anosAteAposentadoria: number
): number;
export function calcularResultadoCompleto(inputs: Record<string, unknown>): Record<string, unknown>;
export function calcularSugestoes(resultado: Record<string, unknown>, inputs: Record<string, unknown>): { aporteSugerido: number | null; anosExtras: number | null };
