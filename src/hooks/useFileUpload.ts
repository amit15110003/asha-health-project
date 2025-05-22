"use client";
import { useRef, useCallback } from "react";
import { validateAudioFile } from "../utils/audioValidation";

interface UseFileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
  onError: (error: string) => void;
}

export const useFileUpload = ({
  onFileUpload,
  onError,
}: UseFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = useCallback(
    async (file: File): Promise<void> => {
      const validationError = validateAudioFile(file);
      if (validationError) {
        onError(validationError);
        return;
      }

      await onFileUpload(file);
    },
    [onFileUpload, onError]
  );

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const triggerFileInput = useCallback((): void => {
    fileInputRef.current?.click();
  }, []);

  const clearFileInput = useCallback((): void => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return {
    fileInputRef,
    handleFileInputChange,
    handleDrop,
    triggerFileInput,
    clearFileInput,
  };
};
