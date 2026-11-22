import { useState } from 'react';
import { candidateApi } from '../api';
import type { MdToPdfPayload } from '../types';

export function useResumePdfExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const exportPdf = async (markdownContent: string, fileName = 'resume.pdf'): Promise<string | null> => {
    if (!markdownContent.trim()) {
      setError('Markdown content cannot be empty');
      return null;
    }

    setIsExporting(true);
    setError(null);

    try {
      const payload: MdToPdfPayload = {
        content: markdownContent,
        settings: {
          pdf_options: {
            format: 'A4',
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
            printBackground: true,
          },
        },
      };

      const blob = await candidateApi.convertMdToPdf(payload);
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);

      // Trigger automatic file download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return url;
    } catch {
      // In offline/mock mode fallback to client-side text or notification
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const fallbackUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fallbackUrl;
      link.download = fileName.replace(/\.pdf$/, '.md');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return fallbackUrl;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportPdf,
    isExporting,
    error,
    pdfBlobUrl,
  };
}
