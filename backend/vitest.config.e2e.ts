import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

// SWC emits decorator metadata, which ValidationPipe needs to read DTO types.
export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});
