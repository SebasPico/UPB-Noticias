import { News } from '../../domain/models/News';
import { NewsRepository } from '../../domain/repositories/NewsRepository';

export class NewsService {
  constructor(private readonly repo: NewsRepository) {}

  async listNews(): Promise<News[]> {
    return this.repo.list();
  }

  async listByJornada(jornada: 1 | 2 | 3): Promise<News[]> {
    const all = await this.repo.list();
    return all.filter(n => n.jornada === jornada);
  }

  async getNews(id: string): Promise<News | null> {
    return this.repo.findById(id);
  }

  async publishNews(input: {
    title: string;
    students: string;
    professor: string;
    jornada: 1 | 2 | 3;
    subject: string;
    content: string;
    comments: string;
    imageBase64?: string;
    publishedAt?: Date;
  }): Promise<News> {
    const publishedAt = input.publishedAt ?? new Date();
    return this.repo.create({ ...input, publishedAt });
  }
}