#!/usr/bin/env node

import * as p from "@clack/prompts";
import pc from "picocolors";
import path from "node:path";

import { askUserPrompts } from "./utils/prompts.js";
import { scaffoldProject } from "./utils/scaffold.js";
import { initGit, installDependencies } from "./utils/system.js";
import updateNotifier from 'update-notifier';
import packageJson from '../package.json';

async function main() {
  console.clear();

  const notifier = updateNotifier({ pkg: packageJson });

  if (notifier.update) {
    notifier.notify({
      message: 'Nova versão disponível! {currentVersion} -> {latestVersion}\nRode "npm i -g {packageName}" para atualizar.',
      isGlobal: true,
    });
  }

  p.intro(
    `${pc.bgCyan(pc.black(" 🚀 ng-architect-cli "))} ${pc.cyan("Bem-vindo ao gerador de projetos Angular!")}`,
  );

  const project = await askUserPrompts();

  p.note(
    `Nome: ${project.projectName}
    Gerenciador: ${project.packageManager}
    Zoneless: ${project.zoneless ? "Sim" : "Não"}
    UI: ${project.uiLibrary}
    Estado: ${project.stateManagement}`,
    "Resumo das suas escolhas:",
  );

  const spinner = p.spinner();
  const targetDir = path.join(process.cwd(), project.projectName);

  try {
    spinner.start(`Criando o projeto ${project.projectName}...`);
    scaffoldProject(project, targetDir);
    spinner.stop(`Projeto ${project.projectName} criado com sucesso!`);

    await initGit(targetDir);
    await installDependencies(project.packageManager, targetDir);

    p.outro(
      `Tudo pronto! Digite ${pc.cyan(`cd ${project.projectName}`)} para começar.`,
    );
  } catch (error) {
    spinner.stop("Ocorreu um erro ao criar o projeto.");
    console.error(error);
  }
}

main().catch(console.error);
