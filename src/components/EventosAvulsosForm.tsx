import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Trash2, Zap } from 'lucide-react';
import type { FormValues } from '@/types';

function mensagemExclusaoAportes(prev: number, current: number, qtd: number) {
  const fraseReducao = `A idade de aposentadoria foi reduzida de ${prev} para ${current} anos.`;
  if (qtd === 1) {
    return `${fraseReducao} Existe 1 aporte agendado para idade fora do período de acumulação. Deseja excluí-lo?`;
  }
  return `${fraseReducao} Existem ${qtd} aportes agendados para idades fora do período de acumulação. Deseja excluí-los?`;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const PERIODICIDADES = [
  { value: 1, label: 'Anual' },
  { value: 2, label: 'A cada 2 anos' },
  { value: 3, label: 'A cada 3 anos' },
  { value: 4, label: 'A cada 4 anos' },
  { value: 5, label: 'A cada 5 anos' },
  { value: 6, label: 'A cada 6 anos' },
  { value: 7, label: 'A cada 7 anos' },
  { value: 8, label: 'A cada 8 anos' },
  { value: 9, label: 'A cada 9 anos' },
  { value: 10, label: 'A cada 10 anos' },
];

function GeradorAportesRecorrentes({
  append,
  idadeAtual,
  idadeAposentadoria,
}: {
  append: (evento: { eventoId: string; tipo: 'aporte'; valor: number; valorEm: 'nominal' | 'presente'; idade: number; descricao: string }) => void;
  idadeAtual: number;
  idadeAposentadoria: number;
}) {
  const idadeInicialPadrao = idadeAtual + 1;
  const idadeFinalPadrao = idadeAposentadoria - 1;

  const [valor, setValor] = useState(0);
  const [valorEm, setValorEm] = useState<'nominal' | 'presente'>('presente');
  const [periodicidade, setPeriodicidade] = useState(1);
  const [descricao, setDescricao] = useState('');
  const [idadeInicial, setIdadeInicial] = useState<number | ''>(idadeInicialPadrao);
  const [idadeFinal, setIdadeFinal] = useState<number | ''>(idadeFinalPadrao);

  const ii = idadeInicial === '' ? idadeInicialPadrao : idadeInicial;
  const if_ = idadeFinal === '' ? idadeFinalPadrao : idadeFinal;

  const idades: number[] = [];
  for (let age = ii; age <= if_; age += periodicidade) {
    idades.push(age);
  }

  const handleGerar = () => {
    if (valor <= 0) return;
    for (const idade of idades) {
      append({
        eventoId: generateId(),
        tipo: 'aporte',
        valor,
        valorEm,
        idade,
        descricao: descricao.trim() || '',
      });
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Zap className="h-4 w-4 text-gray-600" />
        Gerar aportes recorrentes
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="sm:min-w-[140px]">
          <label className="mb-1 block text-sm font-medium">Valor</label>
          <CurrencyInput value={valor} onChange={setValor} />
        </div>
        <div className="sm:w-40">
          <label className="mb-1 block text-sm font-medium">Valor em</label>
          <Select value={valorEm} onValueChange={(v) => setValorEm(v as 'nominal' | 'presente')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nominal">Nominal</SelectItem>
              <SelectItem value="presente">Valor presente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:w-44">
          <label className="mb-1 block text-sm font-medium">Periodicidade</label>
          <Select value={String(periodicidade)} onValueChange={(v) => setPeriodicidade(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODICIDADES.map((p) => (
                <SelectItem key={p.value} value={String(p.value)}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:min-w-[120px] sm:flex-1">
          <label className="mb-1 block text-sm font-medium">Descrição (opcional)</label>
          <Input
            placeholder="Ex: 13º, PLR"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div className="sm:w-24">
          <label className="mb-1 block text-sm font-medium">Idade inicial</label>
          <Input
            type="number"
            min={idadeAtual}
            max={idadeAposentadoria}
            value={idadeInicial === '' ? '' : idadeInicial}
            placeholder={String(idadeInicialPadrao)}
            onChange={(e) => setIdadeInicial(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <div className="sm:w-24">
          <label className="mb-1 block text-sm font-medium">Idade final</label>
          <Input
            type="number"
            min={idadeAtual}
            max={idadeAposentadoria}
            value={idadeFinal === '' ? '' : idadeFinal}
            placeholder={String(idadeFinalPadrao)}
            onChange={(e) => setIdadeFinal(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <Button
          type="button"
          onClick={handleGerar}
          disabled={valor <= 0 || idades.length === 0}
          className="bg-slate-600 text-white hover:bg-slate-700"
        >
          Gerar aportes
        </Button>
      </div>
      {valor > 0 && idades.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Serão criados {idades.length} aporte{idades.length !== 1 ? 's' : ''}
          {idades.length <= 3
            ? ` (idades ${idades.join(', ')})`
            : ` (idades ${idades[0]}, ${idades[1]}, …, ${idades[idades.length - 1]})`}
        </p>
      )}
    </div>
  );
}

function EventoAporteLinha({
  form,
  index,
  idadeAtual,
  expectativaVida,
  remove,
  isNovo,
  onBlurCompletar,
}: {
  form: ReturnType<typeof useFormContext<FormValues>>;
  index: number;
  idadeAtual: number;
  expectativaVida: number;
  remove: (index: number) => void;
  isNovo?: boolean;
  onBlurCompletar?: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isNovo) return;
    const el = rowRef.current;
    if (!el) return;
    const scheduleCheck = () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = setTimeout(() => {
        blurTimeoutRef.current = null;
        const valor = form.getValues(`eventosAvulsos.${index}.valor`);
        if (valor === 0 || valor === undefined || valor === null) {
          remove(index);
          // Não chama onBlurCompletar quando remove - o reordenar traria o item de volta!
        } else {
          // Só reordena se o item foi preenchido (não removido)
          onBlurCompletar?.();
        }
      }, 200);
    };
    const cancelCheck = () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    };
    const handleFocusOut = (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as Node | null;
      if (relatedTarget && el.contains(relatedTarget)) return;
      scheduleCheck();
    };
    const handleFocusIn = () => {
      cancelCheck();
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (el.contains(e.target as Node)) return;
      scheduleCheck();
    };
    el.addEventListener('focusout', handleFocusOut);
    el.addEventListener('focusin', handleFocusIn);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      el.removeEventListener('focusout', handleFocusOut);
      el.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('mousedown', handleMouseDown);
      // Não cancela o timeout no unmount: ao fechar o Collapsible o conteúdo é
      // desmontado antes do timeout; deixar rodar para remover aporte vazio.
    };
  }, [isNovo, index, form, remove, onBlurCompletar]);

  return (
    <div
      ref={rowRef}
      className={`flex flex-col gap-3 rounded-md border-2 p-3 sm:flex-row sm:flex-wrap sm:items-end ${
        isNovo ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-border bg-background'
      }`}
    >
      <FormField
        control={form.control}
        name={`eventosAvulsos.${index}.valor`}
        render={({ field: f }) => (
          <FormItem className="sm:min-w-[140px]">
            <FormLabel>Valor</FormLabel>
            <FormControl>
              <CurrencyInput value={f.value} onChange={f.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`eventosAvulsos.${index}.valorEm`}
        render={({ field: f }) => (
          <FormItem className="sm:w-40">
            <FormLabel>Valor em</FormLabel>
            <Select value={f.value} onValueChange={f.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Nominal/Presente" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="nominal">Nominal</SelectItem>
                <SelectItem value="presente">Valor presente</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`eventosAvulsos.${index}.idade`}
        render={({ field: f }) => (
          <FormItem className="sm:w-24">
            <FormLabel>Idade</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={idadeAtual}
                max={expectativaVida}
                value={f.value}
                onChange={(e) => f.onChange(Number(e.target.value) || idadeAtual)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`eventosAvulsos.${index}.descricao`}
        render={({ field: f }) => (
          <FormItem className="sm:min-w-[120px] sm:flex-1">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 13º, PLR" {...f} value={f.value ?? ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
        Remover
      </Button>
    </div>
  );
}

function EventoRetiradaLinha({
  form,
  index,
  idadeAtual,
  expectativaVida,
  remove,
  isNovo,
  onBlurCompletar,
}: {
  form: ReturnType<typeof useFormContext<FormValues>>;
  index: number;
  idadeAtual: number;
  expectativaVida: number;
  remove: (index: number) => void;
  isNovo?: boolean;
  onBlurCompletar?: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isNovo) return;
    const el = rowRef.current;
    if (!el) return;
    const scheduleCheck = () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = setTimeout(() => {
        blurTimeoutRef.current = null;
        const valor = form.getValues(`eventosAvulsos.${index}.valor`);
        if (valor === 0 || valor === undefined || valor === null) {
          remove(index);
          // Não chama onBlurCompletar quando remove - o reordenar traria o item de volta!
        } else {
          // Só reordena se o item foi preenchido (não removido)
          onBlurCompletar?.();
        }
      }, 200);
    };
    const cancelCheck = () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    };
    const handleFocusOut = (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as Node | null;
      if (relatedTarget && el.contains(relatedTarget)) return;
      scheduleCheck();
    };
    const handleFocusIn = () => {
      cancelCheck();
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (el.contains(e.target as Node)) return;
      scheduleCheck();
    };
    el.addEventListener('focusout', handleFocusOut);
    el.addEventListener('focusin', handleFocusIn);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      el.removeEventListener('focusout', handleFocusOut);
      el.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('mousedown', handleMouseDown);
      // Não cancela o timeout no unmount: ao fechar o Collapsible o conteúdo é
      // desmontado antes do timeout; deixar rodar para remover retirada vazia.
    };
  }, [isNovo, index, form, remove, onBlurCompletar]);

  return (
    <div
      ref={rowRef}
      className={`flex flex-col gap-3 rounded-md border-2 p-3 sm:flex-row sm:flex-wrap sm:items-end ${
        isNovo ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-border bg-background'
      }`}
    >
      <FormField
        control={form.control}
        name={`eventosAvulsos.${index}.valor`}
        render={({ field: f }) => (
          <FormItem className="sm:min-w-[140px]">
            <FormLabel>Valor</FormLabel>
            <FormControl>
              <CurrencyInput value={f.value} onChange={f.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`eventosAvulsos.${index}.valorEm`}
        render={({ field: f }) => (
          <FormItem className="sm:w-40">
            <FormLabel>Valor em</FormLabel>
            <Select value={f.value} onValueChange={f.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Nominal/Presente" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="nominal">Nominal</SelectItem>
                <SelectItem value="presente">Valor presente</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`eventosAvulsos.${index}.idade`}
        render={({ field: f }) => (
          <FormItem className="sm:w-24">
            <FormLabel>Idade</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={idadeAtual}
                max={expectativaVida}
                value={f.value}
                onChange={(e) => f.onChange(Number(e.target.value) || idadeAtual)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`eventosAvulsos.${index}.descricao`}
        render={({ field: f }) => (
          <FormItem className="sm:min-w-[120px] sm:flex-1">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Viagem, reforma" {...f} value={f.value ?? ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
        Remover
      </Button>
    </div>
  );
}

export function EventosAvulsosForm() {
  const form = useFormContext<FormValues>();
  const { fields, append, insert, remove, replace } = useFieldArray({
    control: form.control,
    name: 'eventosAvulsos',
  });

  const idadeAtual = form.watch('idadeAtual');
  const idadeAposentadoria = form.watch('idadeAposentadoria');
  const expectativaVida = form.watch('expectativaVida');

  const prevIdadeAposentadoriaRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decreaseFromRef = useRef<number | null>(null);
  const DEBOUNCE_MS = 600;

  const [dialogLimparAportes, setDialogLimparAportes] = useState(false);
  const [dialogLimparRetiradas, setDialogLimparRetiradas] = useState(false);
  const [ultimoAporteAdicionadoId, setUltimoAporteAdicionadoId] = useState<string | null>(null);
  const [ultimoRetiradaAdicionadaId, setUltimoRetiradaAdicionadaId] = useState<string | null>(null);
  const [aportesVisiveis, setAportesVisiveis] = useState(10);
  const [retiradasVisiveis, setRetiradasVisiveis] = useState(10);

  const BATCH_SIZE = 10;

  const [dialogExclusao, setDialogExclusao] = useState<{
    prev: number;
    current: number;
    indices: number[];
  } | null>(null);

  const idadeAposentadoriaRef = useRef(idadeAposentadoria);
  idadeAposentadoriaRef.current = idadeAposentadoria;

  useEffect(() => {
    const prev = prevIdadeAposentadoriaRef.current;
    prevIdadeAposentadoriaRef.current = idadeAposentadoria;

    if (prev === null) return;

    if (idadeAposentadoria < prev) {
      decreaseFromRef.current = prev;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        decreaseFromRef.current = null;
        const current = form.getValues('idadeAposentadoria');
        if (current >= prev) return;

        const aportesParaRemover = form
          .getValues('eventosAvulsos')
          .map((f: { tipo: string; idade: number }, i: number) => ({ ...f, index: i }))
          .filter((f) => f.tipo === 'aporte' && f.idade >= current);

        if (aportesParaRemover.length > 0) {
          const indices = aportesParaRemover.map((a) => a.index).sort((a, b) => b - a);
          setDialogExclusao({ prev, current, indices });
        }
      }, DEBOUNCE_MS);
      return () => {
        const nextVal = idadeAposentadoriaRef.current;
        if (nextVal >= (decreaseFromRef.current ?? prev)) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
          decreaseFromRef.current = null;
        }
      };
    } else {
      decreaseFromRef.current = null;
    }
  }, [idadeAposentadoria, form]);

  const handleConfirmarExclusao = () => {
    if (dialogExclusao) {
      for (const idx of dialogExclusao.indices) {
        remove(idx);
      }
      setDialogExclusao(null);
    }
  };

  const handleCancelarExclusao = () => {
    setDialogExclusao(null);
  };

  const handleLimparAportes = () => {
    replace(fields.filter((f) => f.tipo !== 'aporte'));
    setDialogLimparAportes(false);
  };

  const handleLimparRetiradas = () => {
    replace(fields.filter((f) => f.tipo !== 'retirada'));
    setDialogLimparRetiradas(false);
  };

  const reordenarPorIdade = () => {
    // Pega os valores atuais do formulário (não os fields que podem estar desatualizados)
    const valoresAtuais = form.getValues('eventosAvulsos');
    const aportesOrdenados = valoresAtuais.filter((f) => f.tipo === 'aporte').sort((a, b) => a.idade - b.idade);
    const retiradasOrdenadas = valoresAtuais.filter((f) => f.tipo === 'retirada').sort((a, b) => a.idade - b.idade);
    replace([...aportesOrdenados, ...retiradasOrdenadas]);
  };

  const handleBlurAporteCompletar = () => {
    setUltimoAporteAdicionadoId(null);
    reordenarPorIdade();
  };

  const handleBlurRetiradaCompletar = () => {
    setUltimoRetiradaAdicionadaId(null);
    reordenarPorIdade();
  };

  const aportes = fields
    .map((f, i) => ({ ...f, index: i }))
    .filter((f) => f.tipo === 'aporte');
  const retiradas = fields
    .map((f, i) => ({ ...f, index: i }))
    .filter((f) => f.tipo === 'retirada');

  const handleAddAporte = () => {
    const newId = generateId();
    setUltimoAporteAdicionadoId(newId);
    insert(0, {
      eventoId: newId,
      tipo: 'aporte' as const,
      valor: 0,
      valorEm: 'presente' as const,
      idade: Math.min(idadeAtual + 1, expectativaVida - 1),
      descricao: '',
    });
  };

  const handleAddRetirada = () => {
    const newId = generateId();
    setUltimoRetiradaAdicionadaId(newId);
    insert(0, {
      eventoId: newId,
      tipo: 'retirada' as const,
      valor: 0,
      valorEm: 'presente' as const,
      idade: Math.min(idadeAposentadoria + 1, expectativaVida - 1),
      descricao: '',
    });
  };

  const novoAporte = ultimoAporteAdicionadoId ? aportes.find((a) => a.eventoId === ultimoAporteAdicionadoId) : null;
  const aportesSemNovo = novoAporte ? aportes.filter((a) => a.eventoId !== ultimoAporteAdicionadoId) : aportes;
  const aportesOrdenados =
    novoAporte ? [novoAporte, ...aportesSemNovo.sort((a, b) => a.idade - b.idade)] : [...aportes].sort((a, b) => a.idade - b.idade);
  
  const novaRetirada = ultimoRetiradaAdicionadaId ? retiradas.find((r) => r.eventoId === ultimoRetiradaAdicionadaId) : null;
  const retiradasSemNova = novaRetirada ? retiradas.filter((r) => r.eventoId !== ultimoRetiradaAdicionadaId) : retiradas;
  const retiradasOrdenadas =
    novaRetirada ? [novaRetirada, ...retiradasSemNova.sort((a, b) => a.idade - b.idade)] : [...retiradas].sort((a, b) => a.idade - b.idade);

  return (
    <div className="space-y-4">
      <Collapsible defaultOpen={aportes.length > 0}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Aportes avulsos</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4 space-y-4">
            <GeradorAportesRecorrentes
              append={(ev) => {
                setUltimoAporteAdicionadoId(null);
                append(ev);
              }}
              idadeAtual={idadeAtual}
              idadeAposentadoria={idadeAposentadoria}
            />
            <div className="space-y-4 rounded-md border bg-muted/30 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Lista de aportes ({aportes.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleAddAporte}>
                    + Adicionar aporte
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={aportes.length === 0}
                    className="gap-2"
                    onClick={() => setDialogLimparAportes(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Limpar aportes
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {aportesOrdenados.slice(0, aportesVisiveis).map((item) => (
                  <EventoAporteLinha
                    key={item.id}
                    form={form}
                    index={item.index}
                    idadeAtual={idadeAtual}
                    expectativaVida={expectativaVida}
                    remove={remove}
                    isNovo={item.eventoId === ultimoAporteAdicionadoId}
                    onBlurCompletar={item.eventoId === ultimoAporteAdicionadoId ? handleBlurAporteCompletar : undefined}
                  />
                ))}
              </div>
              {aportes.length > BATCH_SIZE && (
                <div className="flex gap-2">
                  {aportes.length > aportesVisiveis ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-2 text-muted-foreground"
                      onClick={() => setAportesVisiveis((v) => Math.min(v + BATCH_SIZE, aportes.length))}
                    >
                      <ChevronDown className="h-4 w-4" />
                      Carregar mais ({aportesVisiveis} de {aportes.length})
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-2 text-muted-foreground"
                      onClick={() => setAportesVisiveis(BATCH_SIZE)}
                    >
                      <ChevronUp className="h-4 w-4" />
                      Recolher (ver primeiros 10)
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen={retiradas.length > 0}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Retiradas avulsas</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4 space-y-4 rounded-md border bg-muted/30 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Lista de retiradas ({retiradas.length})
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleAddRetirada}>
                  + Adicionar retirada
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={retiradas.length === 0}
                  className="gap-2"
                  onClick={() => setDialogLimparRetiradas(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar retiradas
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {retiradasOrdenadas.slice(0, retiradasVisiveis).map((item) => (
                <EventoRetiradaLinha
                  key={item.id}
                  form={form}
                  index={item.index}
                  idadeAtual={idadeAtual}
                  expectativaVida={expectativaVida}
                  remove={remove}
                  isNovo={item.eventoId === ultimoRetiradaAdicionadaId}
                  onBlurCompletar={item.eventoId === ultimoRetiradaAdicionadaId ? handleBlurRetiradaCompletar : undefined}
                />
              ))}
            </div>
            {retiradas.length > BATCH_SIZE && (
              <div className="flex gap-2">
                {retiradas.length > retiradasVisiveis ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2 text-muted-foreground"
                    onClick={() => setRetiradasVisiveis((v) => Math.min(v + BATCH_SIZE, retiradas.length))}
                  >
                    <ChevronDown className="h-4 w-4" />
                    Carregar mais ({retiradasVisiveis} de {retiradas.length})
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2 text-muted-foreground"
                    onClick={() => setRetiradasVisiveis(BATCH_SIZE)}
                  >
                    <ChevronUp className="h-4 w-4" />
                    Recolher (ver primeiros 10)
                  </Button>
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <AlertDialog open={!!dialogExclusao} onOpenChange={(open) => !open && handleCancelarExclusao()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir aportes fora do período</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogExclusao &&
                mensagemExclusaoAportes(dialogExclusao.prev, dialogExclusao.current, dialogExclusao.indices.length)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarExclusao}>Sim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialogLimparAportes} onOpenChange={(open) => !open && setDialogLimparAportes(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar aportes</AlertDialogTitle>
            <AlertDialogDescription>
              {aportes.length === 1
                ? 'Deseja remover este aporte?'
                : `Deseja remover todos os ${aportes.length} aportes?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction onClick={handleLimparAportes}>Sim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialogLimparRetiradas} onOpenChange={(open) => !open && setDialogLimparRetiradas(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar retiradas</AlertDialogTitle>
            <AlertDialogDescription>
              {retiradas.length === 1
                ? 'Deseja remover esta retirada?'
                : `Deseja remover todas as ${retiradas.length} retiradas?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction onClick={handleLimparRetiradas}>Sim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
