# Syncro

Proyecto universitario para la gestión de canchas, partidos, equipos y torneos. Frontend en React + TypeScript y backend en Node + TypeScript.

## Tecnologías usadas

- **Frontend:** React, TypeScript, Vite, React Router DOM
- **Backend:** Node.js, TypeScript, Express, CORS, dotenv

## Instalación

Cloná el repositorio e instalá las dependencias de cada carpeta por separado.

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

Copiá el archivo `.env.example` a `.env` en cada carpeta (`frontend` y `backend`) y completá las variables correspondientes.

## Ejecución

### Frontend

```bash
cd frontend
npm run dev
```

### Backend

```bash
cd backend
npm run dev
```

## Flujo de Git

- La rama `develop` es la rama base de desarrollo.
- Cada nueva funcionalidad se trabaja en una rama propia a partir de `develop`, con el prefijo `feature/` (por ejemplo, `feature/login`).
- Al terminar, se abre un Pull Request contra `develop` para su revisión antes de mergear.
- La rama `main` se reserva para versiones estables del proyecto.
