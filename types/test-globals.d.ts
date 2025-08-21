// Minimal Jest globals to satisfy TypeScript in this repo without installing @types/jest
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const expect: any;
