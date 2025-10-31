#!/usr/bin/env bash
set -euo pipefail

# Instala dependencias mínimas para servidor Express con TypeScript y pruebas con Jest + Supertest

echo "Instalando dependencias de producción..."
npm install express ejs

echo "Instalando dependencias de desarrollo..."
npm install -D typescript ts-node ts-node-dev jest ts-jest @types/jest supertest @types/supertest @types/express @types/node

echo "Instalación completa. Puedes ejecutar: npm run dev"