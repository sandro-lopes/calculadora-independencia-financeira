import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FormInputs } from '@/components/FormInputs';
import { ResultCards } from '@/components/ResultCards';
import { PatrimonioChart } from '@/components/Charts/PatrimonioChart';
import { AportesChart } from '@/components/Charts/AportesChart';
import { RetiradasChart } from '@/components/Charts/RetiradasChart';
import { WhatIfSliders } from '@/components/WhatIfSliders';
import { TabelaDetalhada } from '@/components/TabelaDetalhada';
import { PorQueAportesCorrigidos } from '@/components/PorQueAportesCorrigidos';
import { ExplicacaoNominalReal } from '@/components/ExplicacaoNominalReal';
import { useCalculations } from '@/hooks/useCalculations';
import { useLocalStoragePersistence } from '@/hooks/useLocalStorage';
import { formSchema, defaultValues } from '@/types';
import { formatCurrency } from '@/utils/formatters';

function App() {
  const [activeTab, setActiveTab] = useState('entrada');
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const values = form.watch();
  const resultado = useCalculations(values);
  const { clearStorage } = useLocalStoragePersistence(form, defaultValues);

  const handleReset = () => {
    clearStorage();
  };

  const handleCalcular = form.handleSubmit(() => {
    setActiveTab('resultados');
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl space-y-6 p-4 py-8 md:p-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold md:text-3xl">
            Calculadora de Liberdade Financeira
          </h1>
          <p className="text-muted-foreground">
            Simule sua trajetória de acumulação e aposentadoria com aportes corrigidos pela inflação.
          </p>
        </header>

        <Form {...form}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="entrada">Entrada</TabsTrigger>
              <TabsTrigger value="resultados">Resultados</TabsTrigger>
              <TabsTrigger value="e-se">Análise E Se</TabsTrigger>
              <TabsTrigger value="tabela">Tabela</TabsTrigger>
              <TabsTrigger value="explicacao">Por que Corrigir?</TabsTrigger>
            </TabsList>

            <TabsContent value="entrada" className="space-y-6">
              <FormInputs />
              <div className="flex gap-2">
                <Button type="submit" onClick={handleCalcular}>
                  Calcular
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Resetar
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="resultados" className="space-y-6">
              {resultado && (
                <>
                  <ResultCards resultado={resultado} />

                  {values.rentabilidade <= values.inflacao && (
                    <Alert variant="destructive">
                      <AlertTitle>Rentabilidade menor que inflação</AlertTitle>
                      <AlertDescription>
                        A rentabilidade deve ser maior que a inflação para evitar perda real do
                        patrimônio.
                      </AlertDescription>
                    </Alert>
                  )}

                  {values.rentabilidade > 0.15 && (
                    <Alert>
                      <AlertTitle>Rentabilidade otimista</AlertTitle>
                      <AlertDescription>
                        Considerar cenário conservador com rentabilidade em torno de 10-12% ao ano.
                      </AlertDescription>
                    </Alert>
                  )}

                  {values.inflacao > 0.1 && (
                    <Alert>
                      <AlertTitle>Inflação alta</AlertTitle>
                      <AlertDescription>
                        Revise suas expectativas de inflação.
                      </AlertDescription>
                    </Alert>
                  )}

                  {resultado.status === 'insuficiente' && resultado.sugestoes && (
                    <Alert variant="destructive">
                      <AlertTitle>Objetivo não atingível</AlertTitle>
                      <AlertDescription>
                        <p className="mb-2">Patrimônio projetado insuficiente.</p>
                        {resultado.sugestoes.aporteSugerido != null && (
                          <p>
                            Sugestão: aumentar aporte em{' '}
                            <strong>{formatCurrency(resultado.sugestoes.aporteSugerido)}</strong> por
                            mês.
                          </p>
                        )}
                        {resultado.sugestoes.anosExtras != null && (
                          <p>
                            Ou trabalhar <strong>{resultado.sugestoes.anosExtras} anos</strong> a
                            mais.
                          </p>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  {resultado.zerouAntes && resultado.anoQueZerou != null && (
                    <Alert variant="destructive">
                      <AlertTitle>Patrimônio esgota antes da expectativa</AlertTitle>
                      <AlertDescription>
                        O patrimônio se esgota em torno dos {resultado.anoQueZerou} anos.
                      </AlertDescription>
                    </Alert>
                  )}

                  <ExplicacaoNominalReal />

                  <div className="space-y-8">
                    <div>
                      <h3 className="mb-2 font-semibold">Evolução do Patrimônio</h3>
                      <PatrimonioChart
                        faseAcumulacao={resultado.faseAcumulacao}
                        faseRetirada={resultado.faseRetirada}
                        idadeAposentadoria={values.idadeAposentadoria}
                      />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold">Aportes Mensais ao Longo do Tempo</h3>
                      <AportesChart
                        faseAcumulacao={resultado.faseAcumulacao}
                        inflacao={values.inflacao}
                      />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold">Retiradas na Aposentadoria</h3>
                      <RetiradasChart
                        faseRetirada={resultado.faseRetirada}
                        inflacao={values.inflacao}
                        anosAteAposentadoria={resultado.anosAteAposentadoria}
                      />
                    </div>
                  </div>
                </>
              )}
              {!resultado && (
                <p className="text-muted-foreground">
                  Preencha os dados na aba Entrada e clique em Calcular para ver os resultados.
                </p>
              )}
            </TabsContent>

            <TabsContent value="e-se">
              <WhatIfSliders />
            </TabsContent>

            <TabsContent value="tabela" className="space-y-4">
              {resultado ? (
                <TabelaDetalhada
                  faseAcumulacao={resultado.faseAcumulacao}
                  faseRetirada={resultado.faseRetirada}
                  poupancaMensal={values.poupancaMensal}
                  rendaMensalDesejada={values.rendaMensalDesejada}
                  eventosAvulsos={values.eventosAvulsos}
                />
              ) : (
                <p className="text-muted-foreground">
                  Calcule primeiro para ver a tabela detalhada.
                </p>
              )}
            </TabsContent>

            <TabsContent value="explicacao">
              <PorQueAportesCorrigidos
                poupancaMensal={values.poupancaMensal}
                inflacao={values.inflacao}
                anosAcumulacao={values.idadeAposentadoria - values.idadeAtual}
              />
            </TabsContent>
          </Tabs>
        </Form>
      </div>
    </div>
  );
}

export default App;
