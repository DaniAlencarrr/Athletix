import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  decimal,
  date,
  primaryKey,
  text,
  timestamp,
  uuid,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";

export const roleEnum = pgEnum("role", ["athlete", "coach"]);

/**
 * Tabela de Usuários (Users)
 * Armazena informações básicas dos usuários do sistema.
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  role: roleEnum("role"),
  birthDate: date("birth_date"),
  bio: text("bio"),
});

/**
 * Tabela de Contas (Accounts)
 * Usada pelo NextAuth.js para vincular provedores OAuth aos usuários.
 */
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("accounts_userId_idx").on(account.userId),
  })
);

/**
 * Tabela de Sessões (Sessions)
 * Armazena as sessões ativas dos usuários para o NextAuth.js.
 */
export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").notNull().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("sessions_userId_idx").on(session.userId),
  })
);

/**
 * Tabela de Tokens de Verificação (Verification Tokens)
 * Usada para "magic links" de login ou verificação de e-mail.
 */
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  street: text("street"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country"),
});

/**
 * Tabela de Detalhes do Treinador (CoachDetails)
 * Informações específicas para usuários com o papel 'coach'. Relação 1-para-1.
 */
export const coachDetails = pgTable("coach_details", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  experience: text("experience"),
  // Usar decimal para valores monetários é mais seguro que float.
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  certifications: text("certifications"),
});

/**
 * Tabela de Detalhes do Atleta (AthleteDetails)
 * Informações específicas para usuários com o papel 'athlete'. Relação 1-para-1.
 */
export const athleteDetails = pgTable("athlete_details", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  sport: text("sport"),
  height: integer("height"), // em cm
  weight: integer("weight"), // em kg
  injuryHistory: text("injury_history"),
});

/**
 * Tabela de Esporte (Sport)
 * Adicionada para que a tabela Athlete tenha uma referência válida.
 */
export const sport = pgTable("sport", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
});

/**
 * Tabela de Endereço (Address)
 * CORRIGIDO: Adicionado a referência obrigatória para users.id
 */
// export const address = pgTable(
//   "address",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),
//     userId: uuid("user_id")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }), // Chave estrangeira corrigida
//     street: text("street").notNull(),
//     city: text("city").notNull(),
//     state: text("state").notNull(),
//     zipCode: text("zip_code").notNull(),
//     country: text("country").notNull(),
//     updatedAt: timestamp("updated_at", { mode: "string" })
//       .defaultNow()
//       .$onUpdateFn(() => new Date().toISOString()),
//   },
//   (address) => ({
//     userIdIdx: index("address_userId_idx").on(address.userId),
//   })
// );

/**
 * Tabela de Treinador (Coach)
 * Sem alterações, já estava correta.
 */
// export const coach = pgTable(
//   "coach",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),
//     userId: uuid("user_id")
//       .notNull()
//       .unique() // Adicionado unique para garantir 1-para-1
//       .references(() => users.id, { onDelete: "cascade" }),
//     bio: text("bio"),
//     expertise: text("expertise"),
//     availability: text("availability"),
//     hourlyRate: integer("hourly_rate").notNull(),
//     certifications: text("certifications"),
//   },
//   (coach) => ({
//     userIdIdx: index("coach_userId_idx").on(coach.userId),
//   })
// );

/**
 * Tabela de Atleta (Athlete)
 * Sem alterações, já estava correta.
 */
// export const athlete = pgTable(
//   "athlete",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),
//     userId: uuid("user_id")
//       .notNull()
//       .unique() // Adicionado unique para garantir 1-para-1
//       .references(() => users.id, { onDelete: "cascade" }),
//     sportId: uuid("sport_id")
//       .notNull()
//       .references(() => sport.id, { onDelete: "cascade" }),
//     bio: text("bio"),
//     height: integer("height"), // em cm
//     weight: integer("weight"), // em kg
//     level: text("level"),
//     trainingSchedule: text("training_schedule"),
//     injuryHistory: text("injury_history"),
//     performanceMetrics: text("performance_metrics"),
//     trainingGoals: text("training_goals"),
//   },
//   (athlete) => ({
//     userIdIdx: index("athlete_userId_idx").on(athlete.userId),
//   })
// );

// --- Relações (Relations) ---
// Define como as tabelas se conectam, permitindo queries complexas.

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),

  // Um usuário tem um endereço (relação one-to-one)
  // address: one(address, {
  //   fields: [users.id],
  //   references: [address.userId],
  // }),

  // Um usuário pode ter um perfil de atleta (relação one-to-one)
  // athleteProfile: one(athlete, {
  //   fields: [users.id],
  //   references: [athlete.userId],
  // }),

  // Um usuário pode ter um perfil de treinador (relação one-to-one)
  // coachProfile: one(coach, {
  //   fields: [users.id],
  //   references: [coach.userId],
  // }),
}));

// Relação do Endereço de volta para o Usuário
// export const addressRelations = relations(address, ({ one }) => ({
//   user: one(users, {
//     fields: [address.userId],
//     references: [users.id],
//   }),
// }));

// Relação do Atleta de volta para o Usuário e para o Esporte
// export const athleteRelations = relations(athlete, ({ one }) => ({
//   user: one(users, {
//     fields: [athlete.userId],
//     references: [users.id],
//   }),
//   sport: one(sport, {
//     fields: [athlete.sportId],
//     references: [sport.id],
//   }),
// }));

// Relação do Treinador de volta para o Usuário
// export const coachRelations = relations(coach, ({ one }) => ({
//   user: one(users, {
//     fields: [coach.userId],
//     references: [users.id],
//   }),
// }));

// Relação do Esporte para muitos Atletas
// export const sportRelations = relations(sport, ({ many }) => ({
//   athletes: many(athlete),
// }));

// Relações do NextAuth (já estavam corretas)
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
