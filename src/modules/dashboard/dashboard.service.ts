import { eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { records } from "../../db/schema.js";

export class DashboardService {
  static async getSummary(userId: number, role: string) {
    const condition = role === "ADMIN" ? sql`1=1` : eq(records.userId, userId);

    const data = await db
      .select({
        type: records.type,
        total: sql<number>`SUM(CAST(${records.amount} AS NUMERIC))`,
      })
      .from(records)
      .where(condition)
      .groupBy(records.type);

    let totalIncome = 0;
    let totalExpense = 0;

    data.forEach((row) => {
      if (row.type === "INCOME") totalIncome += Number(row.total);
      if (row.type === "EXPENSE") totalExpense += Number(row.total);
    });

    const categoryData = await db
      .select({
        category: records.category,
        total: sql<number>`SUM(CAST(${records.amount} AS NUMERIC))`,
      })
      .from(records)
      .where(condition)
      .groupBy(records.category);

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryWiseTotals: categoryData,
    };
  }

  static async getTrends(userId: number, role: string) {
    const condition = role === "ADMIN" ? sql`1=1` : eq(records.userId, userId);

    const trends = await db
      .select({
        month: sql<string>`TO_CHAR(${records.date}, 'YYYY-MM')`,
        type: records.type,
        total: sql<number>`SUM(CAST(${records.amount} AS NUMERIC))`,
      })
      .from(records)
      .where(condition)
      .groupBy(sql`TO_CHAR(${records.date}, 'YYYY-MM')`, records.type)
      .orderBy(sql`TO_CHAR(${records.date}, 'YYYY-MM')`);

    return trends;
  }
}
