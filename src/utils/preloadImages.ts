// Utility for preloading critical images
export const preloadImages = (imageUrls: string[]): Promise<void[]> => {
  return Promise.all(
    imageUrls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    })
  );
};

// Preload critical images after initial page load
export const preloadCriticalImages = () => {
  // Preload fallback images that are likely to be used
  const criticalImages = [
    '/images/production/1.webp',
    '/images/production/2.webp', 
    '/images/production/logo.png' // fallback for products
  ];
  
  // Preload after a short delay to not block initial render
  setTimeout(() => {
    preloadImages(criticalImages).catch(console.warn);
  }, 100);
};
