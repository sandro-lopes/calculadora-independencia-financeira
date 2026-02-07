import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ExplicacaoNominalReal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Entenda: Valor Nominal e Valor Presente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">Valor Nominal</strong> é o valor em reais tal como
          circula na economia naquele momento futuro. Por exemplo: R$ 10.000 em 2040. Esse número não
          considera a inflação acumulada.
        </p>
        <p>
          <strong className="text-foreground">Valor Presente</strong> é quanto esse valor
          representaria hoje, descontando a inflação. Em outras palavras: o poder de compra equivalente
          ao momento da simulação. Se a inflação for 5% ao ano, R$ 10.000 em 2040 equivalem a bem menos
          em valor presente do que R$ 10.000 hoje.
        </p>
        <p>
          A fórmula é: <em>valor presente = valor nominal ÷ (1 + inflação)^anos</em>. Assim, ao corrigir
          aportes e retiradas pela inflação, mantemos o esforço e o padrão de vida constantes em
          valor presente.
        </p>
      </CardContent>
    </Card>
  );
}
