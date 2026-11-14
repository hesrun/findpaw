import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { routing } from './routing';

const MESSAGES_DIR = path.resolve(__dirname, '../../messages');

function read(file: string): unknown {
    return JSON.parse(readFileSync(path.join(MESSAGES_DIR, file), 'utf8'));
}

// Dotted key paths. An array (legal sections and paragraphs) counts as one
// leaf: its length may differ when a translation splits sentences differently.
function keyPaths(value: unknown, prefix = ''): string[] {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        return [prefix];
    }
    return Object.entries(value).flatMap(([key, child]) =>
        keyPaths(child, prefix ? `${prefix}.${key}` : key),
    );
}

describe.each(['', 'legal/'])('messages/%s*.json', (dir) => {
    const reference = keyPaths(read(`${dir}${routing.defaultLocale}.json`));

    it.each(routing.locales)(
        '%s has the same keys as the default locale',
        (locale) => {
            expect(keyPaths(read(`${dir}${locale}.json`))).toEqual(reference);
        },
    );
});
