import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type Props = {
  faseAcumulacao: { ano: number; idade: number; aporteMensal: number }[];
  inflacao: number;
};

export function AportesChart({ faseAcumulacao, inflacao }: Props) {
  const [nominal, setNominal] = useState(true);

  const data = faseAcumulacao.map((r) => ({
    ano: r.ano,
    idade: r.idade,
    aporteNominal: r.aporteMensal,
    aporteReal: r.aporteMensal / Math.pow(1 + inflacao, r.ano),
  }));

  const formatValue = (v: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(v);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 justify-end">
        <Label htmlFor="toggle-nominal">Nominal</Label>
        <Switch
          id="toggle-nominal"
          checked={nominal}
          onCheckedChange={setNominal}
        />
        <Label htmlFor="toggle-nominal">Valor presente</Label>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="idade" />
          <YAxis tickFormatter={formatValue} />
          <Tooltip
            formatter={(value: number | undefined) => [value != null ? formatValue(value) : '', '']}
            labelFormatter={(label) => `Idade: ${label}`}
          />
          <Legend />
          <Bar
            dataKey={nominal ? 'aporteNominal' : 'aporteReal'}
            name={nominal ? 'Aporte Mensal Nominal' : 'Aporte Mensal (valor presente)'}
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
