import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { aporteAnoN } from '@/utils/calculations';

type Props = {
  aporteInicial: number;
  inflacao: number;
  anos: number;
};

export function ComparativoAportesChart({ aporteInicial, inflacao, anos }: Props) {
  const data = Array.from({ length: anos + 1 }, (_, i) => ({
    ano: i,
    corrigido: aporteAnoN(aporteInicial, inflacao, i),
    fixo: aporteInicial,
  }));

  const formatValue = (v: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(v);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ano" />
        <YAxis tickFormatter={formatValue} />
        <Tooltip
          formatter={(value: number | undefined) => [value != null ? formatValue(value) : '', '']}
          labelFormatter={(label) => `Ano ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="corrigido"
          name="Aporte corrigido pela inflação"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="fixo"
          name="Aporte fixo"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
