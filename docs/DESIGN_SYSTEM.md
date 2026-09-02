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

Em definição. Direção acordada: wordmark customizado (não fonte pronta), traços retos e angulares, cortes diagonais, alto peso visual — sem curvas suaves ou elementos "fofos". Ícone: pata de pinguim, geometria simplificada. A ser finalizado com apoio de ferramenta de design vetorial dedicada.
