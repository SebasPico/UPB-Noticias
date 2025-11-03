import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { NewsService } from '../../application/services/NewsService';

export class NewsController {
  constructor(private readonly service: NewsService) {}

  listJson = async (_req: Request, res: Response) => {
    const data = await this.service.listNews();
    res.json({ data });
  };

  createJson = async (req: Request, res: Response) => {
    const { title, content, professor, students, jornada, subject, comments, imageBase64, imageFilename } = req.body ?? {};
    if (!title || !content || !professor || !students || !jornada || !subject) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    let filename: string | undefined = imageFilename;
    // Soportar compatibilidad: si llega imageBase64 en JSON, guardamos archivo y usamos filename
    if (!filename && typeof imageBase64 === 'string' && imageBase64.length > 0) {
      const imagesDir = path.join(process.cwd(), 'public', 'images');
      await fs.mkdir(imagesDir, { recursive: true });
      const buf = Buffer.from(imageBase64.replace(/\s+/g, ''), 'base64');
      const ext = buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xD8 ? 'jpg' : 'png';
      const base = `news-${Date.now()}`;
      filename = `${base}.${ext}`;
      const outPath = path.join(imagesDir, filename);
      await fs.writeFile(outPath, buf);
    }
    const created = await this.service.publishNews({
      title,
      content,
      professor,
      students,
      jornada: Number(jornada) as 1 | 2 | 3,
      subject,
      comments: comments ?? '',
      imageFilename: filename
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
    const subjectParamRaw = (req.query.subject as string | undefined) ?? '';
    const subjectParam = subjectParamRaw.trim();
    let filtered = all;
    if ((id === 3 || id === 2) && subjectParam) {
      const normalized = subjectParam.toLowerCase();
      filtered = all.filter(n => n.subject.toLowerCase() === normalized);
    }
    const pageSize = 6;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const pageParam = Number(req.query.page) || 1;
    const page = Math.min(Math.max(pageParam, 1), totalPages);
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);
    res.render('jornada', {
      title: `Jornada ${id}`,
      jornada: id,
      news: paged,
      page,
      totalPages,
      total,
      selectedSubject: subjectParam
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
    let imageFilename: string | undefined;
    const file: any = (req as any).file;
    if (file) {
      const size = file.size;
      if (size > 10 * 1024 * 1024) {
        return res.status(413).send('La imagen excede el límite de 10MB');
      }
      const imagesDir = path.join(process.cwd(), 'public', 'images');
      await fs.mkdir(imagesDir, { recursive: true });
      const mime = String(file.mimetype || '').toLowerCase();
      let ext = 'jpg';
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('gif')) ext = 'gif';
      const baseSafe = String(title || `news-${Date.now()}`)
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      imageFilename = `${baseSafe}-${Date.now()}.${ext}`;
      const outPath = path.join(imagesDir, imageFilename);
      await fs.writeFile(outPath, file.buffer);
    }

    const created = await this.service.publishNews({
      title,
      students,
      professor,
      jornada: Number(jornada) as 1 | 2 | 3,
      subject,
      content,
      comments: comments ?? '',
      imageFilename
    });
    res.redirect(`/jornada/${created.jornada}`);
  };
}