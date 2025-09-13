// Utility for scrolling to sections with lazy loading support
export const scrollToSection = (sectionId: string, maxAttempts: number = 50): Promise<void> => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const tryScroll = () => {
      attempts++;
      const element = document.getElementById(sectionId);
      
      if (element) {
        // Check if element is fully loaded (has content)
        const hasContent = element.children.length > 0 || (element.textContent?.trim().length ?? 0) > 0;
        
        if (hasContent) {
          // Add offset for header height on desktop
          const headerHeight = window.innerWidth > 768 ? 80 : 0;
          const elementTop = element.offsetTop - headerHeight;
          
          window.scrollTo({
            top: elementTop,
            behavior: 'smooth'
          });
          resolve();
          return;
        }
      }
      
      if (attempts >= maxAttempts) {
        console.warn(`Failed to find section ${sectionId} after ${maxAttempts} attempts`);
        reject(new Error(`Section ${sectionId} not found`));
        return;
      }
      
      // Try again after a short delay
      setTimeout(tryScroll, 200);
    };
    
    tryScroll();
  });
};

// Enhanced scroll function for navigation from other pages
export const scrollToSectionFromOtherPage = (sectionId: string): void => {
  // Wait for page to load and components to render
  setTimeout(() => {
    scrollToSection(sectionId).catch(() => {
      // Fallback: try one more time after a longer delay
      setTimeout(() => {
        scrollToSection(sectionId).catch((error) => {
          console.warn(`Failed to scroll to section ${sectionId}:`, error);
        });
      }, 2000);
    });
  }, 1500);
};
