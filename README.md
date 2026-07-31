<p align="center">
  <img src="https://angular.dev/assets/images/press-kit/angular_wordmark_gradient.png" alt="Angular Logo" width="300"/>
</p>

<h1 align="center">ng-architect-cli 🚀</h1>

<p align="center">
  <strong>Um gerador open-source de arquitetura corporativa para projetos Angular de alto nível.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@erickg123/ng-architect-cli"><img src="https://img.shields.io/npm/v/@erickg123/ng-architect-cli.svg?style=flat-square&color=blue" alt="NPM Version"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License"></a>
  <a href="https://github.com/ErickG123/ng-architect-cli/actions/workflows/publish.yml"><img src="https://img.shields.io/github/actions/workflow/status/ErickG123/ng-architect-cli/publish.yml?style=flat-square" alt="Build Status"></a>
  <img src="https://img.shields.io/badge/Angular-18+-red.svg?style=flat-square" alt="Angular Version">
</p>

---

## 🎯 O que é o \`ng-architect-cli\`?

Cansado de configurar novos projetos Angular do zero perdendo tempo com configurações de Lint, CI/CD, Bibliotecas de Componentes e Docker? 

O **ng-architect-cli** é uma interface de linha de comando (CLI) interativa projetada para provisionar aplicações Angular prontas para produção instantaneamente. Com uma simples bateria de perguntas no terminal, ele gera um repositório configurado com as melhores práticas da engenharia de software atual.

## ✨ Features

Nossa ferramenta foca em modernidade. Ao utilizar o comando de scaffolding, você pode habilitar de imediato as seguintes features embutidas diretamente na raiz do seu projeto:

- **🔮 Zoneless Change Detection:** Abandone o \`zone.js\` e extraia o máximo de performance com o Signal-based change detection do Angular 18.
- **🎨 UI & Estilização (Tailwind + PrimeNG):** Auto-configuração imaculada do TailwindCSS juntamente com as mais novas APIs do PrimeNG v18.
- **🧠 Estado Robusto (NgRx SignalStore):** Setup pronto para uso focado em Signals reativos corporativos.
- **🐳 Multi-stage Docker:** \`Dockerfile\` otimizado com Nginx pronto para ambientes de esteira (Kubernetes/Cloud).
- **🛡️ Código Limpo Automático:** ESLint, Prettier, Husky e Lint-Staged configurados com regras recomendadas e Path Aliases.
- **⚙️ CI/CD Integrado:** Template de GitHub Actions já exportado e validado.
- **🏗️ Arquitetura Angular Corporativa:** Estrutura de pastas orientada a \`features\`, Core (interceptors base, guards, dark mode service) e uso nativo da standalone API.

## 🚀 Instalação e Uso

Você não precisa instalar a CLI globalmente. Graças ao \`npx\`, basta rodar o comando mais recente no terminal e interagir com o robô gerador:

\`\`\`bash
npx @erickg123/ng-architect-cli@latest
\`\`\`

A CLI guiará você com um passo a passo visual super agradável, gerando os arquivos localmente na pasta escolhida. Após finalizar, acesse a pasta e desfrute do ambiente!

## 🤝 Como Contribuir

Nós amamos a comunidade open-source! Se você quiser adicionar templates novos (como Angular Material, SSR, Micro-frontends), melhorar códigos da CLI, ou reportar bugs, sinta-se à vontade.

Por favor, leia nosso rigoroso [Guia de Contribuição (CONTRIBUTING.md)](./CONTRIBUTING.md) antes de enviar seus Pull Requests. Lá explicamos como testar localmente, o padrão de commits, e como garantir a qualidade da entrega.

## 📄 Licença

Este projeto é licenciado sob os termos da licença **MIT**. Leia o arquivo [LICENSE](./LICENSE) para mais detalhes.

---
<p align="center">Feito com 💻 e ☕ pela comunidade Angular.</p>
