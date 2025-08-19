// src/services/sport.service.ts
import { sport } from "../lib/db/schema";
import { BaseService } from "./base.service";

class SportService extends BaseService<typeof sport.$inferSelect> {
  constructor() {
    super(sport);
  }

  async softDelete(id: string) {
    return await this.update(id, { isDeleted: 1 });
  }
}

export const sportService = new SportService();
