// SVG data URI generator for reliable demo avatars and covers

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F1948A', '#82E0AA', '#F8C471', '#AED6F1', '#D7BDE2'
];

const EMOJIS = {
  people: ['👩', '👨', '👩‍🦱', '👨‍🦳', '👩‍🦰', '👱‍♂️', '👩‍🦲', '🧔', '👵', '👴', '👧', '👦', '🧑', '👸', '🤴'],
  groups: {
    'Ebeveynler': '👨‍👩‍👧‍👦',
    'Spor': '🏃',
    'Yardımlaşma': '🤝',
    'Hobi': '🎨',
    'Teknoloji': '💻',
    'Müzik': '🎵',
    'Yemek': '🍳',
    'Evcil Hayvan': '🐾',
    'Eğitim': '📚',
    'Sağlık': '🏥',
    default: '👥'
  },
  covers: {
    'Ebeveynler': { emoji: '🏡', bg: '#FFE4E1' },
    'Spor': { emoji: '⚽', bg: '#E0F7FA' },
    'Yardımlaşma': { emoji: '💝', bg: '#FFF3E0' },
    'Hobi': { emoji: '🎯', bg: '#F3E5F5' },
    'Teknoloji': { emoji: '🖥️', bg: '#E8EAF6' },
    'Müzik': { emoji: '🎸', bg: '#FCE4EC' },
    'Yemek': { emoji: '🍕', bg: '#FFF8E1' },
    'Evcil Hayvan': { emoji: '🐶', bg: '#E8F5E9' },
    'Eğitim': { emoji: '📖', bg: '#E3F2FD' },
    'Sağlık': { emoji: '💊', bg: '#F1F8E9' },
    default: { emoji: '🏘️', bg: '#ECEFF1' }
  }
};

export function getAvatarUrl(name: string, index: number = 0): string {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const emoji = EMOJIS.people[index % EMOJIS.people.length];
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="100" fill="${color}"/>
    <text x="100" y="85" text-anchor="middle" font-size="60">${emoji}</text>
    <text x="100" y="155" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="white">${initials}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getGroupAvatarUrl(name: string, category: string): string {
  const emoji = EMOJIS.groups[category as keyof typeof EMOJIS.groups] || EMOJIS.groups.default;
  const color = AVATAR_COLORS[name.length % AVATAR_COLORS.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="100" fill="${color}"/>
    <text x="100" y="120" text-anchor="middle" font-size="80">${emoji}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getGroupCoverUrl(name: string, category: string): string {
  const cover = EMOJIS.covers[category as keyof typeof EMOJIS.covers] || EMOJIS.covers.default;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">
    <rect width="600" height="300" fill="${cover.bg}"/>
    <text x="300" y="140" text-anchor="middle" font-size="80">${cover.emoji}</text>
    <text x="300" y="220" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="#555">${name}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getStoryImageUrl(userName: string, index: number): string {
  const storyEmojis = ['🌅', '🎉', '🍽️', '🌳', '🏖️', '🎭', '🎪', '⛰️', '🌺', '🌈'];
  const bgColors = ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#2c3e50', '#1b2631', '#0e6655', '#784212', '#4a235a', '#1c2833'];
  const emoji = storyEmojis[index % storyEmojis.length];
  const bg = bgColors[index % bgColors.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <rect width="400" height="600" fill="${bg}"/>
    <text x="200" y="280" text-anchor="middle" font-size="120">${emoji}</text>
    <text x="200" y="420" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="white">${userName}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getBusinessCoverUrl(name: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
    <rect width="800" height="400" fill="#E8F5E9"/>
    <text x="400" y="180" text-anchor="middle" font-size="80">🏪</text>
    <text x="400" y="280" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="#333">${name}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getDefaultAvatar(name: string = '?'): string {
  const initial = name[0]?.toUpperCase() || '?';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="50" fill="#CBD5E1"/>
    <text x="50" y="65" text-anchor="middle" font-family="Arial,sans-serif" font-size="40" font-weight="bold" fill="white">${initial}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getFeedImageUrl(index: number, width: number = 800, height: number = 400): string {
  const feedEmojis = ['📸', '🎉', '🍽️', '🌳', '🏖️', '🎭', '🎪', '⛰️', '🌺', '🌈', '🏠', '🚗', '🎨', '📚', '⚽'];
  const bgColors = ['#FFE4E1', '#E0F7FA', '#FFF3E0', '#F3E5F5', '#E8EAF6', '#FCE4EC', '#FFF8E1', '#E8F5E9', '#E3F2FD', '#F1F8E9', '#ECEFF1', '#FFF0F5', '#F0F8FF', '#FFF5E6', '#F5F5DC'];
  const emoji = feedEmojis[index % feedEmojis.length];
  const bg = bgColors[index % bgColors.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${bg}"/>
    <text x="${width / 2}" y="${height / 2 - 20}" text-anchor="middle" font-size="${Math.min(width, height) / 3}">${emoji}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
