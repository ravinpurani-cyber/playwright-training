import { test as base } from '@playwright/test';
import { Client } from 'pg';

type DbFixtures = {
  db: Client;
};

export const test = base.extend<DbFixtures>({
  db: async ({}, use) => {
    // Setup — create and connect DB client
    const client = new Client({
      host:     process.env.DB_HOST,
      port:     Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await client.connect();

    // Begin transaction — all changes will be rolled back after test
    await client.query('BEGIN');

    // Hand DB client to test
    await use(client);

    // Cleanup — rollback all changes made during test
    await client.query('ROLLBACK');
    await client.end();
  },
});

export { expect } from '@playwright/test';