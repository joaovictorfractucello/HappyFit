# Modo Treino

A tela usada **durante** o treino, na academia. É o coração do HappyFit — o README resume o produto como "foco total na experiência durante o próprio treino", e é aqui que isso acontece.

Este documento descreve **como a tela funciona e por quê**. Ele serve de referência para gerar o mockup (o prompt vira "siga esta spec") e para construir a tela em Flutter.

---

## 1. O momento em que a tela é usada

Antes de qualquer decisão de layout, vale lembrar a situação real:

- Você acabou de fazer uma série. Está ofegante, com a mão suada, provavelmente segurando o celular com uma mão só.
- O celular passa boa parte do tempo **apoiado no banco**, a um metro de distância.
- Entre uma série e outra você tem de 1 a 2 minutos de descanso.
- Às vezes a máquina que você queria está ocupada.

Toda regra abaixo existe para funcionar nesse cenário: **poucos toques, números grandes, legível de longe, nada que atrapalhe.**

Princípio que guia a tela inteira: **o app sugere, nunca obriga.**

---

## 2. Visão geral do fluxo

O Modo Treino tem três telas internas, e você circula entre elas:

```
[App normal — navbar visível]
  Aba "Treinos" (centro da navbar) → toca no [▶] de um treino
              │
              ▼
┌─ MODO TREINO (tela cheia, navbar some) ─────────────────┐
│                                                         │
│   CHECKLIST ──toca num exercício──► REGISTRO            │
│       ▲                                │                │
│       │                         [Concluir série]        │
│       │                                ▼                │
│       │                            DESCANSO             │
│       │                                │                │
│       ├──── completou as séries ◄──────┤                │
│       │                                │                │
│       │         ainda faltam séries ───┘──► REGISTRO    │
│       │                                   (mesmo        │
│       │                                    exercício)   │
│   [segure para encerrar]                                │
└─────────────────────────────────────────────────────────┘
              │
              ▼
[App normal — navbar volta]
```

Em palavras: você escolhe um exercício na lista, faz a série, descansa, e repete até terminar aquele exercício. Aí volta pra lista e escolhe o próximo.

---

## 3. Entrando no Modo Treino

O Modo Treino **não é uma aba** — é uma tela cheia que cobre o app inteiro. A porta de entrada é a aba **Treinos**, no centro da navbar:

```
Aba Treinos (navbar visível)
┌──────────────────────────────┐
│ Treino A · Peito        [▶]  │  ← ▶ inicia o Modo Treino
│ Treino B · Costas       [▶]  │  ← toque no nome abre pra editar
│ Treino C · Perna        [▶]  │
│                              │
│       [ + Novo treino ]      │
└──────────────────────────────┘
```

A mesma aba serve pra iniciar (uso diário) e pra criar/editar treinos (uso raro). Uma aba separada só pra criar treino ocuparia espaço na navbar com algo que você faz poucas vezes.

Ao tocar no ▶:

- A tela vira **tela cheia** e a **navbar desaparece**.
- Só existe uma saída: o botão de encerrar (seção 7).

O Modo Treino só **executa** o treino — nada de criar ou editar treino lá dentro.

**Por quê tela cheia?** Dois motivos. Evita tocar sem querer numa aba no meio do treino. E cria um modo mental claro — "agora estou treinando" — do mesmo jeito que apps de corrida e o modo treino do smartwatch fazem.

---

## 4. Checklist — a tela central

É onde você está "entre exercícios". Mostra todos os exercícios do treino, **empilhados na ordem do plano**:

```
┌──────────────────────────────────────┐
│ Treino A · Peito        45% concluído│
│                                      │
│ ✓ Supino reto                  4/4   │
│ ● Crucifixo                    2/3   │
│ ○ Tríceps polia                0/3   │
│ ○ Leg press                    0/4   │
│                                      │
│         ( segure para encerrar )     │
└──────────────────────────────────────┘
```

| Símbolo | Significa |
|---|---|
| ✓ | Todas as séries planejadas foram feitas |
| ● | Já começou, mas faltam séries |
| ○ | Ainda não começou |

**Você toca em qualquer exercício, na ordem que quiser.** A ordem do plano aparece como sugestão (é a ordem da lista), mas nada te obriga a seguir. Máquina ocupada? Toca em outro.

Um exercício já concluído (✓) **continua tocável**: dá pra fazer uma série extra. Isso vem de uma decisão do backend — séries além do planejado são permitidas.

---

## 5. Registro — fazendo a série

Aparece quando você toca num exercício.

```
┌──────────────────────────────────────┐
│ Crucifixo                            │
│ Série 3 de 3                         │
│                                      │
│     PESO              REPS           │
│    [−] 22 kg [+]    [−] 12 [+]       │
│                                      │
│  ┌────────────────────────────────┐  │
│  │        Concluir série          │  │
│  └────────────────────────────────┘  │
│                                      │
│  Feitas hoje                         │
│  1   20 kg × 12                      │  ← toca pra corrigir
│  2   22 kg × 12                      │
└──────────────────────────────────────┘
```

- **Peso e repetições** são números grandes, ajustados com `−` e `+`. Nada de teclado — digitar número com a mão suada, no meio do treino, é péssimo.
- **Repetições são um número só** (ex: 12), não uma faixa (ex: 8-10). É o que o backend guarda.
- O botão **Concluir série** é grande e fica embaixo, no alcance do polegar.

Ao tocar em Concluir série, a série é **salva no servidor na hora**, e a tela passa para o Descanso.

### Com que valores peso e reps começam

| Situação | Valor inicial |
|---|---|
| Primeira série do exercício | A meta planejada no treino |
| Séries seguintes | O que você fez na série anterior deste exercício, hoje |

Na maioria das séries você só aperta Concluir, sem mexer em nada. E se aumentou o peso na série 2, a série 3 já começa com o peso novo.

Não dá pra começar com o que você fez **no treino passado** — isso exigiria rota nova no backend (seção 10).

### Séries feitas hoje e correção

Embaixo do botão aparecem as séries que você já fez **hoje, neste exercício**. Servem pra duas coisas:

- **Consultar** — "fiz 20 ou 22 na série anterior?" é a pergunta que mais aparece no meio do treino.
- **Corrigir** — tocou numa série, ajusta com os mesmos `−`/`+` e salva.

**Dá pra corrigir, não dá pra apagar.** Se você tocar em Concluir sem querer, a série fica registrada: dá pra ajustar os números, não removê-la. O backend não tem rota pra apagar série. Como o botão é grande e intencional, o risco é baixo pro MVP — se incomodar no uso real, aí vale criar essa rota.

---

## 6. Descanso — o timer

Inspirado no timer nativo do celular: um **anel grande** que vai esvaziando, com a contagem no meio.

```
┌──────────────────────────────────────┐
│              ╭────────╮              │
│           ╭──╯        ╰──╮           │
│           │    01:12     │           │
│           │   descanso   │           │
│           ╰──╮        ╭──╯           │
│              ╰────────╯              │
│                                      │
│   Próxima: série 3 · 22 kg × 12      │
│                                      │
│      [ +30s ]        [ Pular ]       │
└──────────────────────────────────────┘
```

- Começa sempre em **90 segundos**.
- **+30s** estica o descanso. **Pular** encerra na hora.
- **Não tem pausa.** Pausar/retomar timer está fora do escopo do MVP (`DECISIONS.md`) — e no descanso de academia, o que você quer é encerrar antes ou esticar, quase nunca pausar.
- O anel usa a cor de destaque (`accent`, `#8FCBEA`). "Timer de descanso rodando" é exatamente um dos usos que o `DESIGN_SYSTEM.md` reserva para essa cor.
- Quando o tempo zera, o celular **vibra**.

**Por quê um anel?** Dá pra ler de longe. Com o celular no banco, você vê quanto falta sem precisar ler o número.

### Quando o descanso termina

| Situação | Para onde vai |
|---|---|
| Ainda faltam séries neste exercício | Volta pro **Registro do mesmo exercício** |
| Completou as séries planejadas | Volta pro **Checklist** |

Voltar sempre pra lista obrigaria você a tocar no mesmo exercício de novo a cada série — um toque inútil. Por isso só volta pra lista quando o exercício acaba.

---

## 7. Encerrando o treino

Existe **um único botão** de saída, no Checklist.

**Como funciona:** você **segura** o botão por cerca de 1,5 segundo. Enquanto segura, um anel vai preenchendo em volta dele. Quando completa, o celular vibra e o treino encerra. Se soltar antes, nada acontece.

Um toque rápido não encerra — só mostra a dica *"Segure para encerrar"*.

**Por quê segurar, e não um "tem certeza?"** A caixinha de confirmação são dois toques e uma leitura, com a mão suada — e as pessoas aprendem a apertar "sim" sem ler. Segurar é um gesto só, mas deliberado: impossível disparar sem querer, nem com o celular no bolso. A ideia veio do modo treino do smartwatch.

O anel desse botão é **neutro (branco)**, não vermelho. No nosso design system o vermelho é reservado para erro e exclusão, e encerrar não apaga nada — salva o seu histórico. O azul fica exclusivo do descanso.

### Porcentagem concluída

O Checklist sempre mostra quanto do treino já foi feito. É isso que te informa antes de encerrar — em vez de um aviso tipo "faltou Leg Press", que interromperia.

A conta usa **séries**, não exercícios, para mudar a cada série:

```
concluído = soma, em cada exercício, de min(séries feitas, séries planejadas)
total     = soma das séries planejadas
%         = concluído ÷ total
```

**Exemplo:** um treino com supino (4 séries) e crucifixo (3 séries) tem 7 séries planejadas. Você fez 5 de supino e 1 de crucifixo. O supino conta só 4 (a quinta é extra), então: (4 + 1) ÷ 7 = **71%**.

Séries extras não passam de 100% e não compensam exercício que ficou pra trás.

### Encerrar sem nenhuma série

Se você iniciou sem querer e não registrou nada, encerrar **descarta** o treino, em vez de salvar um treino vazio no histórico. Aparece um aviso curto: *"Treino descartado — nenhuma série registrada."*

---

## 8. Sair do app no meio do treino

Você vai abrir o WhatsApp, trocar de música, bloquear o celular. Nada disso pode atrapalhar o treino.

- **O progresso nunca se perde.** Cada série vai para o servidor no momento em que você toca em Concluir série.
- **O app não sai do Modo Treino.** Se você só trocou de app, ao voltar está exatamente onde parou.
- **Se o celular fechar o app** (acontece bastante no Android, principalmente com música tocando junto), ao reabrir o app percebe que existe um treino em andamento e **entra direto no Modo Treino**, em vez da tela inicial.
- **O timer continua certo.** Ele guarda o horário em que o descanso termina, não um contador. Assim, ao voltar pro app, ele sabe exatamente quanto falta.

### Tela acesa

Durante o **Registro** e o **Descanso**, a tela não apaga sozinha. No **Checklist**, ela segue o bloqueio normal do celular.

**Por quê só nessas duas?** Durante a série e o descanso você passa um bom tempo sem tocar no celular. Se a tela apagasse, você teria que desbloquear o celular a cada série. No Checklist você pode ficar parado escolhendo, e ali a tela pode apagar para economizar bateria.

---

## 9. O que cada ação faz no backend

Nenhuma dessas regras exige mudança no backend. Tudo usa rotas que já existem e já foram testadas (`docs/API.md`):

| Ação na tela | Rota |
|---|---|
| Iniciar treino | `POST /workouts/:id/sessions` |
| Reabrir o app com treino em andamento | `GET /sessions` (procura um com `endedAt: null`) |
| Montar o Checklist | `GET /sessions/:id` |
| Concluir série | `POST /sessions/:id/sets` |
| Corrigir uma série feita | `PATCH /sessions/:id/sets/:setId` |
| Encerrar com séries | `PATCH /sessions/:id` |
| Encerrar sem nenhuma série | `DELETE /sessions/:id` |

Timer, porcentagem, status de cada exercício (✓ ● ○) e tela acesa são calculados **no próprio Flutter**, com os dados que essas rotas já devolvem.

---

## 10. Fora do escopo

Estes itens foram considerados e **ficaram de fora de propósito**. Se um mockup trouxer algum deles, é a ferramenta inventando — não entra.

| Item | Por que ficou de fora |
|---|---|
| Pausar o descanso ou o treino | Fora do escopo do MVP (`DECISIONS.md`) |
| Botão Cancelar separado | Confundia com excluir treino. O "iniciei sem querer" já é resolvido pelo descarte automático |
| Fila, "fazer depois", avançar sozinho | O Checklist resolve: você escolhe o exercício |
| Aviso "faltou exercício" ao encerrar | A porcentagem sempre visível já informa, sem interromper |
| Faixa de repetições (8-10) | O backend guarda um número só |
| Tempo de descanso configurável por exercício | Exigiria campo novo no backend. No MVP é 90s, ajustável na hora |
| RPE, cadência, peso da barra separado | Dados que o app não registra |
| Comparação com o treino anterior | Exigiria rota nova no backend |
| Apagar uma série registrada | O backend não tem essa rota. Dá pra corrigir os números |
