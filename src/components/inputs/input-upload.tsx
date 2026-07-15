"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useRef, useEffect } from "react";
import { Upload, File, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { InputUploadProps } from "../../types/input-types";
import { isQtWebChannelReady, openFileWithDialog } from "@/lib/qt-webchannel";
import { csvUploadHandler } from "@/lib/csv-handler";
import type { ControllerRenderProps } from "react-hook-form";
import { useTranslations } from "next-intl";

interface UploadContentProps {
  label?: string;
  requiredColumns: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  onFileLoad?: (filePath: string, data: number[][]) => void;
}

function UploadContent({
  label,
  requiredColumns,
  field,
  onFileLoad,
}: UploadContentProps) {
  const t = useTranslations("CsvUpload");
  const [fileName, setFileName] = useState<string>(t("noFileSelected"));
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore display state from the persisted form field value
  useEffect(() => {
    if (field.value && field.value.trim() !== "") {
      setFileName(field.value);
      setIsLoaded(true);
    }
  }, [field.value]);

  const handleQtFileOpen = async () => {
    const dialogTitle = label ? t("selectCsvFile", { label }) : t("selectCsvFileFallback");
    const result = await openFileWithDialog(
      dialogTitle,
      "CSV Files (*.csv);;All Files (*)",
    );
    if (!result.success || !result.content) {
      if (result.error !== "User cancelled file dialog") {
        toast.error(t("uploadError"), { description: result.error });
      }
      return;
    }
    try {
      const data = csvUploadHandler(result.content, requiredColumns);
      if (data.length === 0) throw new Error(t("noValidData"));
      const name = result.filename ?? "file.csv";
      setFileName(name);
      setIsLoaded(true);
      setError(null);
      field.onChange(name);
      onFileLoad?.(name, data);
      toast.success(t("fileLoaded"), {
        description: t("rowsLoaded", { count: data.length, filename: name }),
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : t("failedToRead");
      setError(errorMsg);
      setFileName(t("failedToLoadFile"));
      setIsLoaded(false);
      field.onChange("");
      toast.error(t("uploadError"), { description: errorMsg });
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      const errorMsg = t("selectCsv");
      setError(errorMsg);
      setFileName(t("invalidFileType"));
      toast.error(t("uploadError"), { description: errorMsg });
      return;
    }

    try {
      const text = await file.text();
      const data = csvUploadHandler(text, requiredColumns);

      if (data.length === 0) {
        throw new Error(t("noValidData"));
      }

      setFileName(file.name);
      setIsLoaded(true);
      setError(null);
      field.onChange(file.name);
      onFileLoad?.(file.name, data);

      toast.success(t("fileLoaded"), {
        description: t("rowsLoaded", { count: data.length, filename: file.name }),
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : t("failedToRead");
      setError(errorMsg);
      setFileName(t("failedToLoadFile"));
      setIsLoaded(false);
      field.onChange("");
      toast.error(t("uploadError"), { description: errorMsg });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={(e) => {
          if (isQtWebChannelReady()) {
            e.preventDefault();
            handleQtFileOpen();
          } else {
            fileInputRef.current?.click();
          }
        }}
        className="flex items-center gap-2"
      >
        <Upload size={16} />
        {t("chooseCsvFile")}
      </Button>

      <div className="flex items-center gap-2 flex-1">
        {isLoaded ? (
          <File size={16} className="text-green-600" />
        ) : error ? (
          <AlertCircle size={16} className="text-red-600" />
        ) : (
          <File size={16} className="text-gray-400" />
        )}

        <span
          className={`text-sm ${
            isLoaded
              ? "text-gray-700"
              : error
                ? "text-red-600"
                : "text-gray-500"
          }`}
        >
          {fileName}
        </span>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}

export function InputUpload({
  label,
  showLabel = true,
  name,
  requiredColumns = 0,
  control,
  onFileLoad,
}: InputUploadProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full" id={`upload-${name}`}>
          {showLabel && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <UploadContent
              label={label}
              requiredColumns={requiredColumns}
              field={field}
              onFileLoad={onFileLoad}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
