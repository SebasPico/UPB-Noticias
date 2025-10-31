import { News } from '../../domain/models/News';
import { NewsRepository } from '../../domain/repositories/NewsRepository';

export class InMemoryNewsRepository implements NewsRepository {
  private items: News[] = [
    {
      id: '1',
      title: 'Bienvenidos a Noticias UPB',
      students: 'Equipo UPB',
      professor: 'Coordinación',
      jornada: 1,
      subject: 'Introducción',
      content: 'Este es el primer artículo de nuestro portal.',
      comments: '',
      publishedAt: new Date()
    },
    {
      id: '2',
      title: 'Resultados Jornada 2',
      students: 'Estudiantes Jornada 2',
      professor: 'Coordinación',
      jornada: 2,
      subject: 'Proyectos II',
      content: 'Resumen de actividades y proyectos destacados.',
      comments: '',
      publishedAt: new Date()
    },
    {
      id: '3',
      title: 'Proyectos destacados Jornada 3',
      students: 'Estudiantes Jornada 3',
      professor: 'Docentes',
      jornada: 3,
      subject: 'Innovación III',
      content: 'Los equipos presentaron soluciones innovadoras con gran impacto.',
      comments: '',
      publishedAt: new Date()
    }
  ];

  async list(): Promise<News[]> {
    return [...this.items];
  }

  async findById(id: string): Promise<News | null> {
    return this.items.find(n => n.id === id) ?? null;
  }

  async create(news: Omit<News, 'id'>): Promise<News> {
    const created: News = { ...news, id: (this.items.length + 1).toString() };
    this.items.push(created);
    return created;
  }
}