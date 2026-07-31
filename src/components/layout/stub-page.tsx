import type { LucideIcon } from "lucide-react";

export function StubPage({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-3 text-center">
      <Icon className="size-10 text-muted-foreground" />
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        em breve
      </span>
    </div>
  );
}
