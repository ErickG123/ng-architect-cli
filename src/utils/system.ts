import * as p from "@clack/prompts";
import { spawn } from "node:child_process";
import type { CliAnswers } from "../types/index.js";

function runCommand(command: string, cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      cwd,
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let output = "";
    child.stdout.on("data", (data: Buffer) => {
      output += data.toString();
    });
    child.stderr.on("data", (data: Buffer) => {
      output += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            output.trim() || `"${command}" falhou com código de saída ${code}.`,
          ),
        );
      }
    });

    child.on("error", (err) => {
      reject(new Error(`Falha ao iniciar "${command}": ${err.message}`));
    });
  });
}

export async function initGit(targetDir: string): Promise<void> {
  await runCommand("git init", targetDir);
  p.log.success("Repositório Git inicializado.");
}

export async function installDependencies(
  packageManager: CliAnswers["packageManager"],
  targetDir: string,
): Promise<void> {
  const spinner = p.spinner();

  spinner.start(
    `Instalando dependências com ${packageManager}... (isso pode demorar um pouco)`,
  );

  try {
    await runCommand(`${packageManager} install`, targetDir);
    spinner.stop("Dependências instaladas com sucesso!");
  } catch (e: any) {
    spinner.stop("Falha ao instalar as dependências.");

    if (e.message) {
      p.log.error(`Erro detalhado:\n${e.message}`);
    }

    p.log.error(
      `Não foi possível instalar automaticamente.\n` +
        `Execute manualmente: ${packageManager} install dentro da pasta ${targetDir}`,
    );
  }
}
