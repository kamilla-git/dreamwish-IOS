export const themes: Record<string, any> = {
  birthday: {
    name: 'День Рождения',
    emoji: '🎂',
    gradient: ['#022c22', '#0f172a'],
    color: '#fbbf24'
  },
  forest: {
    name: 'Изумрудный Лес',
    emoji: '🌿',
    gradient: ['#022c22', '#064e3b'],
    color: '#34d399'
  },
  new_year: {
    name: 'Новый Год',
    emoji: '🎄',
    gradient: ['#1e3a8a', '#020617'],
    color: '#ffffff'
  },
  wedding: {
    name: 'Свадьба',
    emoji: '💍',
    gradient: ['#4c1d95', '#1e1b4b'],
    color: '#ddd6fe'
  },
  other: {
    name: 'Другое',
    emoji: '✨',
    gradient: ['#111827', '#020617'],
    color: '#fbbf24'
  }
};

export const getTheme = (name: string) => themes[name] || themes.birthday;
