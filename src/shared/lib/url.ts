// Allows only http(s) links. `new URL()` (and Zod's `.url()`) also accept
// javascript:, data:, and other schemes that are unsafe in an href.
export function isHttpUrl(value: string) {
    return /^https?:\/\//i.test(value);
}
