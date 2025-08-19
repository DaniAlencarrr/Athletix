import { eq } from "drizzle-orm";
import { db } from "../lib/db/db";

export class BaseService<T extends { id: string }> {
  constructor(private table: any) {}

  async create(data: Omit<T, "id">) {
    const [newItem] = await db.insert(this.table).values(data).returning();
    return newItem;
  }

  async findAll() {
    return await db.select().from(this.table);
  }

  async findById(id: string) {
    const [item] = await db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id));
    return item;
  }

  async update(id: string, data: Partial<T>) {
    const [updated] = await db
      .update(this.table)
      .set(data)
      .where(eq(this.table.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    const [deleted] = await db
      .delete(this.table)
      .where(eq(this.table.id, id))
      .returning();
    return deleted;
  }
}
