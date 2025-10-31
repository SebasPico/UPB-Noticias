import { Request, Response } from 'express';
import { NewsService } from '../../application/services/NewsService';

export class NewsController {
  constructor(private readonly service: NewsService) {}

  listJson = async (_req: Request, res: Response) => {
    const data = await this.service.listNews();
    res.json({ data });
  };

  createJson = async (req: Request, res: Response) => {
    const { title, content, professor, students, jornada, subject, comments, imageBase64 } = req.body ?? {};
    if (!title || !content || !professor || !students || !jornada || !subject) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const created = await this.service.publishNews({
      title,
      content,
      professor,
      students,
      jornada: Number(jornada) as 1 | 2 | 3,
      subject,
      comments: comments ?? '',
      imageBase64
    });
    res.status(201).json({ data: created });
  };

  listPage = async (_req: Request, res: Response) => {
    const data = await this.service.listNews();
    res.render('index', { title: 'Noticias UPB', news: data });
  };

  jornadaPage = async (req: Request, res: Response) => {
    const id = Number(req.params.id) as 1 | 2 | 3;
    if (![1, 2, 3].includes(id)) {
      return res.redirect('/jornada/1');
    }
    const all = await this.service.listByJornada(id);
    const pageSize = 6;
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const pageParam = Number(req.query.page) || 1;
    const page = Math.min(Math.max(pageParam, 1), totalPages);
    const start = (page - 1) * pageSize;
    const paged = all.slice(start, start + pageSize);
    res.render('jornada', {
      title: `Jornada ${id}`,
      jornada: id,
      news: paged,
      page,
      totalPages,
      total
    });
  };

  createFormPage = async (_req: Request, res: Response) => {
    res.render('crear', { title: 'Crear Noticia' });
  };

  createPagePost = async (req: Request, res: Response) => {
    const { title, students, professor, jornada, subject, content, comments } = req.body ?? {};
    if (!title || !students || !professor || !jornada || !subject || !content) {
      return res.status(400).send('Faltan campos obligatorios');
    }
    let imageBase64: string | undefined;
    const file: any = (req as any).file;
    if (file) {
      const size = file.size;
      if (size > 10 * 1024 * 1024) {
        return res.status(413).send('La imagen excede el límite de 10MB');
      }
      imageBase64 = file.buffer.toString('base64');
    }

    const created = await this.service.publishNews({
      title,
      students,
      professor,
      jornada: Number(jornada) as 1 | 2 | 3,
      subject,
      content,
      comments: comments ?? '',
      imageBase64
    });
    res.redirect(`/jornada/${created.jornada}`);
  };
}