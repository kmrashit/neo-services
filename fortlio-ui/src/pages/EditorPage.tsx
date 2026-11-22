import { useSearchParams, useNavigate } from 'react-router-dom';
import { UnifiedMarkdownEditor } from '@/features/editor';
import { useResumePdfExport } from '@/features/candidate/hooks/useResumePdfExport';
import { useCreateBlog } from '@/features/blogs/hooks/useCreateBlog';

export default function EditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const modeParam = searchParams.get('mode');
  const initialMode = modeParam === 'blog' ? 'blog' : 'resume';
  const initialOpenDraw = modeParam === 'draw';

  const { exportPdf } = useResumePdfExport();
  const { publishBlog } = useCreateBlog();

  const handleExportPdf = async (markdown: string) => {
    await exportPdf(markdown, 'Resume.pdf');
  };

  const handlePublishBlog = async (data: { title: string; content: string; tags: string[] }) => {
    await publishBlog(data);
    navigate('/candidate-blogs');
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedMarkdownEditor
        initialMode={initialMode}
        initialOpenDraw={initialOpenDraw}
        onExportPdf={handleExportPdf}
        onPublishBlog={handlePublishBlog}
      />
    </div>
  );
}
