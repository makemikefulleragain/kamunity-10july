import React from 'react';
import { trackClick } from '@/utils/analytics';

interface ClickTrackerProps {
  elementType: string;
  elementName: string;
  children: React.ReactNode;
  className?: string;
  additionalData?: Record<string, any>;
  onClick?: () => void;
  trackOnMount?: boolean;
}

const ClickTracker: React.FC<ClickTrackerProps> = ({
  elementType,
  elementName,
  children,
  className,
  additionalData,
  onClick,
  trackOnMount = false,
}) => {
  React.useEffect(() => {
    if (trackOnMount) {
      trackClick(elementType, `${elementName}_viewed`, {
        ...additionalData,
        event_type: 'view',
      });
    }
  }, [elementType, elementName, additionalData, trackOnMount]);

  const handleClick = () => {
    trackClick(elementType, elementName, additionalData);
    onClick?.();
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};

export default ClickTracker; 