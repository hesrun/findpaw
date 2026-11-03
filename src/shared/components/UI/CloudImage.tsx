'use client';

import { CldImage, type CldImageProps } from 'next-cloudinary';

// next-cloudinary ships without a 'use client' directive, so Server
// Components render CldImage through this wrapper. Cloudinary resizes the
// image and picks the format (AVIF/WebP) and quality for each browser.
export default function CloudImage(props: CldImageProps) {
    return <CldImage {...props} />;
}
