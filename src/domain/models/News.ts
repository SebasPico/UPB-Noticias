export interface News {
  id: string;
  title: string; // Nombre de la noticia
  students: string; // Nombres de los estudiantes (separados por comas)
  professor: string; // Nombre del profesor
  jornada: 1 | 2 | 3;
  subject: string; // Asignatura del proyecto
  content: string; // Información de la noticia
  comments: string; // Comentarios de los docentes
  imageFilename?: string; // Nombre de archivo de la imagen en /public/images
  publishedAt: Date;
}