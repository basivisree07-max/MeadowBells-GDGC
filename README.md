# Meadowbell Studio

Meadowbell is a small React and Express storefront for original paintings, wall painting bookings, and custom pottery requests. The original landing page remains in `index.html`; the existing customer and studio login controls open the app without changing its visual design. The studio screens are also available at `/studio`.

## Requirements

- Node.js 20 or newer
- PostgreSQL 14 or newer

## Run locally

1. Install packages with `npm install`.
2. Create a PostgreSQL database, for example `createdb meadowbell`.
3. Copy `.env.example` to `.env`. Set `DATABASE_URL` and replace `SESSION_SECRET` with a random value of at least 32 characters.
4. Put your JSON data in `seed/seed.json` using the shape shown by `seed/seed.example.json`. Keep this file private; it can include the studio account password. The app reads it at seed time, and `.gitignore` excludes it.
5. Copy painting images into `public/images/` and use `/images/filename.jpg` in each painting's `imageUrl`. The supplied images are already copied there.
6. Create the tables with `npm run db:setup`.
7. Load the JSON data with `npm run db:seed`. The seed command hashes the studio password before storing it.
8. Start the API and web app with `npm run dev:all`. Open `http://localhost:3000` for the unchanged landing page or `http://localhost:3000/studio` for the studio app.

## Deploy with Docker

The project includes a production Docker image and a Compose stack with PostgreSQL. Copy `.env.example` to `.env`, replace `SESSION_SECRET` and `POSTGRES_PASSWORD` with long random values, and keep the private `seed/seed.json` file in place. Then run:

1. `docker compose up --build -d`
2. `docker compose run --rm app node server/seed.js`
3. Open `http://localhost:8080` (or the port set in `APP_PORT`).

For a public production deployment, run the same containers on a host with a persistent Docker volume and put HTTPS in front of the app. Set `COOKIE_SECURE=true`, use strong session/database secrets from the host's secret manager, and provide the seed JSON as a private mounted file. Do not publish the seed JSON or `.env` file.

Customer accounts are created from the customer sign-up screen. Admin accounts are never created through the website; seed an admin account privately in `seed/seed.json`.

## Checks

- `npm run build` builds the browser app.
- `npm run lint` checks the TypeScript app.
- `npm run api` runs only the API server (port 4000 by default).

Sound effects are synthesized with the Web Audio API in `src/sound.ts`; no external sound files or services are used. Audio starts after the first user gesture and can be muted from the header.
