// src/services/permission.service.ts
import { permissions } from "../lib/db/schema";
import { BaseService } from "./base.service";

class PermissionService extends BaseService<typeof permissions.$inferSelect> {
  constructor() {
    super(permissions);
  }
}

export const permissionService = new PermissionService();
