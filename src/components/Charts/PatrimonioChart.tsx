import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

type DataPoint = {
  idade: number;
  patrimonioNominal: number;
  patrimonioReal: number;
  fase: 'acumulacao' | 'retirada';
};

type Props = {
  faseAcumulacao: { idade: number; patrimonioNominal: number; patrimonioReal: number }[];
  faseRetirada: { idade: number; patrimonioNominal: number; patrimonioReal: number }[];
  idadeAposentadoria: number;
};

export function PatrimonioChart({ faseAcumulacao, faseRetirada, idadeAposentadoria }: Props) {
  const data: DataPoint[] = [
    ...faseAcumulacao.map((r) => ({
      idade: r.idade,
      patrimonioNominal: r.patrimonioNominal,
      patrimonioReal: r.patrimonioReal,
      fase: 'acumulacao' as const,
    })),
    ...faseRetirada.map((r) => ({
      idade: r.idade,
      patrimonioNominal: r.patrimonioNominal,
      patrimonioReal: r.patrimonioReal,
      fase: 'retirada' as const,
    })),
  ];

  const formatValue = (v: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'decimal',
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(v);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="idade" type="number" domain={['dataMin', 'dataMax']} />
        <YAxis tickFormatter={formatValue} />
        <Tooltip
          formatter={(value: number | undefined) => [value != null ? formatValue(value) : '', '']}
          labelFormatter={(label) => `Idade: ${label}`}
        />
        <Legend />
        <ReferenceLine x={idadeAposentadoria} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="patrimonioNominal"
          name="Patrimônio Nominal"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="patrimonioReal"
          name="Patrimônio (valor presente)"
          stroke="hsl(var(--accent-foreground))"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
