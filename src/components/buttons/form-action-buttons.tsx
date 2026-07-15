import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { isQtWebChannelReady, openFileWithDialog } from '@/lib/qt-webchannel';
import { csvPresetHandler } from '@/lib/csv-handler';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useSystemStatus } from '@/contexts/SystemStatusContext';
import Link from 'next/link';
import { Separator } from '../ui/separator';

export interface FormActionLabels {
  save: string;
  saving: string;
  uploadCsv: string;
  uploading: string;
  reset: string;
  exportCsv: string;
  useTemplate?: string;
}

interface FormActionButtonsProps {
  isSubmitting: boolean;
  /** Callback receives the parsed key→value map from the preset CSV (header row skipped). */
  onProcessCsvData: (data: Record<string, number>) => void;
  onReset: () => void;
  onExport: () => void;
  dialogTitle: string;
  labels: FormActionLabels;
  idPrefix?: string;
  templateHref?: string;
}

export function FormActionButtons({
  isSubmitting,
  onProcessCsvData,
  onReset,
  onExport,
  dialogTitle,
  labels,
  idPrefix = 'action',
  templateHref,
}: FormActionButtonsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const tCsv = useTranslations('CsvUpload');
  const { isSystemBusy } = useSystemStatus();

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      try {
        onProcessCsvData(csvPresetHandler(text));
      } catch (err) {
        console.error('CSV preset parse error:', err);
        const errorMsg =
          err instanceof Error ? err.message : tCsv('failedToRead');
        toast.error(tCsv('uploadError'), { description: errorMsg });
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleUploadClick = async () => {
    if (isQtWebChannelReady()) {
      setIsUploading(true);
      try {
        const result = await openFileWithDialog(
          dialogTitle,
          'CSV Files (*.csv);;All Files (*)'
        );
        if (result.success && result.content) {
          try {
            onProcessCsvData(csvPresetHandler(result.content));
          } catch (err) {
            console.error('CSV preset parse error:', err);
            const errorMsg =
              err instanceof Error ? err.message : tCsv('failedToRead');
            toast.error(tCsv('uploadError'), { description: errorMsg });
          }
        }
      } finally {
        setIsUploading(false);
      }
    } else {
      csvInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <Button
          id={`${idPrefix}-save-btn`}
          type="submit"
          className="flex-1"
          disabled={isSubmitting || isSystemBusy}
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2" />
              {labels.saving}
            </>
          ) : (
            labels.save
          )}
        </Button>
        <Button
          id={`${idPrefix}-reset-btn`}
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onReset}
          disabled={isSystemBusy}
        >
          {labels.reset}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex-1 relative">
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCsvUpload}
          />
          <Button
            id={`${idPrefix}-upload-btn`}
            type="button"
            variant="default"
            className="w-full"
            disabled={isUploading || isSystemBusy}
            onClick={handleUploadClick}
          >
            {isUploading ? (
              <>
                <Spinner className="mr-2" />
                {labels.uploading}
              </>
            ) : (
              labels.uploadCsv
            )}
          </Button>
        </div>

        <Button
          id={`${idPrefix}-export-btn`}
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onExport}
        >
          {labels.exportCsv}
        </Button>
      </div>
      <Separator />
      {templateHref && (
        <div className="flex flex-col gap-2">
          <p className="text-center body-small-regular">
            {tCsv('templateHint')}
          </p>
          <Button
            id={`${idPrefix}-template-btn`}
            type="button"
            variant="secondary"
            className="w-full"
            asChild
          >
            <Link href={templateHref}>
              {labels.useTemplate || tCsv('useTemplate')}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
