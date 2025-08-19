// src/services/coach.service.ts
import { coach } from "../lib/db/schema";
import { BaseService } from "./base.service";

class CoachService extends BaseService<typeof coach.$inferSelect> {
  constructor() {
    super(coach);
  }
}

export const coachService = new CoachService();
