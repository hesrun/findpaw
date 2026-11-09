// Allows only http(s) links. `new URL()` (and Zod's `.url()`) also accept
// javascript:, data:, and other schemes that are unsafe in an href.
export function isHttpUrl(value: string) {
    return /^https?:\/\//i.test(value);
}

// mailto: link with a prefilled subject and body. encodeURIComponent, not
// URLSearchParams: mail clients show the "+" it uses for spaces literally.
export function mailtoHref(
    email: string,
    { subject, body }: { subject: string; body: string },
) {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
