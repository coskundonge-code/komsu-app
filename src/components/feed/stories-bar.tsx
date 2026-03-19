'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getAvatarUrl, getStoryImageUrl } from '@/lib/demo-images';

interface Story {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  image: string;
  viewed: boolean;
}

const mockStories: Story[] = [
  {
    id: 'user-1',
    userId: '1',
    userName: 'Ayşe Yılmaz',
    avatar: getAvatarUrl('Ayşe Yılmaz', 0),
    image: getStoryImageUrl('Ayşe Yılmaz', 0),
    viewed: false,
  },
  {
    id: 'user-2',
    userId: '2',
    userName: 'Mehmet Kaya',
    avatar: getAvatarUrl('Mehmet Kaya', 1),
    image: getStoryImageUrl('Mehmet Kaya', 1),
    viewed: true,
  },
  {
    id: 'user-3',
    userId: '3',
    userName: 'Zeynep Demir',
    avatar: getAvatarUrl('Zeynep Demir', 2),
    image: getStoryImageUrl('Zeynep Demir', 2),
    viewed: false,
  },
  {
    id: 'user-4',
    userId: '4',
    userName: 'İbrahim Çetin',
    avatar: getAvatarUrl('İbrahim Çetin', 3),
    image: getStoryImageUrl('İbrahim Çetin', 3),
    viewed: true,
  },
  {
    id: 'user-5',
    userId: '5',
    userName: 'Fatma Şahin',
    avatar: getAvatarUrl('Fatma Şahin', 4),
    image: getStoryImageUrl('Fatma Şahin', 4),
    viewed: false,
  },
  {
    id: 'user-6',
    userId: '6',
    userName: 'Ahmet Doğan',
    avatar: getAvatarUrl('Ahmet Doğan', 5),
    image: getStoryImageUrl('Ahmet Doğan', 5),
    viewed: true,
  },
  {
    id: 'user-7',
    userId: '7',
    userName: 'Selin Taş',
    avatar: getAvatarUrl('Selin Taş', 6),
    image: getStoryImageUrl('Selin Taş', 6),
    viewed: false,
  },
  {
    id: 'user-8',
    userId: '8',
    userName: 'Kerem Aydın',
    avatar: getAvatarUrl('Kerem Aydın', 7),
    image: getStoryImageUrl('Kerem Aydın', 7),
    viewed: true,
  },
  {
    id: 'user-9',
    userId: '9',
    userName: 'Leyla Gül',
    avatar: getAvatarUrl('Leyla Gül', 8),
    image: getStoryImageUrl('Leyla Gül', 8),
    viewed: false,
  },
  {
    id: 'user-10',
    userId: '10',
    userName: 'Emre Yüce',
    avatar: getAvatarUrl('Emre Yüce', 9),
    image: getStoryImageUrl('Emre Yüce', 9),
    viewed: true,
  },
];

interface StoryOverlay {
  story: Story | null;
  autoCloseTimer: NodeJS.Timeout | null;
}

export default function StoriesBar() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [storyOverlay, setStoryOverlay] = useState<StoryOverlay>({
    story: null,
    autoCloseTimer: null,
  });
  const [stories, setStories] = useState<Story[]>(mockStories);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll =
        direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  const openStory = (story: Story) => {
    if (storyOverlay.autoCloseTimer) {
      clearTimeout(storyOverlay.autoCloseTimer);
    }

    const timer = setTimeout(() => {
      closeStory();
    }, 5000);

    setStories((prev) =>
      prev.map((s) => (s.id === story.id ? { ...s, viewed: true } : s)),
    );

    setStoryOverlay({
      story: { ...story, viewed: true },
      autoCloseTimer: timer,
    });
  };

  const closeStory = () => {
    if (storyOverlay.autoCloseTimer) {
      clearTimeout(storyOverlay.autoCloseTimer);
    }
    setStoryOverlay({
      story: null,
      autoCloseTimer: null,
    });
  };

  const handleAddStory = () => {
    // Placeholder for add story functionality
    console.log('Add story clicked');
  };

  return (
    <>
      {/* Stories Bar Container */}
      <div className="bg-surface rounded-lg shadow-sm border border-border p-4 mb-6">
        <div className="relative">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-surface rounded-full shadow-md border border-border p-2 hover:bg-background transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} className="text-text-primary" />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-surface rounded-full shadow-md border border-border p-2 hover:bg-background transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} className="text-text-primary" />
            </button>
          )}

          {/* Scrollable Stories Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-2"
          >
            {/* Add Story Button */}
            <div className="flex-shrink-0 w-[80px]">
              <button
                onClick={handleAddStory}
                className="w-full flex flex-col items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-sm border-2 border-border hover:shadow-md transition-shadow mx-auto">
                  <Plus size={24} className="text-white" />
                </div>
                <span className="text-xs font-medium text-text-primary text-center w-full truncate">
                  Yeni Paylaşım
                </span>
              </button>
            </div>

            {/* Story Items */}
            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0 w-[80px]">
                <button
                  onClick={() => openStory(story)}
                  className="w-full flex flex-col items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm border-2 transition-colors overflow-hidden mx-auto ${
                      story.viewed
                        ? 'border-border opacity-75'
                        : 'border-primary shadow-md'
                    }`}
                  >
                    <Image
                      src={story.avatar}
                      alt={story.userName}
                      width={64}
                      height={64}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium text-text-primary text-center w-full truncate block">
                    {story.userName}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Overlay Modal */}
      {storyOverlay.story && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md max-h-screen flex flex-col">
            {/* Close Button */}
            <button
              onClick={closeStory}
              className="absolute top-4 right-4 z-10 bg-surface bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
              aria-label="Close story"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Story Image */}
            <div className="flex-1 relative overflow-hidden">
              <Image
                src={storyOverlay.story.image}
                alt={storyOverlay.story.userName}
                fill
                unoptimized
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* User Info at Bottom */}
            <div className="bg-gradient-to-t from-black to-transparent p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden flex-shrink-0">
                <Image
                  src={storyOverlay.story.avatar}
                  alt={storyOverlay.story.userName}
                  width={40}
                  height={40}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{storyOverlay.story.userName}</p>
                <p className="text-white text-opacity-70 text-xs">Şu anda</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-surface bg-opacity-30">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  animation: 'progress 5s linear forwards',
                }}
              />
            </div>
          </div>

          <style>{`
            @keyframes progress {
              from {
                width: 0%;
              }
              to {
                width: 100%;
              }
            }
          `}</style>
        </div>
      )}

      {/* Hide scrollbar globally for this component */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
