import { Member } from '../../types';

interface AvatarProps {
  member: Member;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

export const Avatar = ({ member, size = 'md', showTooltip = true }: AvatarProps) => {
  const cls = sizeClasses[size];

  return (
    <div className="relative group/avatar">
      <img
        src={member.photo}
        alt={member.name}
        className={`${cls} rounded-full object-cover ring-2 ring-white dark:ring-gray-800 flex-shrink-0`}
      />
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-[10px] font-medium rounded whitespace-nowrap pointer-events-none opacity-0 group-hover/avatar:opacity-100 transition-opacity z-50">
          {member.name}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
};

interface AvatarStackProps {
  members: Member[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarStack = ({ members, max = 4, size = 'sm' }: AvatarStackProps) => {
  const visible = members.slice(0, max);
  const overflow = members.length - max;

  return (
    <div className="flex -space-x-1.5">
      {visible.map(m => (
        <Avatar key={m.id} member={m} size={size} />
      ))}
      {overflow > 0 && (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium flex-shrink-0`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};
