export type HealthState = "healthy" | "degraded" | "down";

export interface HealthResult {
  state: HealthState;
  detail?: string;
}

export interface ModuleDescriptor {
  name: string;
  version: string;
  description: string;
  /** Nomes de outros módulos registrados dos quais este depende. */
  dependencies?: string[];
  /** Verificação opcional e barata — nunca deve fazer trabalho pesado. */
  health?: () => Promise<HealthResult> | HealthResult;
}

export interface ModuleHealthReport extends HealthResult {
  module: string;
}
