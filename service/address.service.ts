// src/services/address.service.ts
import { Adress } from "../lib/db/schema";
import { BaseService } from "./base.service";

class AddressService extends BaseService<typeof Adress.$inferSelect> {
  constructor() {
    super(Adress);
  }
}

export const addressService = new AddressService();
