import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComparativoAportesChart } from './Charts/ComparativoAportesChart';

type Props = {
  poupancaMensal: number;
  inflacao: number;
  anosAcumulacao: number;
};

export function PorQueAportesCorrigidos({ poupancaMensal, inflacao, anosAcumulacao }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Por que aportes corrigidos pela inflação?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Quando você mantém o aporte <strong>fixo em valor nominal</strong>, o poder de compra
            da sua poupança diminui com o tempo. Se a inflação for 5% ao ano, em 10 anos o mesmo
            valor em reais compra muito menos do que hoje.
          </p>
          <p className="text-muted-foreground">
            Ao corrigir os aportes pela inflação a cada ano (aporte_ano_N = aporte_inicial × (1 +
            inflação)^N), você mantém o <strong>esforço real de poupança constante</strong>. Ou seja,
            continua destinando a mesma parcela do seu poder de compra para investimentos, sem
            precisar aumentar o esforço em termos reais.
          </p>
          <p className="text-muted-foreground">
            O gráfico abaixo compara a evolução do aporte mensal nas duas estratégias ao longo dos
            anos de acumulação.
          </p>
        </CardContent>
      </Card>

      <ComparativoAportesChart
        aporteInicial={poupancaMensal}
        inflacao={inflacao}
        anos={anosAcumulacao}
      />
    </div>
  );
}
