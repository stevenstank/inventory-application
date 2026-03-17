# Inventory Application

A beginner-friendly inventory management app built with Express, EJS, and PostgreSQL.

## Features

- Category CRUD
- Item CRUD
- Admin password check for update and delete actions
- Inline error messages for wrong admin password and delete restrictions
- PostgreSQL database connection using environment variables
- Production-ready port and database SSL handling

## Tech Stack

- Node.js
- Express
- EJS
- PostgreSQL (`pg`)

## Project Structure

```text
inventory-application/
	controllers/
	routes/
	views/
	public/
	db.js
	index.js
	schema.sql
```

## Prerequisites

- Node.js 18+ (recommended)
- npm
- PostgreSQL database (local or hosted, for example Neon)

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```dotenv
DATABASE_URL=your_postgresql_connection_string
ADMIN_PASSWORD=your_admin_password
PORT=3000
NODE_ENV=development
```

Notes:
- `DATABASE_URL` is required.
- `ADMIN_PASSWORD` is required for protected update/delete forms.
- `PORT` is optional (defaults to `3000`).
- In production (`NODE_ENV=production`), DB SSL is enabled automatically.

## Database Setup

Run the SQL from `schema.sql` in your PostgreSQL database.

Tables created:
- `categories`
- `items` (with foreign key to `categories`)

## Run the App

Development:

```bash
npm run dev
```

Production/local start:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## Deployment Notes

- The app uses `process.env.PORT || 3000`.
- The app uses `process.env.DATABASE_URL` for PostgreSQL.
- In production, PostgreSQL SSL is enabled with `rejectUnauthorized: false`.
- Do not commit your `.env` file.

## Available Scripts

- `npm start` - Run the app with Node
- `npm run dev` - Run the app with Nodemon
- `npm test` - Placeholder test script