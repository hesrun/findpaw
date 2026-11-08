import { defineConfig } from 'vitest/config';

// Unit tests for pure logic: schemas, form helpers, mappers. No DOM, no
// network, no database. See "Testing" in docs/development.md.
export default defineConfig({
    resolve: { tsconfigPaths: true },
    test: {
        include: ['src/**/*.test.ts'],
        environment: 'node',
    },
});
