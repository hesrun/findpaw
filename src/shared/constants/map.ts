// Mapy.com (Seznam) map tiles and geocoding. The key is public by design:
// tiles are requested by the browser. Restrict it by HTTP referrer in the
// Mapy.com developer console.
export const MAPY_API_KEY = process.env.NEXT_PUBLIC_MAPY_API_KEY ?? '';

export const MAPY_API_URL = 'https://api.mapy.com/v1';
export const MAPY_TILE_URL = `${MAPY_API_URL}/maptiles/basic/256/{z}/{x}/{y}`;
export const MAPY_LOGO_URL = 'https://api.mapy.com/img/api/logo.svg';
export const MAPY_HOME_URL = 'https://mapy.com/';
// Mapy.com terms require this attribution and the logo on every map.
export const MAPY_ATTRIBUTION =
    '<a href="https://api.mapy.com/copyright" target="_blank" rel="noopener noreferrer">&copy; Seznam.cz a.s. a další</a>';

// Whole Czech Republic in view when nothing is selected yet.
export const MAP_DEFAULT_CENTER: [number, number] = [49.8, 15.5];
export const MAP_DEFAULT_ZOOM = 7;
export const MAP_MAX_ZOOM = 19;
