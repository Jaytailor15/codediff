# CodeDiff Pro

[![Open Source](https://img.shields.io/badge/Open%20Source-Cohesive-115e59?style=for-the-badge&logo=github)](https://github.com/jaytailor15/codediff)
[![License: Restrictive OS](https://img.shields.io/badge/License-Restrictive%20OS-115e59?style=for-the-badge)](file:///Users/pritugvcl/Documents/codediff/README.md#license-agreement)
[![Privacy Policy: Local Sandbox](https://img.shields.io/badge/Privacy-100%25%20Local%20Sandbox-115e59?style=for-the-badge)](file:///Users/pritugvcl/Documents/codediff/README.md#privacy-policy)
[![Next.js Version](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![React Version](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript Version](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

CodeDiff Pro is a production-ready, high-fidelity developer workspace built for rapid side-by-side (split) and unified (inline) code comparison. Engineered with complete client-side sandboxing, dynamic Monaco Editor sizing, and theme-reactive aesthetics, CodeDiff Pro ensures your proprietary code is parsed safely, symmetrically, and efficiently entirely inside your browser environment.

---

## Interface Overview & Screenshots

The application consists of six main premium UI modules.

### 1. Main Symmetrical Editor Interface
![Main Symmetrical Editor Interface](./public/screenshots/workspace_comparison.png)
*Figure 1: Full comparison panel displaying original and modified editors side-by-side, synchronous scrolling, live change count metrics, and custom visual dropzones.*

### 2. Workspace Configuration Settings
![Workspace Configuration Settings](./public/screenshots/workspace_settings.png)
*Figure 2: Workspace controls panel enabling real-time editing switches, hide unchanged lines, wrap long lines, tab spacing toggles, and customized difference ignore transforms.*

### 3. Symmetrical Comparison Inspector
![Symmetrical Comparison Inspector](./public/screenshots/workspace_metrics.png)
*Figure 3: Live Inspector panel displaying total changed lines, additions, removals, and total output lines alongside custom quick actions for canvas clearing and patch copying.*

### 4. Advanced Git & Rich Diff Analysis
![Advanced Git & Rich Diff Analysis](./public/screenshots/git_analysis.png)
*Figure 4: Advanced Git analysis dashboard including precise moved code block tracking, duplicated paste block discovery, and bulk pattern replacements.*

### 5. High-Contrast Symmetrical Diff Viewer
![High-Contrast Symmetrical Diff Viewer](./public/screenshots/diff_viewer.png)
*Figure 5: High-contrast, theme-reactive inline visual diff reader containing hidden unchanged line indicators and unified difference highlights.*

### 6. Integrated Dynamic Documentation Portal
![Integrated Dynamic Documentation Portal](./public/screenshots/docs_workspace.png)
*Figure 6: Professional developer documentation panel showing categories, environmental variables setup instructions, static local privacy protocols, and semantic release details.*

---

## Detailed Step-by-Step Installation Guide

Follow these steps to configure, build, and deploy CodeDiff Pro on your local machine.

### Step 1: Verify System Prerequisites
Before cloning, ensure you have Node.js and npm installed on your machine.
- **Node.js**: Version `18.x` or higher (Version `20.x` or `22.x` Recommended)
- **npm**: Version `9.x` or higher
- **Git**: Installed and configured on your system shell

Run the following commands in your terminal to verify your local runtime environment:
```bash
node --version
npm --version
git --version
```

### Step 2: Clone the Official Repository
Open your terminal and execute git clone to copy the codebase. Ensure you pull from the official repository under Jay Tailor's space:
```bash
git clone https://github.com/jaytailor15/codediff.git
cd codediff
```

### Step 3: Install Package Dependencies
Install the exact, strict-type package lock dependencies specified in `package.json`. CodeDiff Pro is built using Next.js 15, React 19, and Monaco React:
```bash
npm install
```
*Note: This command resolves all dependencies including Zustand, Framer Motion, Radix UI primitives, and Monaco Editor packages.*

### Step 4: Configure Local Environment Variables
Branding and repository paths are controlled via standard environment variables.
1. Duplicate the `.env.example` file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and verify/adjust the parameters:
   ```env
   NEXT_PUBLIC_APP_NAME="CodeDiff Pro"
   NEXT_PUBLIC_APP_VERSION="1.4.3"
   NEXT_PUBLIC_REPO_URL="https://github.com/jaytailor15/codediff"
   ```
   - `NEXT_PUBLIC_APP_NAME`: Controls all page HTML titles, branding labels, and workspace headings.
   - `NEXT_PUBLIC_APP_VERSION`: Sets the dynamic version tags inside the headers, sidebar configurations, and release notes.
   - `NEXT_PUBLIC_REPO_URL`: Directs the "GitHub Repository" and "Open Source" buttons in the navigation bar to your repository space.

### Step 5: Launch the Development Server
Execute the Next.js local development script. The server will start and hot-reload changes on save:
```bash
npm run dev
```
By default, the development server binds to port `3000`. Open your browser and navigate to:
```text
http://localhost:3000
```
*Troubleshooting Port Conflicts: If port 3000 is occupied, Next.js will automatically bind to 3001. Check your terminal output for the active listener address.*

### Step 6: Perform Code Quality Checks
Before committing any changes, run the clean development checks to ensure compliance with strict-mode standards:
```bash
npm run lint         # Runs ESLint rules
npm run format       # Formats code via Prettier with Tailwind class sorting
npm run typecheck    # Performs TypeScript static type checks (tsc --noEmit)
```

### Step 7: Build for Production Compilation
Compile the application to generate highly optimized, static, and server-side production bundles:
```bash
npm run build
```
*Production Note: During build compilation, Monaco Editor loaders and Lucide icons are dynamically bundled to keep initial page sizes compact and load times under 220ms.*

### Step 8: Start Production Server
Launch the compiled production bundle locally to verify behavior under actual production parameters:
```bash
npm run start
```

---

## Technical Stack & Symmetrical Versioning

CodeDiff Pro is structured strictly using Next.js App Router architectures and strict types.

| Library / Dependency | Dynamic Version | Technical Utility |
| :--- | :--- | :--- |
| **Next.js (App Router)** | `15.3.3` | App Router framework, layout engines, and dynamic API routing |
| **React** | `19.1.0` | React Server Components, client state trees, and hook lifecycles |
| **TypeScript** | `5.8.3` | Strict-mode compile checks, type interfaces, and system contracts |
| **Tailwind CSS** | `3.4.17` | Symmetrical glassmorphic design tokens and responsive classes |
| **Monaco Editor React** | `4.7.0` | High-fidelity code editing panels, custom themes, and keybindings |
| **Diff** | `8.0.2` | Character, word, line, and structured diff patch algorithms |
| **Zustand** | `5.0.5` | Persisted client-side workspace state and comparison history |
| **Framer Motion** | `12.16.0` | Restrained UI micro-animations and panel transitions |
| **Radix UI** | `2.2.6` / `1.2.6` | Accessible keyboard navigation primitives (Select, Switch, Toast) |
| **Lucide Icons** | `0.511.0` | Consistent, lightweight vector icon assets |

---

## Local Sandbox & Privacy Protocol

### Client-Side Execution Sandbox
All file uploads, text inputs, ignorable difference transformations, and patch processing occur entirely inside your browser's execution sandbox.
- **Zero Raw Data Transfers**: No source code snippets, character metrics, or comparison logs are transmitted to external databases, tracking systems, or cloud nodes.
- **Client-Side Storage**: Preserves custom layout states (like font sizing, word-wrap toggles, and recent comparison cards) using standard local Web Storage APIs (Local Storage).
- **Cookie-Free Experience**: The system does not write tracking cookies or integrate analytical scripts.

---

## License Agreement

This codebase is released under a **Restrictive Open Source License** held exclusively by **Jay Tailor (@jaytailor15)**:
- **Repository Rights**: Cloning or copying this repository is permitted **strictly** for contributing features, performance updates, bug fixes, or security patches back to the official repository via Pull Requests.
- **Cloning Restrictions**: Under no circumstances may any contributor, third-party user, or organization copy, download, or distribute this codebase to host it as a private repository, commercial SaaS wrapper, or proprietary product.
- **Ownership Privilege**: **Jay Tailor** is the single author, founder, and owner of the repository, holding absolute administrative access, licensing control, and distribution rights.

---

## Contribution Commit Guidelines

Please adhere strictly to these commit guidelines to maintain clean Git history and stable builds:

1. **Branch Naming**: Match your branch name to the contribution category:
   - Features: `feature/your-feature-name`
   - Bug Fixes: `bugfix/your-bugfix-name`
   - Refactoring: `refactor/your-refactor-name`
2. **Quality Verification**: Ensure that running `npm run typecheck` and `npm run lint` yields zero diagnostics. PRs that trigger build failures will not be reviewed.
3. **Commit Messages**: Symmetrical, descriptive commit messages are required:
   ```text
   feat: add option to customize tab size inside monaco editor
   fix: adjust font size numeric text box width to resolve flex clipping
   docs: expand keyboard shortcuts reference page with monaco commands
   ```
4. **Pull Requests**: Open your PR targeting the `development` branch. Outline the changes made, validation steps taken, and attach interface screenshots where applicable.

---

## Support & Sponsorship

CodeDiff Pro is **100% free and open-source**. There are no premium paywalls, payment processing hooks, or subscription models built into this application.

If CodeDiff Pro saves you development time, simplifies complex Git code reviews, or enhances your refactoring workflow, sponsorships are welcomed!

### How to Sponsor:
- Visit the GitHub profile of the author and founder: [@jaytailor15](https://github.com/jaytailor15).
- Sponsorship partnerships and support integrations are warmly welcomed. Contact **Jay Tailor** directly in the official repository discussions to collaborate.

---

*Formulated by [Jay Tailor](https://github.com/jaytailor15) (Founder & Maintainer).*
