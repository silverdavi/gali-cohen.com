declare module '*.yaml' {
  const data: unknown;
  export default data;
}

// Injected at build time by vite.config.ts (define).
declare const __BUILD_ID__: string;
