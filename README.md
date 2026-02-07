# Calculadora de Liberdade Financeira

Web app para simular trajetória de acumulação e aposentadoria com aportes corrigidos pela inflação.

**Demo:** [https://seu-usuario.github.io/calculadora-independencia-financeira/](https://seu-usuario.github.io/calculadora-independencia-financeira/)

## Funcionalidades

- **Simulação completa** – Fase de acumulação e fase de retirada
- **Aportes corrigidos pela inflação** – Esforço real de poupança constante ao longo do tempo
- **Aportes e retiradas avulsos** – Eventos pontuais em idades específicas (13º, PLR, viagens, etc.)
- **Gerador de aportes recorrentes** – Criação em lote com periodicidade configurável
- **Gráficos interativos** – Patrimônio, aportes e retiradas ao longo do tempo
- **Cenários "What if"** – Sliders para explorar variações de parâmetros
- **Tabela detalhada** – Export CSV com todos os anos simulados
- **Persistência** – Dados salvos automaticamente no navegador (localStorage)

## Regra Fundamental

Aportes mensais crescem **apenas pela inflação** a cada ano:
`aporte_ano_N = aporte_inicial × (1 + inflação)^N`

Isso mantém o esforço real de poupança constante ao longo do tempo.

## Tech Stack

- React 19 + Vite 7
- Tailwind CSS + shadcn/ui
- Recharts
- React Hook Form + Zod
- localStorage para persistência

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse http://localhost:5173.

## Build

```bash
npm run build
```

## Deploy

O projeto é publicado automaticamente nele no GitHub Pages a cada push na branch main.

### Contribuindo
Contribuições são bem-vindas. Para alterar o código:
1. Faça um fork do repositório
1. Crie uma branch para sua feature (`git checkout -b feature/minha-melhoria`)
1. Commit suas alterações (`git commit -m 'Adiciona minha melhoria'`)
1. Faça push para sua branch (`git push origin feature/minha-melhoria`)
1. Abra um Pull Request para a branch main

Pull Requests serão revisados pelo mantenedor. Não é possível fazer push direto em main.
