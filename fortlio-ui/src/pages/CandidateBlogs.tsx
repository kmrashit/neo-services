import { useState } from 'react';
import { Search, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  useBlogFeed,
  useBlogDetail,
  BlogFeedList,
  BlogTagFilter,
  BlogDetailView,
  BlogEditorForm,
} from '@/features/blogs';

export default function CandidateBlogs() {
  const {
    blogs,
    isLoading,
    allTags,
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    addLocalBlog,
  } = useBlogFeed();

  const {
    selectedBlog,
    isOpen: isDetailOpen,
    openBlog,
    closeBlog,
  } = useBlogDetail();

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleResetFilters = () => {
    setSelectedTag(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Specialty Blogs & Knowledge Showcase
            </h1>
            <Badge variant="outline" className="gap-1 text-xs">
              <Sparkles className="size-3 text-purple-500" />
              Forti Evaluated
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Publish domain insights and research demonstrating problem-solving judgment, analytical thinking, and learning velocity across any profession.
          </p>
        </div>

        <Button
          onClick={() => setIsEditorOpen(true)}
          className="font-semibold gap-2 shadow-md bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
        >
          <Plus className="size-4" />
          Write New Blog
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles by title, keywords or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full rounded-xl"
          />
        </div>

        {/* Tag pills */}
        <BlogTagFilter
          tags={allTags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />
      </div>

      {/* Articles Feed List */}
      <BlogFeedList
        blogs={blogs}
        isLoading={isLoading}
        onSelectBlog={openBlog}
        onResetFilter={handleResetFilters}
      />

      {/* Blog Article Reader Modal */}
      <BlogDetailView
        blog={selectedBlog}
        isOpen={isDetailOpen}
        onClose={closeBlog}
      />

      {/* Blog Creation & Markdown Publishing Form */}
      <BlogEditorForm
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onPublished={(newBlog) => {
          addLocalBlog(newBlog);
          openBlog(newBlog);
        }}
      />
    </div>
  );
}
