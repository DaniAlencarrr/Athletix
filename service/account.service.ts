// src/services/account.service.ts
import { accounts } from "../lib/db/schema";
import { BaseService } from "./base.service";

type AccountWithId = typeof accounts.$inferSelect & { id: string };

class AccountService extends BaseService<AccountWithId> {
  constructor() {
    super(accounts);
  }
}

export const accountService = new AccountService();
