# Collection Postman — HappyFit

`HappyFit.postman_collection.json` cobre a API inteira: Auth, Users, Exercises, Workouts e Sessions — 41 requests, incluindo o caminho feliz de cada rota e os casos de borda que provam as propriedades de segurança do projeto (isolamento entre usuários, cadeia de posse em recursos aninhados, snapshot imutável de sessão, regras de estado). Os contratos exatos de cada rota estão em [`docs/API.md`](../docs/API.md).

## Como importar

No Postman: **Import** → arraste `HappyFit.postman_collection.json` (ou "Upload Files" e selecione o arquivo).

Não precisa importar nenhum arquivo de environment separado — as variáveis (`baseUrl`, `token`, etc.) já vêm dentro da collection, na aba **Variables**.

## Como rodar

1. Suba o backend: `cd backend && npm run dev` (confirme que está em `http://localhost:3333` — se usar outra porta, ajuste `serverUrl`/`baseUrl` na aba Variables da collection).
2. Clique com o botão direito na collection **HappyFit** → **Run collection** (ou o botão "Run" no topo).
3. Rode as pastas **na ordem em que aparecem** — cada uma depende de dados criados pela anterior (o usuário logado em Auth, os exercícios da biblioteca, o treino criado em Workouts...). O Collection Runner já respeita essa ordem por padrão.
4. Ao final, confira o resumo: todos os `pm.test()` devem passar (verde).

Cada request que precisa do resultado da anterior (um id, um token) salva isso sozinho numa variável de collection via script — não precisa copiar nada manualmente, ao contrário de quando testamos na mão durante o desenvolvimento.

## Rodando de novo

O `POST Register` gera um email único a cada execução (`usuario1.<timestamp>@happyfit.test`), então a collection pode ser rodada quantas vezes quiser sem dar `409 EMAIL_ALREADY_IN_USE` — não precisa limpar usuários de teste do banco entre uma rodada e outra.

## Rodando só um pedaço

Dá pra rodar uma pasta isolada (ex: só **Sessions**) contanto que as variáveis dela já tenham sido preenchidas numa rodada anterior — `token`, `exerciseId1`/`exerciseId2` em particular são usados em quase toda pasta depois de Auth/Exercises.
