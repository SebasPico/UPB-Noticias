import request from 'supertest';
import { buildApp } from '../src/app';

describe('Noticias UPB endpoints', () => {
  const app = buildApp();

  // Valida que devuelva una lista de noticias
  it('GET /api/news devuelve lista inicial', async () => {
    const res = await request(app).get('/api/news');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  //Valida que se pueda crear una noticia, con el datos oblñigatorios para llenar
  it('POST /api/news crea una noticia', async () => {
    const res = await request(app)
      .post('/api/news')
      .send({
        title: 'Nueva',
        content: 'Contenido',
        professor: 'Profe Ejemplar',
        students: 'Ana, Juan',
        jornada: 1,
        subject: 'Estructura de datos',
        comments: 'Opcional'
      })
      .set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Nueva');
  });

  // Valida que se pueda entrar a la jornada 1
  it('GET / devuelve HTML', async () => {
    const res = await request(app).get('/').redirects(1);
    expect(res.status).toBe(200);
    expect(res.text).toContain('Jornada 1');
  });
});