import { AlignLeft, Github, GitPullRequestArrow, HelpCircle, Keyboard, Layers, Settings2, Sliders, Sparkles, Type, Shield, Scale } from "lucide-react";

export const docSections = [
  { id: "getting-started", title: "Getting Started", category: "guide", icon: HelpCircle },
  { id: "workspace-layout", title: "Workspace & Resizers", category: "guide", icon: Layers, badge: "Premium" },
  { id: "toolbar-icons", title: "Workspace Toolbar Icons", category: "tools", icon: Settings2, badge: "All Icons" },
  { id: "config-switches", title: "Workspace Switches", category: "tools", icon: Sliders },
  { id: "transform-rules", title: "Transforms & Ignores", category: "tools", icon: AlignLeft },
  { id: "editor-styling", title: "Editor & Font Customizer", category: "tools", icon: Type },
  { id: "gitclear-rich", title: "GitClear Operations", category: "systems", icon: GitPullRequestArrow, badge: "AI Logic" },
  { id: "theme-engine", title: "Universal Theme Engine", category: "systems", icon: Sparkles, badge: "Cohesive" },
  { id: "open-source", title: "Open Source & Env", category: "systems", icon: Github },
  { id: "keyboard-shortcuts", title: "Keyboard Shortcuts", category: "reference", icon: Keyboard },
  { id: "privacy-policy", title: "Privacy Policy", category: "legal", icon: Shield },
  { id: "license", title: "License Agreement", category: "legal", icon: Scale }
];
