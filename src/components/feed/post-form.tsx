'use client';

import { useState } from 'react';
import { X, Image as ImageIcon, Lock, Globe, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PostType = 'genel' | 'guvenlik' | 'oneri' | 'kayipbuluntu' | 'satilik';
export type Visibility = 'public' | 'private';

export interface PostFormProps {
  authorAvatar: string;
  authorName: string;
  onSubmit?: (data: PostFormData) => void;
  onCancel?: () => void;
  isOpen?: boolean;
}

export interface PostFormData {
  type: PostType;
  title: string;
  body: string;
  visibility: Visibility;
  mediaUrl?: string;
}

const postTypes: Array<{ value: PostType; label: string }> = [
  { value: 'genel', label: 'Genel' },
  { value: 'guvenlik', label: 'Güvenlik' },
  { value: 'oneri', label: 'Öneri' },
  { value: 'kayipbuluntu', label: 'Kayıp/Buluntu' },
  { value: 'satilik', label: 'Satılık' },
];

export function PostForm({
  authorAvatar,
  authorName,
  onSubmit,
  onCancel,
  isOpen = true,
}: PostFormProps) {
  const [type, setType] = useState<PostType>('genel');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setIsLoading(true);
    try {
      onSubmit?.({
        type,
        title,
        body,
        visibility,
        mediaUrl: mediaUrl || undefined,
      });

      // Reset form
      setTitle('');
      setBody('');
      setType('genel');
      setVisibility('public');
      setMediaUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-surface rounded-lg shadow-md border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={authorAvatar}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900">{authorName}</p>
          <p className="text-xs text-gray-500">Yeni bir gönderi oluştur</p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Post Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gönderi Türü
          </label>
          <div className="flex flex-wrap gap-2">
            {postTypes.map((pt) => (
              <button
                key={pt.value}
                type="button"
                onClick={() => setType(pt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  type === pt.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Başlık
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Başlığınızı girin"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {/* Body Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Düşüncelerinizi paylaşın..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
          />
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medya
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
            <ImageIcon size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Fotoğraf veya video eklemek için tıklayın
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Veya dosyayı buraya sürükleyin
            </p>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  // In a real app, upload the file and get the URL
                  setMediaUrl(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
          </div>
          {mediaUrl && (
            <div className="mt-2 relative inline-block">
              <img
                src={mediaUrl}
                alt="Preview"
                className="h-32 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => setMediaUrl('')}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Visibility Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Görünürlük
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setVisibility('public')}
              className={cn(
                'flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border transition-colors',
                visibility === 'public'
                  ? 'border-primary bg-primary-light'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <Globe size={16} />
              <span className="text-sm font-medium">Herkese Açık</span>
            </button>
            <button
              type="button"
              onClick={() => setVisibility('private')}
              className={cn(
                'flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border transition-colors',
                visibility === 'private'
                  ? 'border-primary bg-primary-light'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <Lock size={16} />
              <span className="text-sm font-medium">Sadece Komşular</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !title.trim() || !body.trim()}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send size={18} />
            <span>{isLoading ? 'Gönderiliyor...' : 'Gönder'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
