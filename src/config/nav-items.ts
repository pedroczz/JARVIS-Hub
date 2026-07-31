import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Brain,
  Component,
  Crown,
  FileText,
  FolderGit2,
  GitBranch,
  History,
  Home,
  ListTodo,
  Map,
  MessageSquare,
  Rocket,
  ScrollText,
  Settings,
  Stethoscope,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  status: "ready" | "soon";
}

/** 16 módulos da sidebar — 5 funcionais, 11 "em breve". */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home, status: "ready" },
  { href: "/projetos", label: "Projetos", icon: FolderGit2, status: "ready" },
  { href: "/chat", label: "Chat", icon: MessageSquare, status: "ready" },
  { href: "/git", label: "Git", icon: GitBranch, status: "ready" },
  { href: "/arquitetura", label: "Arquitetura", icon: Boxes, status: "soon" },
  { href: "/componentes", label: "Componentes", icon: Component, status: "soon" },
  { href: "/backlog", label: "Backlog", icon: ListTodo, status: "soon" },
  { href: "/roadmap", label: "Roadmap", icon: Map, status: "soon" },
  { href: "/memoria", label: "Memória", icon: Brain, status: "soon" },
  { href: "/doctor", label: "Doctor", icon: Stethoscope, status: "ready" },
  { href: "/cto", label: "CTO", icon: Crown, status: "soon" },
  { href: "/documentacao", label: "Documentação", icon: FileText, status: "soon" },
  { href: "/deploy", label: "Deploy", icon: Rocket, status: "soon" },
  { href: "/configuracoes", label: "Configurações", icon: Settings, status: "soon" },
  { href: "/logs", label: "Logs", icon: ScrollText, status: "soon" },
  { href: "/timeline", label: "Timeline", icon: History, status: "soon" },
];
