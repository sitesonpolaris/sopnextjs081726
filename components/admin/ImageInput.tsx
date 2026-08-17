'use client';

import { useState } from 'react';
import { Upload, Link as LinkIcon, X, Loader as Loader2, Check } from 'lucide-react';
import { uploadFile } from '@/lib/admin-data';

interface ImageInputProps {
  onImageChange: (url: string) => void;
  currentUrl?: string;
  maxSize?: number;
  folder: string;
  placeholder?: string;
}

export default function ImageInput({
  onImageChange,
  currentUrl = '',
  maxSize = 10,
  folder,
  placeholder = 'Upload image or enter URL',
}: ImageInputProps) {
  const [url, setUrl] = useState(currentUrl);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const uploadedUrl = await uploadFile(file, folder);
      setUrl(uploadedUrl);
      onImageChange(uploadedUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    onImageChange(value);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'upload'
              ? 'bg-fahrenheit text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'url'
              ? 'bg-fahrenheit text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          URL
        </button>
      </div>

      {mode === 'upload' ? (
        <label className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors cursor-pointer w-fit">
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
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      ) : (
        <input
          type="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="https://example.com/image.jpg"
        />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {url && (
        <div className="relative w-full max-w-xs rounded-lg overflow-hidden border border-border">
          <img src={url} alt="Preview" className="w-full h-32 object-cover" />
          <button
            type="button"
            onClick={() => {
              setUrl('');
              onImageChange('');
            }}
            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
            <Check className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
}
