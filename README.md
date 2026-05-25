# EventHub Frontend

## Descricao do projeto
Interface web do EventHub para descoberta e gerenciamento de eventos, consumindo a API do backend.

## Objetivo da aplicação
Permitir ao usuário interagir com o sistema de eventos via web, incluindo operações de CRUD conforme perfil de acesso.

## Tecnologias utilizadas
- React
- Vite
- JavaScript
- ESLint
- Vitest

## Instruções para execução
1. Instale dependências com npm.
2. Crie o arquivo `.env` a partir do exemplo:
```bash
cp .env.example .env
```
No Windows (PowerShell), use:
```powershell
Copy-Item .env.example .env
```
3. Os valores padrão do `.env` já funcionam para execução local; altere apenas se seu ambiente usar portas/URLs diferentes.
4. Inicie o servidor de desenvolvimento.

## Comandos principais
```bash
npm install
npm run dev
npm run build
npm run test
npm run test:coverage
npm run lint
```

## Estrutura básica do projeto
- `src/pages`: páginas principais da aplicação.
- `src/components`: componentes reutilizáveis.
- `src/api`: integração com endpoints do backend.
- `src/hooks`: hooks customizados.
- `src/assets`: arquivos estáticos.

Documentação integrada (infra, frontend e backend):
- https://github.com/DevOps-EventHub/eventhub-infra

## Integrantes da equipe
- Samuel Araujo
- José Pereira Neto
- José Mailson
