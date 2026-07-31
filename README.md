# 🏗️ NG Architect CLI

Uma CLI moderna em Node.js altamente opinativa, desenhada para criar projetos e boilerplates **Angular 21** com nível Enterprise.

## 🌟 Principais Recursos

- **Angular 21 Ready**: Projetos gerados com as últimas capacidades do ecossistema Angular.
- **Standalone 100%**: Adoção total do paradigma Standalone Components, sem uso de `NgModules` defasados.
- **Arquitetura Feature-Based**: Estrutura de diretórios limpa, favorecendo a escalabilidade e o Domain-Driven Design (DDD).
- **Interceptores Funcionais**: Configuração out-of-the-box com `HttpInterceptorFn` para lidar com Autenticação e Tratamento de Erros via RxJS.
- **Zoneless Support**: Opção para habilitar nativamente a Detecção de Mudanças sem Zone.js (`provideExperimentalZonelessChangeDetection`).
- **Design Systems**: Integração rápida e configurada com Tailwind CSS, PrimeNG ou Angular Material.
- **Gerenciamento de Estado Reativo**: Suporte a `@ngrx/signals` (Signal Store).
- **Compatibilidade Avançada PNPM v10+**: O projeto gerado lida perfeitamente com o bloqueio de scripts nativos de build (via `pnpm-workspace.yaml`) e resoluções estritas.

## 🚀 Instalação e Configuração

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/ErickG123/ng-architect-cli.git
cd ng-architect-cli

# Instale as dependências (pode usar npm, pnpm ou yarn)
npm install

# Gere o build (cria a pasta /dist)
npm run build
```

## 💻 Como usar

Você pode executar a CLI diretamente durante o desenvolvimento:

```bash
npm run dev
```

A CLI abrirá um menu interativo extremamente visual (graças ao `@clack/prompts`) e pedirá as seguintes informações:

1. **Nome do projeto**
2. **Gerenciador de pacotes** (npm, pnpm, yarn)
3. **Se deseja utilizar o Zoneless Change Detection**
4. **Qual biblioteca de UI utilizar** (Tailwind, PrimeNG, Angular Material ou Nenhuma)
5. **Solução de Gerenciamento de Estado** (@ngrx/signals ou Nenhuma)

Logo após, ela irá copiar a arquitetura, gerenciar o `package.json`, instalar os pacotes sem bloquear a Thread do Node (usando `spawn`), inicializar o Git e entregar o projeto pronto.

## 📂 Arquitetura Base Gerada

Quando você escolhe a arquitetura padrão, o projeto gerado em `/src/app` terá a seguinte estrutura limpa e profissional:

```text
src/
└── app/
    ├── core/
    │   └── http/
    │       ├── auth.interceptor.ts
    │       └── error.interceptor.ts
    ├── features/
    │   └── dashboard/
    ├── shared/
    │   ├── pipes/
    │   ├── ui/
    │   └── utils/
    ├── app.component.ts
    ├── app.config.ts
    └── app.routes.ts
```

## 🛠️ Stack Técnica da CLI

- **TypeScript**: Tipagem forte.
- **Clack Prompts** (`@clack/prompts`): Para um terminal bonito e interativo.
- **tsup**: Bundler ultrarrápido (baseado no esbuild) para gerar os arquivos Node nativos de execução.
- **fs-extra**: Manipulação e cópia em massa de pastas estruturais (`template/`).

## 🔄 Fluxo de Versionamento e Lançamento (Release)

Este projeto utiliza **Conventional Commits** e versionamento semântico automatizado. Nunca altere a versão no `package.json` manualmente.

Para criar um novo lançamento, siga o fluxo abaixo:

### 1. Faça seus Commits

O projeto utiliza Husky para validar as mensagens de commit.

```bash
git add .
git commit -m "feat: adiciona suporte ao PrimeNG" # Exemplo de nova funcionalidade
```

### 2. Gere a Versão e o Changelog

Este comando lerá seus commits, atualizará a versão no `package.json`, gerará/atualizará o `CHANGELOG.md` e criará a Tag no Git.

```bash
npm run release
```

### 3. Dispare o Deploy (GitHub Actions)

Envie o código e as tags para o repositório. Isso fará com que o GitHub Actions builde o projeto, gere a release note visual e publique o pacote automaticamente no GitHub Packages.

```bash
git push origin main --follow-tags
```

### 🧠 Regras de Versionamento (SemVer)

A automação decide o salto de versão baseada no prefixo do seu commit:

- **Patch** (0.1.0 ➔ 0.1.1): Use o prefixo `fix:` para correções de bugs.
- **Minor** (0.1.0 ➔ 0.2.0): Use o prefixo `feat:` para novas funcionalidades.
- **Major** (0.1.0 ➔ 1.0.0): Adicione uma exclamação (`feat!:`) ou um rodapé `BREAKING CHANGE:` para mudanças incompatíveis. Para forçar manualmente, rode `npm run release:major`.

## 🗺️ Próximos Passos (Roadmap)

_(Planejamento de evoluções futuras da CLI)_

---

**Desenvolvido com foco em Arquitetura Limpa e nas melhores práticas do ecossistema moderno do Angular.**
