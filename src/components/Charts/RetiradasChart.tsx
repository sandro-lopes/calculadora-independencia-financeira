import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type Props = {
  faseRetirada: { idade: number; retiradaMensal: number }[];
  inflacao: number;
  anosAteAposentadoria: number;
};

export function RetiradasChart({ faseRetirada, inflacao, anosAteAposentadoria }: Props) {
  const data = faseRetirada.map((r, i) => ({
    idade: r.idade,
    retiradaNominal: r.retiradaMensal,
    retiradaReal: r.retiradaMensal / Math.pow(1 + inflacao, anosAteAposentadoria + i),
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
        <XAxis dataKey="idade" />
        <YAxis tickFormatter={formatValue} />
        <Tooltip
          formatter={(value: number | undefined) => [value != null ? formatValue(value) : '', '']}
          labelFormatter={(label) => `Idade: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="retiradaNominal"
          name="Retirada Nominal"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="retiradaReal"
          name="Retirada (valor presente)"
          stroke="hsl(var(--accent-foreground))"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
