'use client';

import { toast } from '@/lib/utils/show-toast'

import { useState, useRef, useEffect } from 'react';
import { X, Send, ImagePlus, MapPin, Globe, BarChart3, Shield, HelpCircle, Tag, ChevronDown, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPost } from '@/lib/hooks/use-posts';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { uploadMultipleImages } from '@/lib/upload';
import { createClient } from '@/lib/supabase/client';
import { useVerificationGate } from '@/components/shared/verification-gate';

const POST_TYPES = [
  { id: 'general', label: 'Genel', icon: Tag },
  { id: 'safety', label: 'Güvenlik', icon: Shield },
  { id: 'recommendation', label: 'Öneri', icon: HelpCircle },
  { id: 'lost_found', label: 'Kayıp/Buluntu', icon: Tag },
  { id: 'poll', label: 'Anket', icon: BarChart3 },
];

const VISIBILITY_OPTIONS = [
  { id: 'neighborhood', label: 'Mahalle' },
  { id: 'nearby', label: 'Yakın Mahalleler' },
  { id: 'city', label: 'Şehir' },
];

const getPlaceholderText = (postType: string): string => {
  switch (postType) {
    case 'safety':
      return 'Dikkat çeken bir durum var mı? Güvenlik uyarısını paylaş...';
    case 'recommendation':
      return 'Mahallede beğendiğin bir mekan veya hizmet? Fikrinizi paylaş...';
    case 'lost_found':
      return 'Kayıp veya bulunan bir eşya mı? Detaylarını paylaş...';
    case 'poll':
      return 'Anket konusu hakkında bilgi ver...';
    default:
      return 'Komşularınızla ne paylaşmak istersiniz?';
  }
};

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: any) => void;
}

export function PostFormModal({ isOpen, onClose, onSubmit }: PostFormModalProps) {
  const { user, profile } = useCurrentUser();
  const [postType, setPostType] = useState('general');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [visibility, setVisibility] = useState('neighborhood');
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [neighborhoodId, setNeighborhoodId] = useState<string | null>(null);
  const [neighborhoodName, setNeighborhoodName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user's neighborhood on mount
  useEffect(() => {
    async function fetchNeighborhood() {
      if (!user?.id) return;
      const supabase = createClient();
      try {
        const { data } = await supabase
          .from('neighborhood_members')
          .select('neighborhood_id, neighborhoods(name, district)')
          .eq('user_id', user.id)
          .single();

        if (data && data.neighborhood_id) {
          setNeighborhoodId(data.neighborhood_id);
          const neighborhood = (data as any).neighborhoods;
          if (neighborhood && neighborhood.district && neighborhood.name) {
            setNeighborhoodName(`${neighborhood.district}, ${neighborhood.name}`);
          }
        }
      } catch (err) {
        console.error('Failed to fetch neighborhood:', err);
        // Keep default fallback
      }
    }
    fetchNeighborhood();
  }, [user?.id]);

  // Keyboard shortcut: Esc to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newPreviews]);
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
      const newFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
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
    if (neighborhoodName) setLocation(neighborhoodName);
  };

  const handleRemoveLocation = () => {
    setLocation(null);
  };

  const { checkVerified, gateModal } = useVerificationGate('Gönderi paylaşabilmek');

  const handleSubmit = async () => {
    if (!body.trim()) {
      toast.warning('Lütfen gönderi içeriği yazınız');
      return;
    }

    if (postType === 'poll') {
      const validOptions = pollOptions.filter((opt) => opt.trim());
      if (!pollQuestion.trim() || validOptions.length < 2) {
        toast.warning('Lütfen anket sorusu ve en az 2 seçenek yazınız');
        return;
      }
    }

    if (!user) {
      toast.error('Gönderi oluşturmak için giriş yapmanız gerekir');
      return;
    }

    if (!(await checkVerified())) return;

    setIsSubmitting(true);
    try {
      // Mahalleyi çöz: modal açılışındaki fetch henüz bitmemiş olabilir; burada bir kez daha dene.
      // Mahalle bulunamazsa gönderiyi sahte bir mahalleye yazmak yerine dürüstçe engelle.
      let nbId = neighborhoodId;
      if (!nbId) {
        const supabase = createClient();
        const { data: nb } = await supabase
          .from('neighborhood_members')
          .select('neighborhood_id')
          .eq('user_id', user.id)
          .single();
        nbId = nb?.neighborhood_id ?? null;
        if (nbId) setNeighborhoodId(nbId);
      }
      if (!nbId) {
        toast.error('Mahalleniz tanımlı değil. Gönderi paylaşmadan önce mahallenizi belirleyin.');
        return;
      }

      // Upload images to Supabase Storage if present
      let mediaUrls: string[] | null = null;
      if (imageFiles.length > 0) {
        const { urls, errors } = await uploadMultipleImages(imageFiles, 'post-images', user.id);
        if (urls.length > 0) {
          mediaUrls = urls;
        }
        if (errors.length > 0) {
          console.warn('Some images failed to upload:', errors);
        }
      }

      const postData = {
        author_id: user.id,
        neighborhood_id: nbId,
        title: title.trim() || null,
        body: body.trim(),
        type: postType,
        visibility: visibility || 'neighborhood',
        media_urls: mediaUrls,
      };

      const { data, error } = await createPost(postData as any);

      if (data && !error) {
        const postResult = data as any;
        const newPost = {
          id: postResult.id,
          type: postType,
          title: postResult.title || undefined,
          body: postResult.body,
          visibility,
          images: mediaUrls || images,
          location,
          author: { name: profile?.full_name || 'Siz', initial: profile?.full_name?.[0]?.toUpperCase() || 'S', neighborhood: neighborhoodName, profileId: user.id },
          timeAgo: 'Az önce',
          reactions: 0,
          comments: 0,
        };

        onSubmit(newPost);
        resetForm();
        onClose();
      } else {
        // NOT (2026-06-07): Eskiden kayıt BAŞARISIZ olduğunda kullanıcının girdisinden
        // SAHTE bir "başarılı gönderi" üretip (id: Date.now()) akışa basıyordu —
        // kullanıcı gönderisi yayınlandı sanıyor ama veritabanına hiç yazılmıyordu.
        // Artık dürüst hata gösterilir, modal açık kalır ki tekrar denenebilsin.
        console.error('Gönderi oluşturulamadı:', error);
        toast.error('Gönderi paylaşılamadı. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error('Gönderi gönderilirken beklenmeyen hata:', err);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPostType('general');
    setTitle('');
    setBody('');
    setVisibility('neighborhood');
    setShowVisibilityMenu(false);
    setImages([]);
    setImageFiles([]);
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
      {gateModal}
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative bg-surface rounded-none sm:rounded-lg shadow-2xl w-full sm:max-w-[600px] h-full sm:h-auto sm:max-h-[90vh] flex flex-col sm:mx-4 animate-in fade-in scale-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">Gönderi Oluştur</h2>
          <button
            onClick={handleClose}
            aria-label="Kapat"
            className="p-1 hover:bg-background rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Post Type Selector */}
          <div>
            <p className="text-xs font-semibold text-text-muted mb-2">GÖNDERİ TİPİ</p>
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
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface text-text-primary border-border hover:border-primary hover:text-primary'
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
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <div className="w-10 h-10 bg-text-secondary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {profile?.full_name?.[0]?.toUpperCase() || 'K'}
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{profile?.full_name || 'Siz'}</p>
              <p className="text-xs text-text-muted">{neighborhoodName || 'Mahalle belirtilmedi'}</p>
            </div>
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Başlık ekleyin (isteğe bağlı)"
            className="w-full px-3 py-2 bg-surface-hover border border-border rounded-lg text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />

          {/* Body Textarea */}
          <div className="relative">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={getPlaceholderText(postType)}
              className="w-full min-h-[120px] p-3 bg-surface-hover border border-border rounded-lg text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-colors"
            />
            {/* Character count */}
            <div className="absolute bottom-2 right-3 text-xs text-text-muted">
              {body.length}/5000
            </div>
          </div>

          {/* Media Upload Area */}
          {images.length === 0 && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-surface-hover transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  <ImagePlus className="w-6 h-6 text-text-muted" />
                  <Video className="w-6 h-6 text-text-muted" />
                </div>
                <p className="text-sm font-medium text-text-primary">Fotoğraf veya video ekle</p>
                <p className="text-xs text-text-muted">Tıkla ya da sürükle ve bırak</p>
              </div>
            </div>
          )}

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
          <div className="flex items-center justify-between p-3 bg-surface-hover rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-text-muted" />
              {location ? (
                <span className="text-sm text-text-primary font-medium">{location}</span>
              ) : (
                <span className="text-sm text-text-muted">Konum eklenmedi</span>
              )}
            </div>
            {location ? (
              <button
                onClick={handleRemoveLocation}
                className="text-xs font-medium text-primary hover:underline"
              >
                Kaldır
              </button>
            ) : (
              <button
                onClick={handleAddLocation}
                className="text-xs font-medium text-primary hover:underline"
              >
                Ekle
              </button>
            )}
          </div>

          {/* Visibility Selector */}
          <div className="relative">
            <button
              onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
              className="w-full flex items-center justify-between p-3 bg-surface-hover rounded-lg border border-border hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-primary font-medium">
                  {VISIBILITY_OPTIONS.find((opt) => opt.id === visibility)?.label}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </button>

            {showVisibilityMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-10">
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
                        ? 'bg-primary-light text-primary font-medium'
                        : 'text-text-primary hover:bg-surface-hover'
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
            <div className="space-y-3 p-3 bg-surface-hover rounded-lg border border-border">
              <p className="text-xs font-semibold text-text-muted">ANKET DETAYLARI</p>

              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Anket sorusu yazınız"
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />

              <div className="space-y-2">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handlePollOptionChange(index, e.target.value)}
                      placeholder={`Seçenek ${index + 1}`}
                      className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => handleRemovePollOption(index)}
                        className="p-1 hover:bg-surface rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-text-muted" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {pollOptions.length < 6 && (
                <button
                  onClick={handleAddPollOption}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  + Seçenek ekle
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer with Buttons */}
        <div className="flex items-center justify-between gap-2 p-4 border-t border-border bg-surface-hover">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium text-text-primary bg-surface border border-border rounded-full hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!body.trim() || isSubmitting || (postType === 'poll' && (!pollQuestion.trim() || pollOptions.filter((o) => o.trim()).length < 2))}
            className={cn(
              'flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-colors',
              body.trim() && (postType !== 'poll' || (pollQuestion.trim() && pollOptions.filter((o) => o.trim()).length >= 2)) && !isSubmitting
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'bg-border text-text-muted cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Gönderiliyor...' : 'Paylaş'}
          </button>
        </div>
      </div>
    </div>
  );
}
