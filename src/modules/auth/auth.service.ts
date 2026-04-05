import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { env } from "../../configs/env.js";
import { ApiError } from "../../utils/ApiError.js";

export class AuthService {
  static async register(data: any) {
    const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    
    if (existingUser.length > 0) {
      throw new ApiError(400, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const [newUser] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || "VIEWER",
    }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    });

    return newUser;
  }

  static async login(data: any) {
    const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);

    if (!user || user.status === "INACTIVE") {
      throw new ApiError(401, "Invalid email or password, or user is inactive");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
