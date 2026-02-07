import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrency } from '@/utils/formatters';

type FaseAcumulacao = {
  ano: number;
  idade: number;
  aporteMensal: number;
  patrimonioNominal: number;
  patrimonioReal: number;
  eventoAvulso?: number;
};

type FaseRetirada = {
  ano: number;
  idade: number;
  retiradaMensal: number;
  patrimonioNominal: number;
  patrimonioReal: number;
  eventoAvulso?: number;
};

type EventoAvulso = {
  eventoId: string;
  tipo: 'aporte' | 'retirada';
  valor: number;
  valorEm: 'nominal' | 'presente';
  idade: number;
  descricao?: string;
};

type Props = {
  faseAcumulacao: FaseAcumulacao[];
  faseRetirada: FaseRetirada[];
  poupancaMensal: number;
  rendaMensalDesejada: number;
  eventosAvulsos: EventoAvulso[];
};

export function TabelaDetalhada({ faseAcumulacao, faseRetirada, poupancaMensal, rendaMensalDesejada, eventosAvulsos }: Props) {
  const [open, setOpen] = useState(false);

  const exportCSV = () => {
    const headers = ['Fase', 'Ano', 'Idade', 'Aporte/Retirada', 'Eventos avulsos', 'Patrimônio Nominal', 'Patrimônio (valor presente)'];
    const rows: string[][] = [];

    faseAcumulacao.forEach((r) => {
      rows.push([
        'Acumulação',
        String(r.ano),
        String(r.idade),
        formatCurrency(r.aporteMensal),
        r.eventoAvulso != null ? formatCurrency(r.eventoAvulso) : '-',
        formatCurrency(r.patrimonioNominal),
        formatCurrency(r.patrimonioReal),
      ]);
    });

    faseRetirada.forEach((r) => {
      rows.push([
        'Retirada',
        String(r.ano),
        String(r.idade),
        formatCurrency(r.retiradaMensal),
        r.eventoAvulso != null ? formatCurrency(r.eventoAvulso) : '-',
        formatCurrency(r.patrimonioNominal),
        formatCurrency(r.patrimonioReal),
      ]);
    });

    const csv = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calculadora-independencia-financeira.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="outline">Expandir tabela detalhada</Button>
        </CollapsibleTrigger>
        <Button variant="outline" onClick={exportCSV}>
          Exportar CSV
        </Button>
      </div>
      <CollapsibleContent>
        <TooltipProvider>
          <div className="mt-4 overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left">Fase</th>
                  <th className="px-4 py-2 text-left">Ano</th>
                  <th className="px-4 py-2 text-left">Idade</th>
                  <th className="px-4 py-2 text-right">Aporte / Retirada</th>
                  <th className="px-4 py-2 text-right">Eventos avulsos</th>
                  <th className="px-4 py-2 text-right">Patrimônio Nominal</th>
                  <th className="px-4 py-2 text-right">Patrimônio (valor presente)</th>
                </tr>
              </thead>
              <tbody>
                {faseAcumulacao.map((r) => (
                  <tr key={`acc-${r.ano}`} className="border-b">
                    <td className="px-4 py-2">Acumulação</td>
                    <td className="px-4 py-2">{r.ano}</td>
                    <td className="px-4 py-2">{r.idade}</td>
                    <td className="px-4 py-2 text-right">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            {formatCurrency(r.aporteMensal)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Valor presente: {formatCurrency(poupancaMensal)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="px-4 py-2 text-right">
                      {r.eventoAvulso != null ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">
                              {formatCurrency(r.eventoAvulso)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {(() => {
                              const eventosNaIdade = eventosAvulsos.filter(e => e.idade === r.idade);
                              if (eventosNaIdade.length === 0) return <p className="text-xs">Evento avulso</p>;
                              return (
                                <div className="text-xs space-y-1">
                                  {eventosNaIdade.map((e, i) => (
                                    <p key={i}>
                                      <strong>{e.tipo === 'aporte' ? 'Aporte' : 'Retirada'}:</strong> {formatCurrency(e.valor)}
                                      <span className="text-muted-foreground"> ({e.valorEm === 'nominal' ? 'nominal' : 'presente'})</span>
                                      {e.descricao && <span className="block text-muted-foreground italic">{e.descricao}</span>}
                                    </p>
                                  ))}
                                </div>
                              );
                            })()}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">{formatCurrency(r.patrimonioNominal)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(r.patrimonioReal)}</td>
                  </tr>
                ))}
                {faseRetirada.map((r) => (
                  <tr key={`ret-${r.ano}`} className="border-b">
                    <td className="px-4 py-2">Retirada</td>
                    <td className="px-4 py-2">{r.ano}</td>
                    <td className="px-4 py-2">{r.idade}</td>
                    <td className="px-4 py-2 text-right">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            {formatCurrency(r.retiradaMensal)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Valor presente: {formatCurrency(rendaMensalDesejada)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="px-4 py-2 text-right">
                      {r.eventoAvulso != null ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">
                              {formatCurrency(r.eventoAvulso)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {(() => {
                              const eventosNaIdade = eventosAvulsos.filter(e => e.idade === r.idade);
                              if (eventosNaIdade.length === 0) return <p className="text-xs">Evento avulso</p>;
                              return (
                                <div className="text-xs space-y-1">
                                  {eventosNaIdade.map((e, i) => (
                                    <p key={i}>
                                      <strong>{e.tipo === 'aporte' ? 'Aporte' : 'Retirada'}:</strong> {formatCurrency(e.valor)}
                                      <span className="text-muted-foreground"> ({e.valorEm === 'nominal' ? 'nominal' : 'presente'})</span>
                                      {e.descricao && <span className="block text-muted-foreground italic">{e.descricao}</span>}
                                    </p>
                                  ))}
                                </div>
                              );
                            })()}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">{formatCurrency(r.patrimonioNominal)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(r.patrimonioReal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TooltipProvider>
      </CollapsibleContent>
    </Collapsible>
  );
}
