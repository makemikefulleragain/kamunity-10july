import React from 'react';
import { trackScrollDepth } from './analytics';

class ScrollTracker {
  private tracked: Set<number> = new Set();
  private pageName: string;
  private isTracking = false;

  constructor(pageName: string) {
    this.pageName = pageName;
  }

  start() {
    if (this.isTracking || typeof window === 'undefined') return;
    
    this.isTracking = true;
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('beforeunload', this.cleanup);
  }

  stop() {
    if (!this.isTracking) return;
    
    this.isTracking = false;
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('beforeunload', this.cleanup);
  }

  private handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    
    const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
    
    // Track at 25%, 50%, 75%, and 100% milestones
    const milestones = [25, 50, 75, 100];
    
    for (const milestone of milestones) {
      if (scrollPercentage >= milestone && !this.tracked.has(milestone)) {
        this.tracked.add(milestone);
        trackScrollDepth(milestone, this.pageName);
      }
    }
  };

  private cleanup = () => {
    this.stop();
  };
}

// Hook for easy use in React components
export const useScrollTracking = (pageName: string) => {
  const scrollTracker = React.useMemo(() => new ScrollTracker(pageName), [pageName]);
  
  React.useEffect(() => {
    scrollTracker.start();
    return () => scrollTracker.stop();
  }, [scrollTracker]);
};

// For use in pages without hooks
export { ScrollTracker }; 