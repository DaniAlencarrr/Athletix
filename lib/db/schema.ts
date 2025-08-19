import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { desc, relations } from "drizzle-orm";
import type { AdapterAccount } from "@auth/core/adapters";
import { he } from "zod/v4/locales";

/* Tabela de Permissões (Permissions) */
export const permissions = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey(), 
  name: text('name').notNull(),
  description: text('description').notNull(),
})

/* Tabela de Usuários (Users) */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(), // Alterado para UUID
  name: text('name'),
  email: text('email').unique(),
  password: text('password'),
  profile_picture: text('profile_picture').notNull().default(''),
  dateOfBirth: timestamp('date_of_birth', { mode: 'string' }).notNull(), // preenchar depois de criar o usuário
  phone: text('phone').notNull().default(''),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().$onUpdateFn(() => new Date().toISOString()),
  permissionId: uuid('permission_id')
    .notNull() //  1 = admin, 2 = Athlete, 3 = Coach
    .references(() => permissions.id, { onDelete: 'set null' }), 
  description: text('description'),
  isActive: integer('is_active').default(1), 
  isDeleted: integer('is_deleted').default(0)
})
 
/* Tabela de Contas (Accounts) */
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

/* Tabela de Endereço (Adress) */
export const Adress = pgTable('address', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  street: text('street').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  country: text('country').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().$onUpdateFn(() => new Date().toISOString()),
  }, (address) => ({
    userIdIdx: index('address_userId_idx').on(address.userId),
}));


/* Tabela de Treinamento (Coach) */
export const coach = pgTable('coach', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  expertise: text('expertise'),
  availability: text('availability'),
  hourlyRate: integer('hourly_rate').notNull(),
  certifications: text('certifications'),
  }, (coach) => ({
    userIdIdx: index('coach_userId_idx').on(coach.userId),
}));

/* Tabela de Esporte (Sport) */
export const sport = pgTable('sport', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  isDeleted: integer('is_deleted').default(0),
  }, (sport) => ({
    nameIdx: index('sport_name_idx').on(sport.name),
}));

/* Tabela de Perfil de Saúde (healthProfile) */ // Validar antes de criar
// export const healthProfile = pgTable('health_profile', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   userId: uuid('user_id').notNull(),
//   height: integer('height'), // em cm
//   weight: integer('weight'), // em kg
//   bloodType: text('blood_type'),
//   allergies: text('allergies'),
//   medicalConditions: text('medical_conditions'),
//   medications: text('medications'),
//   emergencyContact: text('emergency_contact'),
//   }, (healthProfile) => ({
//     userIdIdx: index('health_profile_userId_idx').on(healthProfile.userId),
// }));

/* Tabela de Atleta (Athlete) */
export const athlete = pgTable('athlete', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sportId: uuid('sport_id').notNull()
    .references(() => sport.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  height: integer('height'), // em cm
  weight: integer('weight'), // em kg
  level: text('level'),
  // healthStatus: text('health_status'),
  trainingSchedule: text('training_schedule'),
  injuryHistory: text('injury_history'),
  performanceMetrics: text('performance_metrics'),
  trainingGoals: text('training_goals'),
  }, (athlete) => ({
    userIdIdx: index('athlete_userId_idx').on(athlete.userId),
}));




/**
 * Tabela de Tokens de Verificação (Verification Tokens)
 * Usada para processos como "magic link" de login ou verificação de e-mail.
 */

// RELAÇÕES (RELATIONS)
// Define como as tabelas se conectam, permitindo queries complexas.
// // =================================================================

// export const usersRelations = relations(users, ({ many }) => ({
//   accounts: many(accounts),
//   sessions: many(sessions),
// }));

// export const accountsRelations = relations(accounts, ({ one }) => ({
//   user: one(users, {
//     fields: [accounts.userId],
//     references: [users.id],
//   }),
// }));

// export const sessionsRelations = relations(sessions, ({ one }) => ({
//   user: one(users, {
//     fields: [sessions.userId],
//     references: [users.id],
//   }),
// }));
