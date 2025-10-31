import { buildApp } from './app';

const PORT = 1802;
const app = buildApp();

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}/`);
});