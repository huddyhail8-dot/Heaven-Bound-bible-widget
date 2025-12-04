
export interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  category: VerseCategory[];
  keywords?: string[];
}

export enum VerseCategory {
  Hope = 'Hope',
  Love = 'Love',
  Strength = 'Strength',
  Faith = 'Faith',
  Healing = 'Healing',
  Wisdom = 'Wisdom',
  Peace = 'Peace',
  Forgiveness = 'Forgiveness',
  Guidance = 'Guidance',
}

export interface WidgetPosition {
  x: number;
  y: number;
}
