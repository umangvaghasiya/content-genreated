import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './utils/schema.tsx',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_MFrkoUvt0A6n@ep-shiny-hat-anngh8d5.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require',
  },
});
