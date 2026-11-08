# Regras de Desenvolvimento e Integração com DSH — eleitor_v2 (app)

Este arquivo define as diretrizes obrigatórias para o **Antigravity (engenheiro dev)** no desenvolvimento da aplicação frontend e na cooperação com o **DSH (Data Steward / PO)**.

---

## 1. Escopos e Papéis

- **Antigravity (Dev)**: Responsável exclusivo pelo código da aplicação (`eleitor_v2/app/**`), incluindo componentes Angular 22 standalone, signals, arquitetura zoneless, tipagem TypeScript estrita, estilos SCSS/Tailwind neo-brutalistas, acessibilidade (WCAG 2.1 AA), otimização de bundle e testes automatizados (Vitest).
- **DSH (PO/Dados)**: Responsável pela especificação, backlog, coleta de fontes oficiais (TSE, IBGE, SICONFI, INEP, Legislativo), compilação dos snapshots municipais, scripts de validação (`eleitor_v2/scripts/**`) e auditoria independente.
- **Coordenação**: Toda comunicação formal, início e conclusão de tarefas, dúvidas e bloqueios são registrados no diário append-only:
  `eleitor_v2/.agents/COORDENACAO.md`.

---

## 2. Regras de Ouro de Dados no Frontend

1. **Consumo Estrito do Contrato**:
   - Todo dado exibido vem do snapshot em `/data/municipios/<codigo_ibge>.json` tipado em `src/app/core/models/contrato.model.ts`.
   - **Zero Alucinação de Dados**: Nunca injetar dados fictícios, mocks em produção ou inventar situações políticas não homologadas pelo DSH.
2. **Zero Cálculos de Negócio / Fórmulas Ocultas**:
   - O frontend apenas formata valores (`Intl.NumberFormat`) e renderiza os dados calculados pelo pipeline oficial.
   - Todo percentual deve exibir o selo ou rótulo de sua base (`pct_base`), evitando ambiguidades como "votos nominais" vs "votos válidos".
   - Comparecimento eleitoral segue a regra de ouro: denominador = `eleitores_aptos`.
3. **Visibilidade da Proveniência**:
   - Todo bloco renderizado deve exibir o selo de proveniência correspondente (`oficial`, `curado` ou `pendente`) com o link para o órgão de origem.
   - Blocos com `status: pendente` utilizam a classe `.bloco-pendente` e mostram o motivo textual cadastrado no contrato.
4. **Respeito aos Componentes e Design System (ver `docs/16-tema-escuro-e-interacoes.md`)**:
   - Manter a paleta de tokens reduzida (`$color-verde`, `$color-amarelo`, `$color-laranja`, `$color-vermelho`, `$color-bg-page`, `$color-bg-amber`, `$color-bg-card`).
   - **Normalização Claro ↔ Escuro (ADR-026)**: No modo escuro (`src/styles/base/_dark.scss`), manter exatamente os mesmos matizes do modo claro, ajustando apenas brilho e saturação para contraste WCAG AAA (zero azul/ciano artificial; links em branco discreto `#e4e4e7`).
   - **Sombras de Containers vs. Badges (ADR-026)**:
     - Containers e cards no modo escuro usam o branco amber do modo claro (`$color-bg-amber: rgb(245, 245, 240)`) nas bordas e sombras duras.
     - Badges pretos no claro (`.section-kicker`, `.badge-dark`, `.bg-black.text-white`) ficam brancos (`#ffffff`) com texto preto (`#000000`) no escuro.
     - Toda badge (semântica, neutra ou `.badge-partido`) deve ter a cor do seu `box-shadow` (`2px 2px 0`) igual à sua própria cor primária (`background-color`).
   - **Animações 3D Contidas e Tipografia (ADR-027)**:
     - Animações 3D (`src/styles/components/_motion3d.scss`) aplicam-se apenas a cards e controles clicáveis (`.card-clicavel`, `.metric-card:has(a[href])`, botões e selects) com `scale <= 1` para jamais crescer além do container.
     - Proibida a quebra de palavras em letras (`word-break: normal; overflow-wrap: normal; hyphens: none;`); a quebra ocorre apenas entre palavras.
   - Badges de partido usam as classes e tokens semânticos específicos com contraste medido (≥7:1).
   - Componentes devem obedecer semântica HTML (`aria-label`, `role="tablist"`, `scope="col"`, `loading="lazy"`, etc.).

---

## 3. Checklist Obrigatório de Entrega

Antes de finalizar qualquer tarefa ou commit:

1. `npm run format:check` — Formatação 100% aderente ao Prettier.
2. `HOME=/tmp npm run lint` — ESLint sem nenhum erro ou aviso.
3. `HOME=/tmp npx ng test --watch=false` — Todos os testes unitários passando.
4. `HOME=/tmp npm run build` — Build de produção limpo, sem estourar orçamento de bundle (< 250 KB inicial).
5. Executar os scripts de dados DSH relevantes para garantir que nenhuma alteração quebrou os contratos.
6. Registrar `[ANTIGRAVITY] CONCLUÍDO` em `.agents/COORDENACAO.md` com os hashes dos commits e evidências dos testes.
