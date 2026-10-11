/**
 * Utility to resolve asset URLs correctly across localhost, subpaths, and GitHub Pages.
 */
export function resolveAsset(path: string | undefined): string {
  if (!path) return '';
  // Remote URLs or data URLs require no transformation
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Normalize path removing /src/ prefix if present
  let cleanPath = path;
  if (cleanPath.startsWith('/src/')) {
    cleanPath = cleanPath.replace(/^\/src\//, '');
  } else if (cleanPath.startsWith('src/')) {
    cleanPath = cleanPath.replace(/^src\//, '');
  } else if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.replace(/^\//, '');
  }

  const base = import.meta.env.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${cleanPath}`;
}
