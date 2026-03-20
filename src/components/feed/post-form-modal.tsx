'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, ImagePlus, MapPin, Globe, BarChart3, Shield, HelpCircle, Tag, ChevronDown, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPost } from '@/lib/hooks/use-posts';
import { useCurrentUser } from '@/lib/hooks/use-auth';

const POST_TYPES = [
  { id: 'general', label: 'Genel', icon: Tag },
  { id: 'security', label: 'GÃ¼venlik', icon: Shield },
  { id: 'recommendation', label: 'Ã–neri', icon: HelpCircle },
  { id: 'lost-found', label: 'KayÄ±p/Buluntu', icon: Tag },
  { id: 'poll', label: 'Anket', icon: BarChart3 },
];

const VISIBILITY_OPTIONS = [
  { id: 'neighborhood', label: 'Mahalle' },
  { id: 'nearby', label: 'YakÄ±n Mahalleler' },
  { id: 'city', label: 'Åehir' },
];

const getPlaceholderText = (postType: string): string => {
  switch (postType) {
    case 'security':
      return 'Dikkat Ã§eken bir durum var mÄ±= GÃ¼venlik uyarÄ±sÄ±nÄ± paylaÅŸ...';
    case 'recommendation':
      return 'Mahallede beÄŸendiÄŸin bir mekan veya hizmet? Fikrinizi paylaÅŸ...';
    case 'lost-found':
      return 'KayÄ±p veya bulunan bir eÅŸya mÄ°? DetaylarÄ±nÄ± paylaÅŸ...';
    case 'poll':
      return 'Anket konusu hakkÄ±nda bilgi ver...';
    default:
      return 'KomÅŸularÄ±nÄ±zla ne paylaÅŸmak istersiniz?';
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
  const [location, setLocation] = useState<string | null>(null);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

                </div>
          </div>
        </div>

        {/* Post Type Selector */}
        <div>
          <p className="text-xs font-semibold text-text-muted mb-2">GÃ–NDERÄ° TÄ°PÄ°</p>
          <div className="flex gap-2 flex-wrap">
            { POST_TYPES.map((type) => {
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
        </div>          })}
        </div>

        {/* Category Selector - Show when post type is 'recommendation' */}
        { postType === 'recommendation' && (
          <div className="space-y-3 p-3 bg-surface-hover rounded-lg border border-border">
            <p className="text-xs font-sembold text-text-muted">KATEGORI</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-[14px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="">Kategori SeÃ§iniz</option>
              {PREDEFINED_CATEGORIES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Lost and Found Type - Show when post type is 'lost-found' */}
        { postType === 'lost-found' && (
          <div className="space-y-3 p-3 bg-surface-hover rounded-lg border border-border">
            <p className="text-xs font-semibold text-text-muted">TÅDpğìØ TÃ‡ÆNTE¼;8˜ğìØ7P°€ğ½Àø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à…À´Èˆø(€€€€€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€€€€€½¹±¥¬õì ¤€ôøÍ•Ñ1½ÍÑ½Õ¹‘QåÁ” ±½ÍĞœ¥ô(€€€€€€€€€€€€€€€±…ÍÍ9…µ”õí¸ (€€€€€€€€€€€€€€€€€€™±•à¥Ñ•µÌµ•¹Ñ•È…À´Ä¸ÔÁà´ÌÁä´ÈÉ½Õ¹‘•µ™Õ±°Ñ•áĞµÍ´™½¹Ğµµ•‘¥Õ´ÑÉ…¹Í¥Ñ¥½¸µ½±½ÉÌ‰½É‘•Èœ°(€€€€€€€€€€€€€€€€€±½ÍÑ½Õ¹‘QåÁ”€ôôô€±½ÍĞœ(€€€€€€€€€€€€€€€€€€€€ü€‰œµÁÉ¥µ…ÉäÑ•áĞµİ¡¥Ñ”‰½É‘•ÈµÁÉ¥µ…Éäœ(€€€€€€€€€€€€€€€€€€€€è€‰œµÍÕÉ™…”Ñ•áĞµÑ•áĞµÁÉ¥µ…Éä‰½É‘•Èµ‰½É‘•Èˆhover:border-primary hover:text-primary'
                )}
   (œ‰Èœòğb (¼¼ˆO‚ˆ]ˆÛ\ÜÓ˜[YOH^\ÛH›Û[YY][H^]^\š[X\H’Ø\ŞX›Áˆ€ˆ	Pb     ;
              </div>
            </button>
            <button
              onClick={() => setLostFoundType('found')}
              className={cn(
                 'flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors border',
                  lostFoundType === 'found'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-text-primary border-border hover:border-primary hover:text-primary'
                )}
              >
                <div className="text-sm font-medium text-text-primary">Bulundu</div>
              </button>
            </div>
          </div>
        )}