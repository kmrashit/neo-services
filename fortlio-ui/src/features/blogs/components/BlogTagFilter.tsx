import { Button } from '@/components/ui/button';

interface BlogTagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export function BlogTagFilter({ tags, selectedTag, onSelectTag }: BlogTagFilterProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
      <Button
        size="sm"
        variant={selectedTag === null ? 'default' : 'outline'}
        className="text-xs h-9 rounded-lg"
        onClick={() => onSelectTag(null)}
      >
        All Topics
      </Button>
      {tags.map((tag) => (
        <Button
          key={tag}
          size="sm"
          variant={selectedTag === tag ? 'default' : 'outline'}
          className="text-xs h-9 rounded-lg shrink-0"
          onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
        >
          #{tag}
        </Button>
      ))}
    </div>
  );
}
