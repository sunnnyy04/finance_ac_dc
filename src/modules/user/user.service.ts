import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { ApiError } from "../../utils/ApiError.js";

export class UserService {
  static async findAll() {
    return db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
    }).from(users);
  }

  static async updateRole(userId: number, role: "VIEWER" | "ANALYST" | "ADMIN") {
    const [user] = await db.update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        role: users.role,
      });

    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  static async updateStatus(userId: number, status: "ACTIVE" | "INACTIVE") {
    const [user] = await db.update(users)
      .set({ status, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        status: users.status,
      });

    if (!user) throw new ApiError(404, "User not found");
    return user;
  }
}
