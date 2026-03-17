import React from 'react';
import { Actions } from '../../store/actions';
import { useStateValue } from '../../store/AppDataProvider';

interface FilterBarProps {
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

export const FilterBar = ({ searchInputRef, showFilters, onToggleFilters }: FilterBarProps) => {
  const [{ filter }, dispatcher] = useStateValue();

  const setSearch = (search: string) =>
    dispatcher({ type: Actions.SET_FILTER, payload: { search } });

  const hasActiveFilters = filter.priority !== 'All' || filter.assigneeId !== null;

  return (
    <div className="flex items-center gap-2 px-6 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex-shrink-0">
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
        <input
          ref={searchInputRef}
          value={filter.search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tasks… (/)"
          className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
        />
      </div>

      {/* Filter toggle */}
      {onToggleFilters && (
        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex-shrink-0 ${
            showFilters
              ? 'border-accent bg-accent/5 text-accent'
              : hasActiveFilters
              ? 'border-accent bg-accent/5 text-accent'
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <FilterIcon />
          Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
          )}
        </button>
      )}
    </div>
  );
};

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const FilterIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </svg>
);
