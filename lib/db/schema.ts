import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccount } from "@auth/core/adapters";

/**
 * Tabela de Usuários (Users)
 * Armazena informações básicas dos usuários do sistema.
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(), // Alterado para UUID
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  password: text('password'),
})

/**
 * Tabela de Contas (Accounts)
 * Usada principalmente para o NextAuth.js, ligando provedores OAuth ao usuário.
 */
export const accounts = pgTable(
  'accounts',
  {
    userId: uuid('user_id') // Alterado para UUID
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index('accounts_userId_idx').on(account.userId),
  }),
)

/**
 * Tabela de Sessões (Sessions)
 * Armazena as sessões ativas dos usuários, também usada pelo NextAuth.js.
 */
export const sessions = pgTable(
  'sessions',
  {
    sessionToken: text('session_token').notNull().primaryKey(),
    userId: uuid('user_id') // Alterado para UUID
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (session) => ({
    userIdIdx: index('sessions_userId_idx').on(session.userId),
  }),
)

/**
 * Tabela de Tokens de Verificação (Verification Tokens)
 * Usada para processos como "magic link" de login ou verificação de e-mail.
 */
export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)
// RELAÇÕES (RELATIONS)
// Define como as tabelas se conectam, permitindo queries complexas.
// =================================================================

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
