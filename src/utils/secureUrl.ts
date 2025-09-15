// Utility to ensure all URLs use HTTPS
export const ensureHttps = (url: string): string => {
  if (!url) return url;
  
  // If it's already a full URL, ensure it uses HTTPS
  if (/^https?:\/\//i.test(url)) {
    return url.replace(/^http:\/\//i, 'https://');
  }
  
  // If it's a relative path, it will be resolved by the browser
  // and will inherit the protocol from the current page (HTTPS)
  return url;
};

// Utility to build secure URLs for static assets
export const buildSecureAssetUrl = (path: string): string => {
  if (!path) return path;
  
  // If it's already a full URL, ensure HTTPS
  if (/^https?:\/\//i.test(path)) {
    return path.replace(/^http:\/\//i, 'https://');
  }
  
  // For relative paths, ensure they start with /
  if (!path.startsWith('/')) {
    return `/${path}`;
  }
  
  return path;
};
