# Guia de Contribuição 🤝

Primeiramente, obrigado por dedicar seu tempo para contribuir com a **ng-architect-cli**! São pessoas como você que fazem a comunidade open-source ser tão incrível.

## 🚀 Como começar (Setup Local)

Para rodar o projeto e testar suas alterações localmente, siga estes passos:

1. Faça um **Fork** deste repositório clicando no botão "Fork" no canto superior direito da página do GitHub.
2. Clone o seu fork para a sua máquina:
   ```bash
   git clone https://github.com/ErickG123/ng-architect-cli.git
   cd ng-architect-cli
   ```
3. Instale as dependências usando NPM:
   ```bash
   npm install
   ```
4. Compile o projeto e teste a CLI localmente:
   ```bash
   npm run build
   # Para testar a execução:
   node ./dist/index.js
   ```

## ✅ Padrão de Commits (Conventional Commits)

Nós utilizamos ferramentas automatizadas para gerar versões e Changelogs. Portanto, **é obrigatório** que todos os commits sigam a especificação do [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/).

Exemplos aceitos:
- `feat: adiciona suporte ao Angular Material`
- `fix: corrige geração do arquivo Dockerfile`
- `docs: atualiza documentação de uso no README`
- `chore: atualiza dependências do projeto`
- `test: adiciona testes unitários para a camada de scaffold`

*Dica: Você pode rodar `npm run release` se quiser simular a geração, mas o próprio Husky (se configurado) bloqueará commits fora do padrão.*

## 🧪 Qualidade de Código (Lint e Testes)

Antes de abrir o seu Pull Request (PR), garanta que seu código está dentro dos padrões do projeto:

1. **Testes Unitários:** Todo novo código (feature ou bugfix) deve estar coberto por testes. Execute a suíte para garantir a barra verde:
   ```bash
   npm run test
   ```
2. **Linting (Check de Tipos):** Certifique-se de que não existem erros de compilação ou de tipagem no TypeScript:
   ```bash
   npx tsc --noEmit
   ```

## 📬 Como abrir um Pull Request

1. Crie uma branch a partir da `main` com um nome descritivo: `git checkout -b feat/minha-nova-feature`.
2. Commit suas alterações usando Conventional Commits.
3. Faça o push para o seu fork: `git push origin feat/minha-nova-feature`.
4. Abra um Pull Request preenchendo o template que será exibido no GitHub e aguarde o Code Review!

Estamos felizes em tê-lo a bordo! 🎉
