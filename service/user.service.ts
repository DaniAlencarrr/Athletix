// src/services/user.service.ts
import { users, permissions } from "../lib/db/schema";
import { db } from "../lib/db/db";
import { eq } from "drizzle-orm";
import { BaseService } from "./base.service";

class UserService extends BaseService<typeof users.$inferSelect> {
  constructor() {
    super(users);
  }

async findByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0]; 
}

  async activateUser(id: string) {
    return await this.update(id, { isActive: 1 });
  }

    async createUser(userData: Partial<typeof users.$inferInsert>) {
    // Buscar o UUID da permissão "Common User"
    const [commonPermission] = await db
      .select()
      .from(permissions)
      .where(eq(permissions.name, "Common User"));

    if (!commonPermission) {
      throw new Error("Permissão 'Common User' não encontrada");
    }

    if (!userData.dateOfBirth) {
      throw new Error("O campo 'dateOfBirth' é obrigatório.");
    }

    const userToInsert = {
      ...userData,
      dateOfBirth: '',
      permissionId: commonPermission.id, // define permissão padrão
      isActive: 1,
      isDeleted: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const [newUser] = await db.insert(users).values(userToInsert).returning();
    return newUser;
  }
}

export const userService = new UserService();
