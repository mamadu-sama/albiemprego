import { cn } from "@/lib/utils";
import { Category } from "@/data/mockCommunity";

interface CategoryBadgeProps {
  category: Category;
  showCount?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const colorMap: Record<string, string> = {
  'bg-blue-500': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-green-500': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'bg-purple-500': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-orange-500': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'bg-slate-500': 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
  'bg-red-500': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'bg-pink-500': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'bg-gray-500': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
};

export function CategoryBadge({ category, showCount = false, size = 'sm', className }: CategoryBadgeProps) {
  const colorClass = colorMap[category.color] || colorMap['bg-gray-500'];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full transition-colors",
        colorClass,
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      <span>{category.icon}</span>
      <span>{category.name}</span>
      {showCount && (
        <span className="opacity-70">({category.discussionCount})</span>
      )}
    </span>
  );
}
