import { useState } from 'react';
import type { IBlog } from '../types';

export function useBlogDetail(initialBlog?: IBlog | null) {
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(initialBlog || null);
  const [isOpen, setIsOpen] = useState(false);

  const openBlog = (blog: IBlog) => {
    setSelectedBlog(blog);
    setIsOpen(true);
  };

  const closeBlog = () => {
    setIsOpen(false);
    setSelectedBlog(null);
  };

  return {
    selectedBlog,
    isOpen,
    openBlog,
    closeBlog,
  };
}
