import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent } from '@/utils/formatters';

type Resultado = {
  patrimonioNecessario: number;
  patrimonioProjetado: number;
  patrimonioProjetadoReal?: number;
  status: 'ok' | 'insuficiente' | 'superavitario';
  retiradaInicial: number;
  retiradaFinal: number;
  trajetoriaAportes: {
    primeiroAno: number;
    ano5: number | null;
    ano10: number | null;
    ultimoAno: number | null;
  };
  herancaNominal?: number | null;
  herancaReal?: number | null;
  retiradaAjustada?: number | null;
  rendaMensalDesejada?: number;
  anosAteAposentadoria?: number;
  anosAposentadoria?: number;
  inflacao?: number;
};

export function ResultCards({ resultado }: { resultado: Resultado }) {
  const ratio =
    resultado.patrimonioNecessario > 0
      ? resultado.patrimonioProjetado / resultado.patrimonioNecessario
      : 1;

  const statusConfig = {
    superavitario: { label: 'Superavitário', variant: 'default' as const, className: 'bg-green-600' },
    ok: { label: 'Adequado', variant: 'secondary' as const, className: 'bg-yellow-500' },
    insuficiente: { label: 'Insuficiente', variant: 'destructive' as const, className: 'bg-red-600' },
  };
  const config = statusConfig[resultado.status];

  return (
    <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Patrimônio Necessário vs Projetado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Necessário: <span className="font-medium text-foreground">{formatCurrency(resultado.patrimonioNecessario)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Valor nominal total: <span className="font-medium text-foreground">{formatCurrency(resultado.patrimonioProjetado)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Em valor presente: <span className="font-medium text-foreground">{formatCurrency(resultado.patrimonioProjetadoReal ?? resultado.patrimonioProjetado)}</span>
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Badge className={config.className}>{config.label}</Badge>
              <span className="text-sm">{formatPercent(ratio)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Trajetória de Aportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">1º ano:</span>{' '}
              {formatCurrency(resultado.trajetoriaAportes.primeiroAno)}
            </div>
            <div>
              <span className="text-muted-foreground">Ano 5:</span>{' '}
              {resultado.trajetoriaAportes.ano5 != null
                ? formatCurrency(resultado.trajetoriaAportes.ano5)
                : '-'}
            </div>
            <div>
              <span className="text-muted-foreground">Ano 10:</span>{' '}
              {resultado.trajetoriaAportes.ano10 != null
                ? formatCurrency(resultado.trajetoriaAportes.ano10)
                : '-'}
            </div>
            <div>
              <span className="text-muted-foreground">Último:</span>{' '}
              {resultado.trajetoriaAportes.ultimoAno != null
                ? formatCurrency(resultado.trajetoriaAportes.ultimoAno)
                : '-'}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Aposentadoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Retirada inicial (nominal): <span className="font-medium text-foreground">{formatCurrency(resultado.retiradaInicial)}</span>
            </p>
            <p className="text-muted-foreground">
              Retirada final (nominal): <span className="font-medium text-foreground">{formatCurrency(resultado.retiradaFinal)}</span>
            </p>
            <p className="text-muted-foreground">
              Valor presente (constante):{' '}
              <span
                className={`font-semibold ${
                  resultado.status === 'superavitario'
                    ? 'text-green-600'
                    : resultado.status === 'insuficiente'
                      ? 'text-red-600'
                      : 'text-foreground'
                }`}
              >
                {formatCurrency(resultado.rendaMensalDesejada ?? 0)}
              </span>
              {' /mês'}
            </p>
            <p className="text-muted-foreground text-xs italic">Poder de compra mantido pela correção da inflação</p>
          </div>
        </CardContent>
      </Card>
    </div>

    {resultado.herancaNominal != null && resultado.herancaNominal > 0 && (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Herança ao final da expectativa de vida</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            Sobra como herança (nominal): <span className="font-medium text-foreground">{formatCurrency(resultado.herancaNominal)}</span>
          </p>
          <p className="text-muted-foreground">
            Sobra como herança em valor presente: <span className="font-medium text-foreground">{formatCurrency(resultado.herancaReal ?? 0)}</span>
          </p>
          <p className="text-muted-foreground">
            Retirada mensal possível para acabar exatamente no fim (valor superior ao esperado): <span className="font-medium text-foreground">{formatCurrency(resultado.retiradaAjustada ?? 0)}</span>/mês em poder de compra de hoje
          </p>
        </CardContent>
      </Card>
    )}
    </div>
  );
}
