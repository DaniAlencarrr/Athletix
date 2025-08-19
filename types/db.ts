import { 
  users, 
  permissions, 
  accounts, 
  Adress, 
  coach, 
  sport, 
  athlete 
} from "@/lib/db/schema";

/** Tipos inferidos automaticamente pelo Drizzle */
export type User = typeof users.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Address = typeof Adress.$inferSelect;
export type Coach = typeof coach.$inferSelect;
export type Sport = typeof sport.$inferSelect;
export type Athlete = typeof athlete.$inferSelect;

/** Você pode criar tipos para inserção também */
export type UserInsert = typeof users.$inferInsert;
export type PermissionInsert = typeof permissions.$inferInsert;
export type AccountInsert = typeof accounts.$inferInsert;
export type AddressInsert = typeof Adress.$inferInsert;
export type CoachInsert = typeof coach.$inferInsert;
export type SportInsert = typeof sport.$inferInsert;
export type AthleteInsert = typeof athlete.$inferInsert;
