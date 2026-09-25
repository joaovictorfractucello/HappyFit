# Design system

## Cores

### Fundo (neutras)

| Token | Hex | Uso |
|---|---|---|
| background | `#121319` | Fundo do app |
| surface | `#1C1F26` | Cards, containers |
| surfaceAlt | `#262A33` | Elementos dentro de card |

### Texto

| Token | Hex | Uso |
|---|---|---|
| textPrimary | `#F4F6F8` | Texto principal |
| textSecondary | `#7C8894` | Labels, descrições |
| textMuted | `#4A505A` | Texto desabilitado |

### Marca

| Token | Hex | Uso |
|---|---|---|
| accent | `#8FCBEA` | Streak, progresso, série ativa — uso único e constante, nunca decorativo |
| buttonPrimary | `#F4F6F8` | Botão primário (texto do botão usa `#121319`) |

### Estado (uso pontual)

| Token | Hex | Uso |
|---|---|---|
| error | `#E5484D` | Erro, exclusão, campo inválido |
| success | `#3DD68C` | Confirmação |
| warning | `#F5A623` | Aviso |

**Regra de uso do accent**: reservado para progresso e ação ativa (streak, série em execução, timer de descanso rodando). Nunca usado em título, botão primário ou navegação — a raridade é o que faz o accent funcionar.

## Tipografia

Fonte: **Inter** (números com largura tabular — evita "pulo" visual quando o valor de carga muda).

| Uso | Tamanho | Peso |
|---|---|---|
| Número em destaque (timer, carga) | 32px | Semibold (600) |
| Título de tela | 22px | Semibold (600) |
| Título de card/seção | 18px | Semibold (600) |
| Corpo | 15px | Regular (400) |
| Secundário | 13px | Regular (400) |
| Label pequeno | 11px | Medium (500) |

Apenas 3 pesos (400/500/600) — reduz peso do bundle e mantém consistência.

## Espaçamento

Grid de 4px: `4, 8, 12, 16, 24, 32, 48`.

## Raio de borda

| Elemento | Valor |
|---|---|
| Cards | 16px |
| Botões / inputs | 12px |
| Badges / tags | 8px |

## Alvo de toque

Botões: **52–56px** de altura — maior que o padrão web, pensado para uso com as mãos suadas, entre séries, no meio do treino.

## Logo

**Wordmark**: fonte **Orbitron**, peso 900 (Black), caixa alta (`HAPPYFIT`), letter-spacing levemente aberto. Licença SIL Open Font License — livre para uso comercial sem restrição. Cor padrão: `#F4F6F8` (branco); variação de marca em `#8FCBEA` (accent) permitida em contextos de identidade (splash screen, materiais), não usada em UI funcional.

**Ícone**: pegada de pinguim estilizada, silhueta orgânica com curvas suaves, sobre fundo escuro (`#121319`). Gerado via modelo de geração de imagem (Gemini) e aprovado em versão simples/limpa, sem elemento adicional de referência à academia — a identidade "fitness" já é carregada pelo nome do app e pelo wordmark, evitando poluir a silhueta. Contraste proposital com o wordmark angular (Orbitron): o ícone acompanha a linguagem arredondada do restante da UI (cards `16px`, botões `12px`), não a do texto.

Cor padrão **branca** (`#F4F6F8`) — usada tanto no ícone do app quanto na splash screen. Variação em accent (`#8FCBEA`) existe como opção de marca (mesma regra do wordmark: reservada a contextos de identidade/materiais, não usada em UI funcional) — guardada, sem uso definido ainda.

Arquivos em `docs/assets/`: `logo-icon-branca.png` (definitiva, 1024×1024) e `logo-icon.jpg` (variação accent, mesma resolução).

PNG em alta resolução é suficiente — nenhuma vetorização necessária. `flutter_launcher_icons` gera os tamanhos do ícone do app e `flutter_native_splash` gera a splash screen, os dois a partir do PNG único, quando o projeto Flutter existir.