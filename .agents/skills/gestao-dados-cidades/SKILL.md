---
name: gestao-dados-cidades
description: >-
  Procedimento operacional e checklist de qualidade para ingestão de novas cidades,
  validação de contratos de dados (TSE, IBGE, SICONFI, INEP, Legislativo) e execução do
  Gate de Dados em colaboração estreita entre Antigravity e DSH.
---

# Gestão e Confiabilidade de Dados Municipais (DSH ↔ Antigravity)

Este guia operacional consolida as regras de proveniência, integridade matemática e validação necessárias para adicionar novas cidades ao **Eleitor v2** sem risco de divergências ou corrupção de dados.

---

## 1. Princípios Inegociáveis (Regras de Ouro)

1. **Fonte Primária e Oficial Obrigatória**:
   - Dados eleitorais: TSE (BU agregado municipal, `votacao_candidato_munzona`, `consulta_cand`).
   - Dados socioeconômicos: IBGE (Censo 2022 SIDRA 4714/10295/9923/9606, estimativas 29171, escolarização 60045, malha SVG municipal).
   - Dados fiscais: Tesouro Nacional / SICONFI (DCA Anexos I-C e I-D).
   - Educação: INEP (IDEB).
   - Legislativo: APIs oficiais da Câmara dos Deputados e do Senado Federal.
2. **Zero Fórmulas Sintéticas ou Deduções Arbitrárias**:
   - Nunca derivar percentuais por subtração arbitrária (`100 - % A = % B`).
   - Comparecimento eleitoral tem denominador único obrigatório: `eleitores_aptos` (ADR-013).
   - Todo percentual declara explicitamente sua base em `pct_base`.
3. **Envelope de Proveniência em Toda Seção (ADR-003)**:
   - Toda seção no JSON contém: `titulo`, `categoria`, `status`, `fonte`, `ano`, `coletado_em`, `motivo`, `dados`.
   - `status ∈ {oficial, curado, pendente}`.
   - Qualquer dado sem gerador automático ou ausente vai com `status: pendente` + `motivo` claro ao cidadão.
4. **Imutabilidade e Hashes SHA-256**:
   - Fotos e arquivos de origem (ZIPs, SVG de malha) são versionados com checksum SHA-256 registrado no manifest/metadado.

---

## 2. Roteiro Passo a Passo para Adicionar Nova Cidade

### Passo 1: Mapeamento de Identificadores

- Identificar o `codigo_ibge` (7 dígitos, ex.: `5003702`) e o `codigo_tse` (5 dígitos, ex.: `"90735"`).
- Definir a UF de referência (para deputados federais, estaduais, senadores e governador).

### Passo 2: Coleta de Dados Primários (Scripts DSH)

- Coletar dados municipais do TSE 2024:
  > **Atenção Crítica**: Filtrar estritamente por `NR_TURNO`. Em cidades com 2º turno, nunca somar 1º e 2º turnos para o cargo de Prefeito (prevenção de erro P0-04).
- Coletar BU oficial do TSE 2026 (1T e 2T municipal de Presidente).
- Consultar APIs IBGE e SICONFI gerando os indicadores do município.
- Baixar o SVG da malha territorial municipal do IBGE em `data/geo/<codigo_ibge>.svg`.
- Baixar fotos oficiais (TSE DivulgaCand/Câmara/Senado), redimensionar para 256×256 pixels e registrar hash SHA-256 em `data/fotos/manifest.json`.

### Passo 3: Compilação do Snapshot (`compilar_cidade.py`)

- Gerar `data/municipios/<codigo_ibge>.json` respeitando o schema do contrato (atualmente `0.12.0`).
- Manter o timestamp real de cada coleta no campo `coletado_em` da seção (evitando usar o timestamp do build).

### Passo 4: Execução do Gate de Dados Obrigatório

Executar os 5 scripts de validação a partir da raiz do projeto:

```bash
# 1. Validação estrutural do contrato (schema, campos obrigatórios, mandatos)
python3 ../scripts/validar_contrato.py public/data/municipios/<codigo_ibge>.json

# 2. Validação cruzada dos números de urna contra a base primária do TSE
python3 ../scripts/validar_numeros_tse.py public/data/municipios/<codigo_ibge>.json

# 3. Validação de números de urna históricos (2018/2022) para não concorrentes
python3 ../scripts/validar_numeros_historicos.py public/data/municipios/<codigo_ibge>.json

# 4. Validação de fotos (256x256, existência do arquivo e hash SHA-256)
python3 ../scripts/validar_fotos.py

# 5. Auditoria matemática e lógica independente (P0 e P1 bloqueantes)
python3 ../scripts/auditar_dados.py
```

### Passo 5: Sincronização e Publicação

- Copiar o arquivo validado para `public/data/municipios/<codigo_ibge>.json`.
- Atualizar `public/data/indice-cidades.json`, adicionando o objeto da nova cidade com `"disponivel": true`.
- Executar os testes automatizados da aplicação:
  ```bash
  HOME=/tmp npx ng test --watch=false
  npm run format:check && HOME=/tmp npm run lint
  HOME=/tmp npm run build
  ```

---

## 3. Protocolo de Bloqueios e Divergências

- **Erros P0 (Bloqueio Total)**: Erro material de contagem de votos, turnos somados indevidamente, comparecimento calculado sobre votos válidos em vez de aptos. Nenhuma release ou demo pode ocorrer com P0 aberto.
- **Erros P1 (Bloqueio de Nova Feature)**: Inconsistência de mandatos, foto ausente, `coletado_em` genérico, falta de motivo em seção pendente. Deve ser resolvido antes de iniciar novas telas.
- **Divergências Homologadas**: Registrar em `pendencias` do JSON com mensagem transparente ao eleitor.
