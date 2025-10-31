import { News } from '../models/News';

export interface NewsRepository {
  list(): Promise<News[]>;
  findById(id: string): Promise<News | null>;
  create(news: Omit<News, 'id'>): Promise<News>;
}