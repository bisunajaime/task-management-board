import { Priority } from '../../types';
import { PRIORITY_CONFIG } from '../../constants';

interface BadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const Badge = ({ priority, size = 'md' }: BadgeProps) => {
  const config = PRIORITY_CONFIG[priority];
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';
  const padding  = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${textSize} ${padding}`}
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
};
