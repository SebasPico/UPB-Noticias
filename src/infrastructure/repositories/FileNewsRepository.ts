import { promises as fs } from 'fs';
import path from 'path';
import { News } from '../../domain/models/News';
import { NewsRepository } from '../../domain/repositories/NewsRepository';

export class FileNewsRepository implements NewsRepository {
  private readonly filePath: string;

  constructor(fileRelativePath = path.join('data', 'news.json')) {
    this.filePath = path.join(process.cwd(), fileRelativePath);
  }

  private async ensureFile() {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, JSON.stringify([]), 'utf-8');
    }
  }

  private revive(items: any[]): News[] {
    return items.map((n) => ({ ...n, publishedAt: new Date(n.publishedAt) }));
  }

  async list(): Promise<News[]> {
    await this.ensureFile();
    const raw = await fs.readFile(this.filePath, 'utf-8');
    const arr = JSON.parse(raw || '[]');
    return this.revive(arr);
  }

  async findById(id: string): Promise<News | null> {
    const all = await this.list();
    return all.find((n) => n.id === id) ?? null;
  }

  async create(news: Omit<News, 'id'>): Promise<News> {
    await this.ensureFile();
    const raw = await fs.readFile(this.filePath, 'utf-8');
    const arr: News[] = this.revive(JSON.parse(raw || '[]'));
    const created: News = { ...news, id: Date.now().toString() };
    arr.push(created);
    await fs.writeFile(this.filePath, JSON.stringify(arr, null, 2), 'utf-8');
    return created;
  }
}