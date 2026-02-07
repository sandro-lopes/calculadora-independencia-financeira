/**
 * Calculadora de Liberdade Financeira - Lógica de Cálculo
 *
 * REGRA FUNDAMENTAL: Aportes mensais crescem APENAS pela inflação a cada ano,
 * mantendo o esforço real de poupança constante.
 */

/**
 * Converte rentabilidade anual em mensal
 * @param {number} rentAnual - Rentabilidade anual em decimal (ex: 0.12 para 12%)
 * @returns {number} Rentabilidade mensal em decimal
 */
export function rentabilidadeMensal(rentAnual) {
  return Math.pow(1 + rentAnual, 1 / 12) - 1;
}

/**
 * Calcula o aporte mensal no ano N corrigido pela inflação
 * @param {number} aporteInicial - Aporte mensal inicial (valores de hoje)
 * @param {number} inflacao - Inflação anual em decimal (ex: 0.05 para 5%)
 * @param {number} ano - Número do ano (0 = primeiro ano)
 * @returns {number} Aporte mensal no ano N
 */
export function aporteAnoN(aporteInicial, inflacao, ano) {
  return aporteInicial * Math.pow(1 + inflacao, ano);
}

/**
 * Calcula o valor real (poder de compra de hoje) a partir do nominal
 * @param {number} valorNominal - Valor em moeda nominal
 * @param {number} inflacao - Inflação anual em decimal
 * @param {number} anosDesdeHoje - Anos desde o ano atual
 * @returns {number} Valor em poder de compra de hoje
 */
export function valorReal(valorNominal, inflacao, anosDesdeHoje) {
  if (anosDesdeHoje <= 0) return valorNominal;
  return valorNominal / Math.pow(1 + inflacao, anosDesdeHoje);
}

/**
 * Converte valor do evento para nominal (valor naquele ano futuro)
 * @param {Object} evento - { valor, valorEm, idade }
 * @param {number} inflacao - Inflação anual em decimal
 * @param {number} idadeAtual - Idade atual (ano 0)
 * @returns {number} Valor nominal
 */
function valorNominalEvento(evento, inflacao, idadeAtual) {
  if (evento.valorEm === 'nominal') return evento.valor;
  const anosDesdeHoje = evento.idade - idadeAtual;
  return evento.valor * Math.pow(1 + inflacao, anosDesdeHoje);
}

/**
 * Simula a fase de acumulação mês a mês
 * @param {Object} params
 * @param {number} params.patrimonioInicial - Patrimônio atual
 * @param {number} params.aporteMensalInicial - Poupança mensal atual
 * @param {number} params.inflacao - Inflação anual em decimal
 * @param {number} params.rentabilidade - Rentabilidade anual em decimal
 * @param {number} params.idadeAtual - Idade atual
 * @param {number} params.idadeAposentadoria - Idade de aposentadoria
 * @param {Array} params.eventosAvulsos - Eventos avulsos (aporte/retirada)
 * @returns {Array<{ano: number, idade: number, aporteMensal: number, patrimonioNominal: number, patrimonioReal: number, eventoAvulso?: number}>}
 */
export function simularAcumulacao({
  patrimonioInicial,
  aporteMensalInicial,
  inflacao,
  rentabilidade,
  idadeAtual,
  idadeAposentadoria,
  eventosAvulsos = [],
}) {
  const rentMensal = rentabilidadeMensal(rentabilidade);
  const anosAcumulacao = idadeAposentadoria - idadeAtual;
  const resultado = [];

  let patrimonio = patrimonioInicial;

  for (let ano = 0; ano < anosAcumulacao; ano++) {
    const idadeNesteAno = idadeAtual + ano;
    const eventosNesteAno = eventosAvulsos.filter(
      (e) => e.idade === idadeNesteAno && e.idade < idadeAposentadoria
    );
    let eventoAvulsoTotal = 0;
    for (const ev of eventosNesteAno) {
      const v = valorNominalEvento(ev, inflacao, idadeAtual);
      eventoAvulsoTotal += ev.tipo === 'aporte' ? v : -v;
    }
    patrimonio += eventoAvulsoTotal;

    const aporteMensal = aporteAnoN(aporteMensalInicial, inflacao, ano);

    for (let mes = 0; mes < 12; mes++) {
      patrimonio = patrimonio * (1 + rentMensal) + aporteMensal;
    }

    const patrimonioReal = valorReal(patrimonio, inflacao, ano + 1);
    resultado.push({
      ano: ano + 1,
      idade: idadeAtual + ano + 1,
      aporteMensal,
      patrimonioNominal: patrimonio,
      patrimonioReal,
      eventoAvulso: eventoAvulsoTotal !== 0 ? eventoAvulsoTotal : undefined,
    });
  }

  return resultado;
}

/**
 * Calcula a retirada mensal no ano da aposentadoria
 * @param {number} rendaDesejadaHoje - Renda mensal desejada em poder de compra de hoje
 * @param {number} inflacao - Inflação anual em decimal
 * @param {number} anosAteAposentadoria - Anos até aposentar
 * @param {number} anoAposentadoria - Ano dentro da fase de aposentadoria (0 = primeiro ano)
 * @returns {number} Retirada mensal nominal
 */
export function retiradaAnoN(rendaDesejadaHoje, inflacao, anosAteAposentadoria, anoAposentadoria) {
  const anosTotais = anosAteAposentadoria + anoAposentadoria;
  return rendaDesejadaHoje * Math.pow(1 + inflacao, anosTotais);
}

/**
 * Simula a fase de retirada mês a mês
 * @param {Object} params
 * @param {number} params.patrimonioInicial - Patrimônio no início da aposentadoria
 * @param {number} params.rendaMensalDesejada - Renda mensal desejada (poder de compra de hoje)
 * @param {number} params.inflacao - Inflação anual em decimal
 * @param {number} params.rentabilidade - Rentabilidade anual em decimal
 * @param {number} params.idadeAposentadoria - Idade ao aposentar
 * @param {number} params.idadeAtual - Idade atual (para conversão valor presente)
 * @param {number} params.expectativaVida - Expectativa de vida
 * @param {number} params.anosAteAposentadoria - Anos até aposentadoria
 * @param {Array} params.eventosAvulsos - Eventos avulsos (aporte/retirada)
 * @returns {Object} { faseRetirada, zerouAntes, anoQueZerou, patrimonioFinal }
 */
export function simularRetirada({
  patrimonioInicial,
  rendaMensalDesejada,
  inflacao,
  rentabilidade,
  idadeAposentadoria,
  idadeAtual,
  expectativaVida,
  anosAteAposentadoria,
  eventosAvulsos = [],
}) {
  const rentMensal = rentabilidadeMensal(rentabilidade);
  const anosAposentadoriaTotal = expectativaVida - idadeAposentadoria;
  const faseRetirada = [];
  let patrimonio = patrimonioInicial;
  let zerouAntes = false;
  let anoQueZerou = null;

  for (let ano = 0; ano < anosAposentadoriaTotal; ano++) {
    const idadeNesteAno = idadeAposentadoria + ano;
    const eventosNesteAno = eventosAvulsos.filter((e) => e.idade === idadeNesteAno && e.idade >= idadeAposentadoria);
    let eventoAvulsoTotal = 0;
    for (const ev of eventosNesteAno) {
      const v = valorNominalEvento(ev, inflacao, idadeAtual);
      eventoAvulsoTotal += ev.tipo === 'aporte' ? v : -v;
    }
    patrimonio += eventoAvulsoTotal;
    if (patrimonio < 0) patrimonio = 0;

    const retiradaMensal = retiradaAnoN(
      rendaMensalDesejada,
      inflacao,
      anosAteAposentadoria,
      ano
    );

    for (let mes = 0; mes < 12; mes++) {
      patrimonio = patrimonio * (1 + rentMensal) - retiradaMensal;
      if (patrimonio <= 0) {
        zerouAntes = true;
        anoQueZerou = idadeAposentadoria + ano;
        break;
      }
    }

    const patrimonioReal = valorReal(patrimonio, inflacao, anosAteAposentadoria + ano + 1);
    faseRetirada.push({
      ano: ano + 1,
      idade: idadeAposentadoria + ano,
      retiradaMensal,
      patrimonioNominal: Math.max(0, patrimonio),
      patrimonioReal,
      eventoAvulso: eventoAvulsoTotal !== 0 ? eventoAvulsoTotal : undefined,
    });

    if (zerouAntes) break;
  }

  return { faseRetirada, zerouAntes, anoQueZerou, patrimonioFinal: zerouAntes ? 0 : patrimonio };
}

/**
 * Calcula a retirada mensal inicial (em valor de hoje) que esgotaria o patrimônio exatamente no fim da expectativa de vida
 * @param {Object} params
 * @returns {number} Retirada mensal em poder de compra de hoje, ou null se não for possível
 */
export function calcularRetiradaQueEsgotaExatamente({
  patrimonioInicial,
  inflacao,
  rentabilidade,
  anosAteAposentadoria,
  anosAposentadoria,
}) {
  const rentMensal = rentabilidadeMensal(rentabilidade);
  let lo = 0;
  let hi = patrimonioInicial / (anosAposentadoria * 12) * 2;

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    let p = patrimonioInicial;
    for (let ano = 0; ano < anosAposentadoria; ano++) {
      const retirada = retiradaAnoN(mid, inflacao, anosAteAposentadoria, ano);
      for (let mes = 0; mes < 12; mes++) {
        p = p * (1 + rentMensal) - retirada;
        if (p < 0) break;
      }
      if (p < 0) break;
    }
    if (Math.abs(p) < 1) return mid;
    if (p > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Calcula o patrimônio necessário no início da aposentadoria (VP das retiradas futuras)
 * @param {number} rendaMensal - Renda mensal desejada (poder de compra de hoje)
 * @param {number} inflacao - Inflação anual em decimal
 * @param {number} rentabilidade - Rentabilidade anual em decimal
 * @param {number} anosAposentadoria - Anos na fase de retirada
 * @param {number} anosAteAposentadoria - Anos até aposentadoria
 * @returns {number} Patrimônio necessário
 */
export function calcularPatrimonioNecessario(
  rendaMensal,
  inflacao,
  rentabilidade,
  anosAposentadoria,
  anosAteAposentadoria
) {
  const rentMensal = rentabilidadeMensal(rentabilidade);
  let vp = 0;

  for (let ano = 0; ano < anosAposentadoria; ano++) {
    const retiradaMensal = retiradaAnoN(rendaMensal, inflacao, anosAteAposentadoria, ano);
    const fatorMensal = (1 + rentMensal);
    const vpAnual =
      retiradaMensal *
      ((Math.pow(fatorMensal, 12) - 1) / (rentMensal * Math.pow(fatorMensal, 12)));
    vp += vpAnual / Math.pow(1 + rentabilidade, ano);
  }

  return vp;
}

/**
 * Orquestra a simulação completa e retorna todos os dados para a UI
 * @param {Object} inputs
 * @returns {Object} Resultado completo
 */
export function calcularResultadoCompleto(inputs) {
  const {
    idadeAtual,
    patrimonioAtual,
    poupancaMensal,
    idadeAposentadoria,
    rendaMensalDesejada,
    expectativaVida,
    inflacao,
    rentabilidade,
  } = inputs;

  const anosAteAposentadoria = idadeAposentadoria - idadeAtual;
  const anosAposentadoria = expectativaVida - idadeAposentadoria;

  const eventosAvulsos = inputs.eventosAvulsos || [];

  const faseAcumulacao = simularAcumulacao({
    patrimonioInicial: patrimonioAtual,
    aporteMensalInicial: poupancaMensal,
    inflacao,
    rentabilidade,
    idadeAtual,
    idadeAposentadoria,
    eventosAvulsos,
  });

  const patrimonioProjetado =
    faseAcumulacao.length > 0
      ? faseAcumulacao[faseAcumulacao.length - 1].patrimonioNominal
      : patrimonioAtual;

  const patrimonioProjetadoReal =
    faseAcumulacao.length > 0
      ? faseAcumulacao[faseAcumulacao.length - 1].patrimonioReal
      : patrimonioAtual;

  const patrimonioNecessario = calcularPatrimonioNecessario(
    rendaMensalDesejada,
    inflacao,
    rentabilidade,
    anosAposentadoria,
    anosAteAposentadoria
  );

  const { faseRetirada, zerouAntes, anoQueZerou, patrimonioFinal } = simularRetirada({
    patrimonioInicial: patrimonioProjetado,
    rendaMensalDesejada,
    inflacao,
    rentabilidade,
    idadeAposentadoria,
    idadeAtual,
    expectativaVida,
    anosAteAposentadoria,
    eventosAvulsos,
  });

  const ratio = patrimonioNecessario > 0 ? patrimonioProjetado / patrimonioNecessario : 1;
  let status = 'ok';
  if (ratio >= 1.05) status = 'superavitario';
  else if (ratio < 0.95 || zerouAntes) status = 'insuficiente';

  const retiradaInicial =
    faseRetirada.length > 0 ? faseRetirada[0].retiradaMensal : rendaMensalDesejada;
  const retiradaFinal =
    faseRetirada.length > 0
      ? faseRetirada[faseRetirada.length - 1].retiradaMensal
      : rendaMensalDesejada;

  const trajetoriaAportes = {
    primeiroAno: faseAcumulacao.length > 0 ? faseAcumulacao[0].aporteMensal : poupancaMensal,
    ano5: faseAcumulacao.length >= 5 ? faseAcumulacao[4].aporteMensal : null,
    ano10: faseAcumulacao.length >= 10 ? faseAcumulacao[9].aporteMensal : null,
    ultimoAno:
      faseAcumulacao.length > 0 ? faseAcumulacao[faseAcumulacao.length - 1].aporteMensal : null,
  };

  let herancaNominal = null;
  let herancaReal = null;
  let retiradaAjustada = null;

  if (!zerouAntes && patrimonioFinal > 0) {
    herancaNominal = patrimonioFinal;
    herancaReal = valorReal(patrimonioFinal, inflacao, anosAteAposentadoria + anosAposentadoria);
    retiradaAjustada = calcularRetiradaQueEsgotaExatamente({
      patrimonioInicial: patrimonioProjetado,
      inflacao,
      rentabilidade,
      anosAteAposentadoria,
      anosAposentadoria,
    });
  }

  return {
    faseAcumulacao,
    faseRetirada,
    patrimonioNecessario,
    patrimonioProjetado,
    patrimonioProjetadoReal,
    status,
    retiradaInicial,
    retiradaFinal,
    zerouAntes,
    anoQueZerou,
    trajetoriaAportes,
    anosAteAposentadoria,
    anosAposentadoria,
    herancaNominal,
    herancaReal,
    retiradaAjustada,
    rendaMensalDesejada,
  };
}

/**
 * Calcula sugestões quando o objetivo não é atingível
 * @param {Object} resultado - Resultado de calcularResultadoCompleto
 * @param {Object} inputs - Inputs originais
 * @returns {Object} { aporteSugerido, anosExtras }
 */
export function calcularSugestoes(resultado, inputs) {
  const { patrimonioNecessario, patrimonioProjetado, anosAteAposentadoria } = resultado;
  const { poupancaMensal, inflacao, rentabilidade, idadeAtual } = inputs;

  if (patrimonioProjetado >= patrimonioNecessario) {
    return { aporteSugerido: null, anosExtras: null };
  }

  const deficit = patrimonioNecessario - patrimonioProjetado;
  const rentMensal = rentabilidadeMensal(rentabilidade);

  let aporteExtra = 0;
  let patrimonioTeste = resultado.faseAcumulacao[0]?.patrimonioNominal ?? inputs.patrimonioAtual;

  for (let ano = 0; ano < anosAteAposentadoria; ano++) {
    const aporteAtual = aporteAnoN(poupancaMensal, inflacao, ano);
    for (let mes = 0; mes < 12; mes++) {
      patrimonioTeste = patrimonioTeste * (1 + rentMensal) + aporteAtual;
    }
  }

  const patrimonioComAporteExtra = (extraMensal) => {
    let p = inputs.patrimonioAtual;
    for (let ano = 0; ano < anosAteAposentadoria; ano++) {
      const base = aporteAnoN(poupancaMensal, inflacao, ano);
      const aporte = base + extraMensal * Math.pow(1 + inflacao, ano);
      for (let mes = 0; mes < 12; mes++) {
        p = p * (1 + rentMensal) + aporte;
      }
    }
    return p;
  };

  let lo = 0;
  let hi = Math.max(deficit / 12, poupancaMensal * 3);
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const p = patrimonioComAporteExtra(mid);
    if (p >= patrimonioNecessario) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  aporteExtra = Math.round(((lo + hi) / 2) * 100) / 100;

  let anosExtras = null;
  const anosOriginais = inputs.idadeAposentadoria - idadeAtual;
  for (let extra = 1; extra <= 20; extra++) {
    const novoResultado = calcularResultadoCompleto({
      ...inputs,
      idadeAposentadoria: inputs.idadeAposentadoria + extra,
      expectativaVida: inputs.expectativaVida + extra,
    });
    if (novoResultado.patrimonioProjetado >= patrimonioNecessario && !novoResultado.zerouAntes) {
      anosExtras = extra;
      break;
    }
  }

  return {
    aporteSugerido: aporteExtra > 0.01 ? Math.round(aporteExtra * 100) / 100 : null,
    anosExtras,
  };
}
