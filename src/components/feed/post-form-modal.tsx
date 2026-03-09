'use client';

import { useState, useRef } from 'react';
import { X, Send, ImagePlus, MapPin, Globe, BarChart3, Shield, HelpCircle, Tag, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const POST_TYPES = [
  { id: 'general', label: 'Genel', icon: Tag },
  { id: 'security', label: 'Güvenlik', icon: Shield },
  { id: 'recommendation', label: 'Öneri', icon: HelpCircle },
  { id: 'lost-found', label: 'Kayıp/Buluntu', icon: Tag },
  { id: 'poll', label: 'Anket', icon: BarChart3 },
];

const VISIBILITY_OPTIONS = [
  { id: 'neighborhood', label: 'Mahalle' },
  { id: 'nearby', label: 'Yakın Mahalleler' },
  { id: 'city', label: 'Şehir' },
];

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: any) => void;
}

export function PostFormModal({ isOpen, onClose, onSubmit }: PostFormModalProps) {
  const [postType, setPostType] = useState('general');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [visibility, setVisibility] = useState('neighborhood');
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const handleRemovePollOption = (index: number) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleAddLocation = () => {
    setLocation('Kadıköy, Moda');
  };

  const handleRemoveLocation = () => {
    setLocation(null);
  };

  const handleSubmit = () => {
    if (!body.trim()) {
      alert('Lütfen gönderi içeriği yazınız');
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      type: postType,
      title: title.trim() || undefined,
      body: body.trim(),
      visibility,
      images,
      location,
      poll:
        postType === 'poll' && pollQuestion.trim()
          ? {
              question: pollQuestion.trim(),
              options: pollOptions.filter((opt) => opt.trim()),
            }
          : undefined,
      author: { name: 'Siz', initial: 'S', neighborhood: 'Kadıköy, Moda', profileId: 'you' },
      timeAgo: 'Az önce',
      reactions: 0,
      comments: 0,
    };

    onSubmit(newPost);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setPostType('general');
    setTitle('');
    setBody('');
    setVisibility('neighborhood');
    setShowVisibilityMenu(false);
    setImages([]);
    setLocation(null);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-[600px] max-h-[90vh] flex flex-col mx-4 animate-in fade-in scale-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#e0e0e0]">
          <h2 className="text-lg font-bold text-[#333]">Gönderi Oluştur</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-[#f0f2f5] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#8f8f8f]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Post Type Selector */}
          <div>
            <p className="text-xs font-semibold text-[#8f8f8f] mb-2">GÖNDERİ TİPİ</p>
            <div className="flex gap-2 flex-wrap">
              {POST_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setPostType(type.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors border',
                      postType === type.id
                        ? 'bg-[#00833e] text-white border-[#00833e]'
                        : 'bg-white text-[#333] border-[#e0e0e0] hover:border-[#00833e] hover:text-[#00833e]'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-3 p-3 bg-[#f0f2f5] rounded-lg">
            <div className="w-10 h-10 bg-[#404040] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              S
            </div>
            <div>
              <p className="text-sm font-bold text-[#333]">Siz</p>
              <p className="text-xs text-[#8f8f8f]">Kadıköy, Moda</p>
            </div>
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Başlık ekleyin (isteğe bağlı)"
            className="w-full px-3 py-2 bg-[#f0f2f5] border border-[#e0e0e0] rounded-lg text-[15px] text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition-colors"
          />

          {/* Body Textarea */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Komşularınızla ne paylaşmak istersiniz?"
            className="w-full min-h-[120px] p-3 bg-[#f0f2f5] border border-[#e0e0e0] rounded-lg text-[15px] text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] resize-none transition-colors"
          />

          {/* Media Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#e0e0e0] rounded-lg p-6 text-center cursor-pointer hover:border-[#00833e] hover:bg-[#f0f2f5] transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <ImagePlus className="w-6 h-6 text-[#8f8f8f]" />
              <p className="text-sm font-medium text-[#333]">Fotoğraf ekle</p>
              <p className="text-xs text-[#8f8f8f]">veya sürükle ve bırak</p>
            </div>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Location Tag */}
          <div className="flex items-center justify-between p-3 bg-[#f0f2f5] rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8f8f8f]" />
              {location ? (
                <span className="text-sm text-[#333] font-medium">{location}</span>
              ) : (
                <span className="text-sm text-[#8f8f8f]">Konum eklenmedi</span>
              )}
            </div>
            {location ? (
              <button
                onClick={handleRemoveLocation}
                className="text-xs font-medium text-[#00833e] hover:underline"
              >
                Kaldır
              </button>
            ) : (
              <button
                onClick={handleAddLocation}
                className="text-xs font-medium text-[#00833e] hover:underline"
              >
                Ekle
              </button>
            )}
          </div>

          {/* Visibility Selector */}
          <div className="relative">
            <button
              onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
              className="w-full flex items-center justify-between p-3 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#8f8f8f]" />
                <span className="text-sm text-[#333] font-medium">
                  {VISIBILITY_OPTIONS.find((opt) => opt.id === visibility)?.label}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#8f8f8f]" />
            </button>

            {showVisibilityMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e0e0e0] rounded-lg shadow-lg z-10">
                {VISIBILITY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setVisibility(option.id);
                      setShowVisibilityMenu(false);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg',
                      visibility === option.id
                        ? 'bg-[#e6f4ec] text-[#00833e] font-medium'
                        : 'text-[#333] hover:bg-[#f0f2f5]'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Poll Section - Show when poll type is selected */}
          {postType === 'poll' && (
            <div className="space-y-3 p-3 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
              <p className="text-xs font-semibold text-[#8f8f8f]">ANKET DETAYLARI</p>

              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Anket sorusu yazınız"
                className="w-full px-3 py-2 bg-white border border-[#e0e0e0] rounded-lg text-[14px] text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition-colors"
              />

              <div className="space-y-2">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handlePollOptionChange(index, e.target.value)}
                      placeholder={`Seçenek ${index + 1}`}
                      className="flex-1 px-3 py-2 bg-white border border-[#e0e0e0] rounded-lg text-[14px] text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition-colors"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => handleRemovePollOption(index)}
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-[#8f8f8f]" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {pollOptions.length < 6 && (
                <button
                  onClick={handleAddPollOption}
                  className="text-sm font-medium text-[#00833e] hover:underline"
                >
                  + Seçenek ekle
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer with Buttons */}
        <div className="flex items-center justify-between gap-2 p-4 border-t border-[#e0e0e0] bg-[#f9f9f9]">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm font-medium text-[#333] bg-white border border-[#e0e0e0] rounded-full hover:bg-[#f0f2f5] transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!body.trim() || (postType === 'poll' && (!pollQuestion.trim() || pollOptions.filter((o) => o.trim()).length < 2))}
            className={cn(
              'flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-colors',
              body.trim() && (postType !== 'poll' || (pollQuestion.trim() && pollOptions.filter((o) => o.trim()).length >= 2))
                ? 'bg-[#00833e] text-white hover:bg-[#006b32]'
                : 'bg-[#e0e0e0] text-[#8f8f8f] cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
            Paylaş
          </button>
        </div>
      </div>
    </div>
  );
}
