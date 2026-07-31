import type { ModuleDescriptor } from "./types";

/**
 * Registro de módulos do Jarvis — versão mínima do "Module Registry" do
 * Core (docs/planning/modules/01-core.md). De propósito NÃO é um
 * container de injeção de dependência: os módulos continuam se
 * importando via ES modules normalmente. Isso só existe pra dar um lugar
 * único de introspecção (o que existe, o que depende do quê) e health
 * check — o suficiente pra alimentar a página Doctor sem construir um
 * event bus ou lifecycle que hoje não têm nenhum consumidor real.
 */
const modules = new Map<string, ModuleDescriptor>();

export function registerModule(descriptor: ModuleDescriptor): void {
  if (!descriptor.name.trim()) {
    throw new Error("ModuleDescriptor.name não pode ser vazio.");
  }
  modules.set(descriptor.name, descriptor);
}

export function listModules(): ModuleDescriptor[] {
  return Array.from(modules.values());
}

export function getModule(name: string): ModuleDescriptor | undefined {
  return modules.get(name);
}

/**
 * Valida que toda dependência declarada existe e que não há ciclo.
 * Chamado uma vez pelo bootstrap depois de registrar tudo — lança se
 * algo estiver errado, em vez de deixar o app subir com um grafo quebrado.
 */
export function validateDependencies(): void {
  for (const mod of modules.values()) {
    for (const dep of mod.dependencies ?? []) {
      if (!modules.has(dep)) {
        throw new Error(`Módulo "${mod.name}" depende de "${dep}", que não está registrado.`);
      }
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (name: string, path: string[]): void => {
    if (visited.has(name)) return;
    if (visiting.has(name)) {
      throw new Error(`Dependência circular detectada: ${[...path, name].join(" -> ")}`);
    }

    visiting.add(name);
    const mod = modules.get(name);
    for (const dep of mod?.dependencies ?? []) {
      visit(dep, [...path, name]);
    }
    visiting.delete(name);
    visited.add(name);
  };

  for (const name of modules.keys()) {
    visit(name, []);
  }
}

/** Só pra isolar testes entre si — nunca chamado em runtime de verdade. */
export function __resetRegistryForTests(): void {
  modules.clear();
}
