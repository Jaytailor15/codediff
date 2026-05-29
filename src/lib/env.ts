import packageJson from "../../package.json";

export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "CodeDiff Pro",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? packageJson.version,
  repoUrl: process.env.NEXT_PUBLIC_REPO_URL ?? "https://github.com/jaytailor15/codediff"
} as const;
