import { ProjectSelector } from "./project-selector";

export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
      <p className="text-sm text-muted-foreground">
        100% local — nenhuma API paga envolvida
      </p>
      <ProjectSelector />
    </header>
  );
}
