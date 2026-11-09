import { describe, expect, it } from 'vitest';
import { isHttpUrl, mailtoHref } from './url';

describe('isHttpUrl', () => {
    it('accepts http and https', () => {
        expect(isHttpUrl('https://findpaw.cz')).toBe(true);
        expect(isHttpUrl('HTTP://findpaw.cz')).toBe(true);
    });

    it('rejects other schemes', () => {
        expect(isHttpUrl('javascript:alert(1)')).toBe(false);
        expect(isHttpUrl('data:text/html,x')).toBe(false);
    });
});

describe('mailtoHref', () => {
    it('encodes the subject and body', () => {
        expect(
            mailtoHref('info@findpaw.cz', {
                subject: 'Report: a & b',
                body: 'Line 1\nLine 2',
            }),
        ).toBe(
            'mailto:info@findpaw.cz?subject=Report%3A%20a%20%26%20b&body=Line%201%0ALine%202',
        );
    });
});
