'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';

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
    avatar: 'https://picsum.photos/100/100?random=1',
    image: 'https://picsum.photos/400/600?random=1',
    viewed: false,
  },
  {
    id: 'user-2',
    userId: '2',
    userName: 'Mehmet Kaya',
    avatar: 'https://picsum.photos/100/100?random=2',
    image: 'https://picsum.photos/400/600?random=2',
    viewed: true,
  },
  {
    id: 'user-3',
    userId: '3',
    userName: 'Zeynep Demir',
    avatar: 'https://picsum.photos/100/100?random=3',
    image: 'https://picsum.photos/400/600?random=3',
    viewed: false,
  },
  {
    id: 'user-4',
    userId: '4',
    userName: 'İbrahim Çetin',
    avatar: 'https://picsum.photos/100/100?random=4',
    image: 'https://picsum.photos/400/600?random=4',
    viewed: true,
  },
  {
    id: 'user-5',
    userId: '5',
    userName: 'Fatma Şahin',
    avatar: 'https://picsum.photos/100/100?random=5',
    image: 'https://picsum.photos/400/600?random=5',
    viewed: false,
  },
  {
    id: 'user-6',
    userId: '6',
    userName: 'Ahmet Doğan',
    avatar: 'https://picsum.photos/100/100?random=6',
    image: 'https://picsum.photos/400/600?random=6',
    viewed: true,
  },
  {
    id: 'user-7',
    userId: '7',
    userName: 'Selin Taş',
    avatar: 'https://picsum.photos/100/100?random=7',
    image: 'https://picsum.photos/400/600?random=7',
    viewed: false,
  },
  {
    id: 'user-8',
    userId: '8',
    userName: 'Kerem Aydın',
    avatar: 'https://picsum.photos/100/100?random=8',
    image: 'https://picsum.photos/400/600?random=8',
    viewed: true,
  },
  {
    id: 'user-9',
    userId: '9',
    userName: 'Leyla Gül',
    avatar: 'https://picsum.photos/100/100?random=9',
    image: 'https://picsum.photos/400/600?random=9',
    viewed: false,
  },
  {
    id: 'user-10',
    userId: '10',
    userName: 'Emre Yüce',
    avatar: 'https://picsum.photos/100/100?random=10',
    image: 'https://picsum.photos/400/600?random=10',
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
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 mb-6">
        <div className="relative">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md border border-[#e0e0e0] p-2 hover:bg-[#f0f2f5] transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} className="text-[#333]" />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md border border-[#e0e0e0] p-2 hover:bg-[#f0f2f5] transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} className="text-[#333]" />
            </button>
          )}

          {/* Scrollable Stories Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-2"
          >
            {/* Add Story Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleAddStory}
                className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00833e] to-[#006b32] flex items-center justify-center shadow-sm border-2 border-[#e0e0e0] hover:shadow-md transition-shadow">
                  <Plus size={28} className="text-white" />
                </div>
                <span className="text-xs font-medium text-[#333] text-center max-w-[80px]">
                  Hikayeni Ekle
                </span>
              </button>
            </div>

            {/* Story Items */}
            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0">
                <button
                  onClick={() => openStory(story)}
                  className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-sm border-2 transition-colors overflow-hidden ${
                      story.viewed
                        ? 'border-[#e0e0e0] opacity-75'
                        : 'border-[#00833e] shadow-md'
                    }`}
                  >
                    <Image
                      src={story.avatar}
                      alt={story.userName}
                      width={80}
                      height={80}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium text-[#333] text-center max-w-[80px] line-clamp-2">
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
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
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
            <div className="h-1 bg-white bg-opacity-30">
              <div
                className="h-full bg-[#00833e] transition-all"
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
