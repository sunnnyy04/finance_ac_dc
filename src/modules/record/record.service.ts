import { eq, and } from "drizzle-orm";
import { db } from "../../db/index.js";
import { records } from "../../db/schema.js";
import { ApiError } from "../../utils/ApiError.js";

export class RecordService {
  static async create(userId: number, data: any) {
    const [newRecord] = await db.insert(records).values({
      userId,
      amount: data.amount.toString(),
      type: data.type,
      category: data.category,
      date: new Date(data.date),
      notes: data.notes,
    }).returning();
    return newRecord;
  }

  static async findAll(userId: number, role: string) {
    if (role === "ADMIN") {
      return db.select().from(records);
    }
    return db.select().from(records).where(eq(records.userId, userId));
  }

  static async findById(id: number, userId: number, role: string) {
    const [record] = await db.select().from(records).where(eq(records.id, id)).limit(1);

    if (!record) {
      throw new ApiError(404, "Record not found");
    }

    if (role !== "ADMIN" && record.userId !== userId) {
      throw new ApiError(403, "Forbidden: You cannot access this record");
    }

    return record;
  }

  static async update(id: number, userId: number, role: string, data: any) {
    const record = await this.findById(id, userId, role);

    const updateData: any = {};
    if (data.amount !== undefined) updateData.amount = data.amount.toString();
    if (data.type !== undefined) updateData.type = data.type;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.notes !== undefined) updateData.notes = data.notes;
    updateData.updatedAt = new Date();

    const [updatedRecord] = await db.update(records)
      .set(updateData)
      .where(eq(records.id, id))
      .returning();

    return updatedRecord;
  }

  static async delete(id: number, userId: number, role: string) {
    await this.findById(id, userId, role);

    await db.delete(records).where(eq(records.id, id));
    return { success: true };
  }
}
