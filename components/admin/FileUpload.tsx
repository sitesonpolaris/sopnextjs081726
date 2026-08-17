'use client';

import { useState } from 'react';
import { Upload, Link as LinkIcon, X, Loader as Loader2, Check } from 'lucide-react';
import { uploadFile } from '@/lib/admin-data';

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number;
  folder: string;
  placeholder?: string;
  currentUrl?: string;
}

export default function FileUpload({
  onUpload,
  accept = 'image/*',
  maxSize = 10,
  folder,
  placeholder = 'Upload file',
  currentUrl = '',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(currentUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be under ${maxSize}MB`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const url = await uploadFile(file, folder);
      setPreview(url);
      onUpload(url);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 px-4 py-2.5 bg-fahrenheit text-white rounded-lg font-medium hover:bg-fahrenheit/90 transition-colors cursor-pointer">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {placeholder}
            </>
          )}
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {preview && (
          <button
            onClick={() => {
              setPreview('');
              onUpload('');
            }}
            className="flex items-center gap-1 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            Remove
          </button>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {preview && accept.includes('image') && (
        <div className="relative w-full max-w-xs rounded-lg overflow-hidden border border-border">
          <img src={preview} alt="Preview" className="w-full h-32 object-cover" />
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
            <Check className="w-3 h-3" />
          </div>
        </div>
      )}

      {preview && !accept.includes('image') && (
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <LinkIcon className="w-3 h-3" />
          File uploaded
        </p>
      )}
    </div>
  );
}
