// src/services/athlete.service.ts
import { athlete } from "../lib/db/schema";
import { BaseService } from "./base.service";

class AthleteService extends BaseService<typeof athlete.$inferSelect> {
  constructor() {
    super(athlete);
  }
}

export const athleteService = new AthleteService();
