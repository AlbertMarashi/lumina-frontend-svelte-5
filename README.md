# Lumina

> The city of the future

## Tech Stack

- **Frontend:** [Svelte](https://svelte.dev/)
- **Frontend Framework:** [SvelteKit](https://kit.svelte.dev/)
- **Database:** [SurrealDB](https://surrealdb.com/)
  - **Database Host**: [Railway](https://railway.app/)
- **AI:** [OpenAI](https://openai.com/)
- **Content Management System:** [builder.io](https://builder.io/)
- **Analytics:** [Mixpanel](https://mixpanel.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **Hosting:** [Vercel](https://vercel.com/)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions)
- **Emails:** [SendGrid](https://sendgrid.com/)

## Local Development

### Setting up local database

1. Download and install [SurrealDB](https://surrealdb.com/docs/installation)
   - **MacOS Command**: `brew install surrealdb/tap/surreal`
2. Download and install [Surrealist](https://github.com/StarlaneStudios/Surrealist/releases)
   - This is a open sourced graphical user interface for SurrealDB
3. Open surrealist
   1. Click the `Settings Cog` icon on the sidebar
   2. Go to `Database Serving` tab in the settings dialog
   3. Set storage mode to `File Storage` instead of memory (this will make your local database persist on disk)
   4. Set the file storage path to `/Users/<your-username>/dev-surreal-db`
   5. Set the surrealist executable path to file path returned by `which surreal` in your terminal
   6. Ensure the root user and password are set to `root` and `root` respectively
4. Press the `Play` button to start the local database with that connection
5. Create a connection to your database in the top left
   1. Set the endpoint to `HTTP` with address `localhost:8000`
   2. Set the namespace to `development`
   3. Set the database to `lumina`
   4. Use `Root` authentication mode
   5. Set the root user to `root`
   6. Set the root password to `root`
6. Generate a random secret key with the following command: `openssl rand -hex 32`
7. Run the following SurrealQL code in the `Query` editor sidebar tab, replacing `RANDOM_SECRET_KEY_HEX` with the random secret key you generated:

```sql
DEFINE SCOPE users;
DEFINE TOKEN lumina_token on SCOPE users type HS256 VALUE "RANDOM_SECRET_KEY_HEX";
```

1. Run the following command to import the database schema from `schema.surql` from this project directory

```sh
bun sync
```

1.  You're ready to start the development server

### Starting dev server

1. Install [Bun](https://bun.sh/)
   1. MacOS: `curl -fsSL https://bun.sh/install | bash`
2. Make sure you have installed the dependencies with `bun i`
3. Run `bun run dev`

## `.env` Template

```bash
# ==============
# Stripe Secrets
# ==============
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PUBLIC_STRIPE_PUBLISHABLE_KEY=

# ==============
# Builder.io
# ==============
PUBLIC_BUILDERIO_KEY=

# ==============
# Mixpanel
# ==============
PUBLIC_MIXPANEL_TOKEN=

# =========
# SurrealDB
# =========
SURREAL_USER=root
SURREAL_PASS=root
PUBLIC_SURREAL_HOST=http://localhost:8000
PUBLIC_VITE_VERCEL_GIT_COMMIT_REF=development

# =========
# General Secrets
# =========
# Generate using `openssl rand -hex 32`
# This auth secret must match the lumina_token secret in the database as used above
AUTH_SECRET=
SENDGRID_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_PUBLIC_KEY=
# required for builder.io for some reason
NODE_OPTIONS=--no-node-snapshot
```

## Generate a random secret key with the following command:

```bash
openssl rand -hex 32
```
