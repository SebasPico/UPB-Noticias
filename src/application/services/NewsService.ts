import { News } from '../../domain/models/News';
import { NewsRepository } from '../../domain/repositories/NewsRepository';

export class NewsService {
  constructor(private readonly repo: NewsRepository) {}
  //Obtiene todas las noticias
  async listNews(): Promise<News[]> {
    return this.repo.list();
  }
  //Obtiene las noticias por jornada, esto para poder organizarlas luego en cada vista
  async listByJornada(jornada: 1 | 2 | 3): Promise<News[]> {
    const all = await this.repo.list();
    return all.filter(n => n.jornada === jornada);
  }
  //Obtiene por id las noticias
  async getNews(id: string): Promise<News | null> {
    return this.repo.findById(id);
  }
  //Crea la noticia y la guarda en el archivo json
  async publishNews(input: {
    title: string;
    students: string;
    professor: string;
    jornada: 1 | 2 | 3;
    subject: string;
    content: string;
    comments: string;
    imageFilename?: string;
    publishedAt?: Date;
  }): Promise<News> {
    const publishedAt = input.publishedAt ?? new Date();// Como en el forms no se pide la fecha y hora, agarra la hora y fecha en la que se registra la noticia
    return this.repo.create({ ...input, publishedAt });
  }
}