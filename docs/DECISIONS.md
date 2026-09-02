# Decisões técnicas

Registro das principais decisões do projeto e o raciocínio por trás de cada uma.

## Workout ≠ WorkoutSession

O planejamento de um treino é uma entidade separada da execução real dele. Sem essa separação, ajustar a carga durante o treino destruiria o planejamento original, e não seria possível construir um histórico real de evolução. Ver `DATA_MODEL.md`.

## MVP reduzido, escolhido para ser finalizável

O maior risco do projeto não é o backend (área de familiaridade), é o Flutter (zero experiência prévia). Por isso o MVP corta funcionalidades que adicionam superfície de UI/estado sem serem essenciais ao uso real: exercício personalizado, reordenar exercícios, pausar/retomar timer de descanso, refresh token.

Por outro lado, CRUD completo em `Workout` e `Session` foi mantido — diferente das funcionalidades acima, editar/excluir treino e corrigir/excluir sessão são operações básicas sem as quais o app não seria realmente usável no dia a dia.

## App mobile nativo, sem versão web

O Modo Treino (tela de execução) depende de resposta rápida e fluida — timer, transições entre séries, toques rápidos. Uma versão web mobile teria experiência inferior nesse momento específico, que é o núcleo do produto.

## PostgreSQL via Neon (substitui MySQL do plano original)

Serverless, sem necessidade de gerenciar servidor, free tier generoso, e suporte a branching (cópia do banco para testar migration sem risco). PostgreSQL e MySQL seriam equivalentes para o escopo do projeto — a escolha foi por familiaridade prévia com a ferramenta.

## Prisma como ORM

Gera queries parametrizadas por padrão (proteção contra SQL Injection automática), gera tipos TypeScript a partir do schema, e inclui sistema de migrations. Ainda permite visibilidade sobre o SQL gerado quando necessário.

## TypeScript no backend

Combina diretamente com os tipos gerados pelo Prisma. Permite definir contratos claros entre as camadas da arquitetura (o formato exato de dado que cada camada espera). Como o desenvolvedor já tem experiência prévia em JavaScript/Node, o custo de adoção é baixo.

## Autenticação: JWT de 7 dias, sem refresh token no MVP

O modelo mais seguro (access token curto + refresh token) exige lógica adicional no lado do Flutter — interceptar erro 401, renovar token em segundo plano, repetir a requisição original. Como o Flutter é a maior fonte de risco do projeto (zero experiência prévia), essa complexidade foi conscientemente adiada.

Trade-off aceito: o usuário precisa logar novamente após 7 dias de inatividade do token. Refresh token está mapeado como melhoria de segurança para v1.1.

## Código em inglês, domínio em português

Nomenclatura de rotas, entidades e variáveis em inglês (padrão de mercado), independentemente do domínio do produto (treino de academia, contexto brasileiro).

## Fora do escopo atual — roadmap

**v1.1**: dashboard com gráficos, recordes pessoais, volume, frequência, sistema de consistência/streak (meta semanal, não sequência obrigatória diária), reordenar exercícios, exercício personalizado, pausar/retomar timer, refresh token.

**v2**: gerador de treino por IA (com revisão e confirmação do usuário antes de salvar), AI Coach para perguntas sobre evolução e treino.

**Futuro**: funcionamento offline, notificações, integração com smartwatch, funcionalidades para personal trainers.
