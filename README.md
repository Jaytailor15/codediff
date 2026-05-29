# <img src="./public/favicon.svg" width="38" height="38" align="center" style="vertical-align: middle; margin-right: 8px;" /> CodeDiff Pro

[![Open Source](https://img.shields.io/badge/Open%20Source-Cohesive-115e59?style=for-the-badge&logo=github)](https://github.com/jaytailor15/codediff)
[![License: Restrictive OS](https://img.shields.io/badge/License-Restrictive%20OS-115e59?style=for-the-badge)](file:///Users/pritugvcl/Documents/codediff/README.md#license-agreement)
[![Privacy Policy: Local Sandbox](https://img.shields.io/badge/Privacy-100%25%20Local%20Sandbox-115e59?style=for-the-badge)](file:///Users/pritugvcl/Documents/codediff/README.md#privacy-policy)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-4.7.0-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://github.com/suren-atoyan/monaco-react)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.5-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.16.0-black?style=for-the-badge&logo=framer&logoColor=FF007F)](https://www.framer.com/motion/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-2.2.6-black?style=for-the-badge&logo=radix-ui&logoColor=white)](https://www.radix-ui.com)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Redis Sharing](https://img.shields.io/badge/Redis-Global%20Sharing-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![Google Translate](https://img.shields.io/badge/Google_Translate-Dynamic_Localization-4285F4?style=for-the-badge&logo=googletranslate&logoColor=white)](https://translate.google.com)

CodeDiff Pro is a production-ready, high-fidelity developer workspace built for rapid side-by-side (split) and unified (inline) code comparison. Engineered with complete client-side sandboxing, dynamic Monaco Editor sizing, and theme-reactive aesthetics, CodeDiff Pro ensures your proprietary code is parsed safely, symmetrically, and efficiently entirely inside your browser environment.

---

## Symmetrical Brand Identity & Logo Philosophy

The brand identity and favicon represent the core visual mechanics of code differences:
- **Emerald Green Check Mark (`#10b981`)**: Represents successful code additions and clean insertions. It begins with a vertical top-left entry, sweeping downwards before ascending diagonally.
- **Vibrant Red Reverse Check Mark (`#ef4444`)**: Represents code deletions and clean removals. It begins with a diagonal descent and transitions into a clean vertical exit.
- **Centered Outline Circle (`#e2e8f0`)**: Positioned at the precise geometric center `(32, 32)` with an overlapping radius of `8`, it represents unified cohesion. A transparent interior ensures the parallel green and red line paths pass continuously and visibly through the circle, reflecting complete transparency and local execution.

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
Branding, repository paths, and global sharing credentials are controlled via standard environment variables.
1. Duplicate the `.env.example` file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and verify/adjust the parameters:
   ```env
   NEXT_PUBLIC_APP_NAME="CodeDiff Pro"
   NEXT_PUBLIC_APP_VERSION="1.4.3"
   NEXT_PUBLIC_REPO_URL="https://github.com/jaytailor15/codediff"
   REDIS_URL="redis://default:k87Fz3tHxwPesB1f1VVGmiykUz5ff9u4@yarn-salt-day-86323.db.redis.io:12001"
   ```
3. Parameters:
   - `NEXT_PUBLIC_APP_NAME`: Controls all page HTML titles, branding labels, and workspace headings.
   - `NEXT_PUBLIC_APP_VERSION`: Sets the dynamic version tags inside the headers, sidebar configurations, and release notes.
   - `NEXT_PUBLIC_REPO_URL`: Directs the "GitHub Repository" and "Open Source" buttons in the navigation bar to your repository space.
   - `REDIS_URL`: The connection string for your global Redis database, used to store comparison payloads and generate secure, shortened 16-character sharing links across different PCs.

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

| Library / Dependency | Visual Badge / Tag | Dynamic Version | Technical Utility |
| :--- | :--- | :--- | :--- |
| **Next.js (App Router)** | ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=nextdotjs&logoColor=white) | `15.3.3` | App Router framework, layout engines, and dynamic API routing |
| **React** | ![React](https://img.shields.io/badge/React-blue?style=flat-square&logo=react&logoColor=white) | `19.1.0` | React Server Components, client state trees, and hook lifecycles |
| **TypeScript** | ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript&logoColor=white) | `5.8.3` | Strict-mode compile checks, type interfaces, and system contracts |
| **Tailwind CSS** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white) | `3.4.17` | Symmetrical glassmorphic design tokens and responsive classes |
| **Monaco Editor React** | ![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white) | `4.7.0` | High-fidelity code editing panels, custom themes, and keybindings |
| **Diff** | ![Diff](https://img.shields.io/badge/Diff-grey?style=flat-square) | `8.0.2` | Character, word, line, and structured diff patch algorithms |
| **Zustand** | ![Zustand](https://img.shields.io/badge/Zustand-orange?style=flat-square) | `5.0.5` | Persisted client-side workspace state and comparison history |
| **Framer Motion** | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat-square&logo=framer&logoColor=white) | `12.16.0` | Restrained UI micro-animations and panel transitions |
| **Radix UI** | ![Radix UI](https://img.shields.io/badge/Radix_UI-black?style=flat-square&logo=radix-ui&logoColor=white) | `2.2.6` / `1.2.6` | Accessible keyboard navigation primitives (Select, Switch, Toast) |
| **Lucide Icons** | ![Lucide](https://img.shields.io/badge/Lucide-black?style=flat-square&logo=feather&logoColor=white) | `0.511.0` | Consistent, lightweight vector icon assets |
| **Redis Client** | ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) | `^4.7.0` | High-performance database client for cross-device shared link lookups |
| **Google Translate** | ![Google Translate](https://img.shields.io/badge/Google_Translate-4285F4?style=flat-square&logo=googletranslate&logoColor=white) | `Dynamic Engine` | Invisible client-side translation loader supporting 50+ Indian and foreign languages |
| **Vercel** | ![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel&logoColor=white) | `Cloud Hosting` | Secure serverless edge hosting and continuous Git deployment pipelines |

---

## Local Sandbox & Privacy Protocol

### Client-Side Execution Sandbox
All file uploads, text inputs, ignorable difference transformations, and patch processing occur entirely inside your browser's execution sandbox.
- **Zero Raw Data Transfers**: No source code snippets, character metrics, or comparison logs are transmitted to external databases, tracking systems, or cloud nodes unless you explicitly choose to create a shortened sharing link.
- **Client-Side Storage**: Preserves custom layout states (like font sizing, word-wrap toggles, and recent comparison cards) using standard local Web Storage APIs (Local Storage).
- **Cookie-Free Experience**: The system does not write tracking cookies or integrate analytical scripts.

### Secure Database Sharing Protocol
When you click **Share**, CodeDiff Pro allows you to optionally save your comparison workspace to a secure cloud database to generate an ultra-short 16-character link:
- **16-Character Cryptographic Slugs**: Comparison payloads are stored in the global Redis database and indexed under cryptographically random, 16-character slugs (`crypto.randomBytes`) to prevent key guessing or enumeration.
- **UTF-8 LZW Compression**: Workspace contents are compressed using a robust, custom LZW byte encoder before transmission to minimize database storage footprints and maximize transmission speeds.
- **30-Day Auto-Expiration (TTL)**: To respect resources and protect data lifecycles, all shared database records are configured with an automatic 30-day expiration (`EX: 2592000` seconds).
- **Offline Fallback**: If the cloud database is ever offline, the share action gracefully degrades to generating a direct LZW client-compressed query link, ensuring link sharing is always fully functional.

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
