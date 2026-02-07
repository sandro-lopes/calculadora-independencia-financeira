# Calculadora de Liberdade Financeira

Web app para simular trajetória de acumulação e aposentadoria com aportes corrigidos pela inflação.

## Tech Stack

- React 18 + Vite
- Tailwind CSS + shadcn/ui
- Recharts
- React Hook Form + Zod
- localStorage para persistência

## Regra Fundamental

Aportes mensais crescem **apenas pela inflação** a cada ano:
`aporte_ano_N = aporte_inicial × (1 + inflação)^N`

Isso mantém o esforço real de poupança constante ao longo do tempo.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

O projeto está configurado para deploy na Vercel. Use `vercel` ou conecte o repositório Git.
