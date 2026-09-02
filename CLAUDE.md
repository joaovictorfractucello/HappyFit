# Instruções para o Claude Code — Projeto HappyFit

## Contexto do desenvolvedor

Experiente em backend: Node.js, Express, APIs REST, MySQL/PostgreSQL, Git. **Zero experiência prévia em Flutter e em TypeScript** — ambos estão sendo aprendidos durante a construção deste projeto, na prática, conforme cada funcionalidade exige.

Formação em Segurança da Informação e Engenharia de Software — segurança e arquitetura bem pensada são prioridades reais no projeto, não só teoria.

## Como trabalhar comigo

- **JAMAIS edite, crie ou remova qualquer arquivo do projeto — incluindo este `CLAUDE.md` — sem eu autorizar explicitamente antes.** Proponha a mudança, mostre o que seria feito, e espere meu OK. Autorização vale só para o que foi pedido naquele momento, não é permissão permanente.
- Sempre em português, com explicações didáticas — construa entendimento, não entregue só código pronto.
- Antes de escrever código novo, explique o que vamos fazer e por quê. Não presuma conhecimento de conceitos ainda não vistos, especialmente em Flutter e TypeScript.
- Ao corrigir um erro, siga sempre esta ordem: o que está errado → por que está errado → como corrigir → como evitar no futuro. Nunca entregue só a correção.
- Se houver uma solução simples e uma mais complexa para o mesmo problema, apresente a simples primeiro, e explique quando a complexa valeria a pena.
- Não adicione tecnologia, dependência ou abstração sem necessidade real. Questione se uma funcionalidade agrega valor antes de sugeri-la.
- Vá com calma nas partes de Flutter — mais explicação, passos menores, sem presumir familiaridade com widgets, estado, navegação ou qualquer conceito mobile.
- Em decisões de produto ou arquitetura, funcione como parceiro de raciocínio: não concorde automaticamente, aponte riscos e alternativas quando existirem.

## Contexto do projeto

Leia `README.md` e os arquivos em `docs/` antes de iniciar qualquer trabalho:

- `docs/ARCHITECTURE.md` — arquitetura em camadas (routes → controllers → services → repositories), aplicação pragmática de SOLID
- `docs/DATA_MODEL.md` — entidades e relacionamentos (Prisma)
- `docs/API.md` — todas as rotas da API
- `docs/DESIGN_SYSTEM.md` — cores, tipografia, espaçamento (para as telas Flutter)
- `docs/DECISIONS.md` — decisões técnicas já tomadas e o porquê — **não reabrir essas decisões sem eu pedir explicitamente**

## Regras de código

- Backend em TypeScript, seguindo estritamente a separação de camadas descrita em `ARCHITECTURE.md`. Services nunca importam `req`/`res`. Repositories são a única camada que toca o Prisma.
- SQL sempre parametrizado (garantido pelo Prisma por padrão) — nunca concatenar valores em queries.
- Senhas sempre com hash (bcrypt), nunca texto puro.
- Nomenclatura de código em inglês (rotas, variáveis, entidades), mesmo com domínio em português.
- Validar toda entrada de API antes de chegar no Service.
- Não implementar nada listado como "fora do escopo atual" em `DECISIONS.md` sem confirmação explícita meu — inclui: refresh token, exercício personalizado, reordenar exercícios, pausar/retomar timer.

## Filosofia geral

Este projeto prioriza ser **terminável e bem executado** sobre ser grande. Prefira sempre a solução mais simples que resolve o problema corretamente. Segurança e arquitetura bem pensada desde o início são mais importantes que quantidade de funcionalidades.
