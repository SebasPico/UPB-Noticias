import request from 'supertest';
import { buildApp } from '../src/app';

describe('Noticias UPB endpoints', () => {
  const app = buildApp();

  it('GET /api/news devuelve lista inicial', async () => {
    const res = await request(app).get('/api/news');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/news crea una noticia', async () => {
    const res = await request(app)
      .post('/api/news')
      .send({ title: 'Nueva', content: 'Contenido', author: 'Autor' })
      .set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Nueva');
  });

  it('GET / devuelve HTML', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Noticias UPB');
  });
});