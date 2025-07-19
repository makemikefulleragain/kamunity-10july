import React from 'react';
import { motion } from 'framer-motion';
import { TimeFilter, ToneFilter } from '@/types';

interface ContentFiltersProps {
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
  perspectiveFilter: ToneFilter | 'all';
  onPerspectiveFilterChange: (perspective: ToneFilter | 'all') => void;
  filteredContentCount?: number;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({
  timeFilter,
  onTimeFilterChange,
  perspectiveFilter,
  onPerspectiveFilterChange,
  filteredContentCount = 0
}) => {
  const timeFilters: { value: TimeFilter; label: string }[] = [
    { value: 'TODAY', label: 'TODAY' },
    { value: 'LAST WEEK', label: 'LAST WEEK' },
    { value: 'LAST MONTH', label: 'LAST MONTH' },
    { value: 'LAST YEAR', label: 'LAST YEAR' }
  ];

  const contentTabs: { value: ToneFilter; label: string; color: string }[] = [
    { value: 'FUN', label: 'FUN', color: 'bg-green-500' },
    { value: 'FACTUAL', label: 'FACTUAL', color: 'bg-indigo-600' },
    { value: 'UNUSUAL', label: 'UNUSUAL', color: 'bg-purple-500' },
    { value: 'CURIOUS', label: 'CURIOUS', color: 'bg-orange-500' },
    { value: 'SPICY', label: 'SPICY', color: 'bg-red-500' },
    { value: 'NICE', label: 'NICE', color: 'bg-pink-500' }
  ];

  const handleTabChange = (tab: ToneFilter) => {
    onPerspectiveFilterChange(tab);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl lg:rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 mx-auto max-w-ultra"
    >
      <div className="space-y-fluid-6">
        {/* Title Section */}
        <div className="text-center lg:text-left">
          <h1 className="text-fluid-2xl lg:text-fluid-4xl xl:text-fluid-5xl font-bold text-indigo-700 leading-tight">
            Kai's Kamunity Newsfeed
          </h1>
        </div>
        
        {/* Filters Section */}
        <div className="space-y-fluid-4">
          {/* Time Filter Tabs */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {timeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => onTimeFilterChange(filter.value)}
                className={`px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-fluid-xs lg:text-fluid-sm font-medium transition-colors touch-manipulation ${
                  timeFilter === filter.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Content Type Tabs */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {contentTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-fluid-xs lg:text-fluid-sm font-medium whitespace-nowrap transition-colors touch-manipulation ${
                  perspectiveFilter === tab.value
                    ? `${tab.color} text-white`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentFilters; 