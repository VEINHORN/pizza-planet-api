import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Order, type Pizza } from "../service/Order.ts";
import { ordersTable, orderItemTable } from "../db/schema.ts";
import { and, eq } from "drizzle-orm";

export class OrderRepository {
  private readonly db: NodePgDatabase;

  constructor(db: NodePgDatabase) {
    this.db = db;
  }

  async save(order: Order): Promise<Order> {
    return await this.db.transaction(async (tx) => {
      const result = await tx
        .insert(ordersTable)
        .values({
          country_code: order.countryCode,
          address: order.address,
          final_price: Math.round(order.finalPrice ?? 0),
          status: order.status,
        })
        .returning();

      const savedOrderRow = result[0];

      if (order.pizzas && order.pizzas.length > 0) {
        await tx.insert(orderItemTable).values(
          order.pizzas.map((p) => ({
            name: p.name,
            size: p.size,
            quantity: p.quantity,
            order_id: savedOrderRow.id,
          })),
        );
      }

      return new Order(
        savedOrderRow.country_code,
        order.pizzas,
        savedOrderRow.address,
        savedOrderRow.final_price,
        savedOrderRow.created_at?.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }) ?? undefined,
        savedOrderRow.id,
        savedOrderRow.status,
      );
    });
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const rows = await this.db
      .select({
        order: ordersTable,
        item: orderItemTable,
      })
      .from(ordersTable)
      .where(eq(ordersTable.id, orderId))
      .leftJoin(orderItemTable, eq(ordersTable.id, orderItemTable.order_id));

    if (rows.length === 0) return null;

    const orderRow = rows[0].order;
    const pizzas: Pizza[] = rows
      .filter((r) => r.item !== null)
      .map((r) => ({
        name: r.item!.name ?? "",
        size: r.item!.size as "SMALL" | "LARGE",
        quantity: r.item!.quantity ?? 0,
      }));

    return new Order(
      orderRow.country_code,
      pizzas,
      orderRow.address,
      orderRow.final_price,
      orderRow.created_at?.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }) ?? undefined,
      orderRow.id,
      orderRow.status,
    );
  }

  async getAllOrders(): Promise<Order[]> {
    const rows = await this.db
      .select({
        order: ordersTable,
        item: orderItemTable,
      })
      .from(ordersTable)
      .leftJoin(orderItemTable, eq(ordersTable.id, orderItemTable.order_id));

    const ordersMap = new Map<string, { orderRow: any; pizzas: Pizza[] }>();

    for (const row of rows) {
      const orderId = row.order.id;
      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, { orderRow: row.order, pizzas: [] });
      }
      if (row.item) {
        ordersMap.get(orderId)!.pizzas.push({
          name: row.item.name ?? "",
          size: row.item.size as "SMALL" | "LARGE",
          quantity: row.item.quantity ?? 0,
        });
      }
    }

    return Array.from(ordersMap.values()).map(
      ({ orderRow, pizzas }) =>
        new Order(
          orderRow.country_code,
          pizzas,
          orderRow.address,
          orderRow.final_price,
          orderRow.created_at?.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }) ?? undefined,
          orderRow.id,
          orderRow.status,
        ),
    );
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await this.db
      .update(ordersTable)
      .set({ status })
      .where(eq(ordersTable.id, orderId));
  }

  async markOrderAsStale(orderId: string): Promise<boolean> {
    const updatedOrders = await this.db
      .update(ordersTable)
      .set({ status: "STALE" })
      .where(and(eq(ordersTable.id, orderId), eq(ordersTable.status, "PENDING")))
      .returning({ id: ordersTable.id });

    return updatedOrders.length > 0;
  }

  async findPendingOrdersByPizzaType(pizzaType: string): Promise<Order[]> {
    const rows = await this.db
      .select({
        order: ordersTable,
        item: orderItemTable,
      })
      .from(ordersTable)
      .innerJoin(orderItemTable, eq(ordersTable.id, orderItemTable.order_id))
      .where(eq(ordersTable.status, "PENDING"));

    const ordersMap = new Map<string, { orderRow: any; pizzas: Pizza[] }>();

    for (const row of rows) {
      const orderId = row.order.id;
      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, { orderRow: row.order, pizzas: [] });
      }
      if (row.item) {
        ordersMap.get(orderId)!.pizzas.push({
          name: row.item.name ?? "",
          size: row.item.size as "SMALL" | "LARGE",
          quantity: row.item.quantity ?? 0,
        });
      }
    }

    return Array.from(ordersMap.values())
      .filter(({ pizzas }) => pizzas.some((p) => p.name === pizzaType))
      .map(
        ({ orderRow, pizzas }) =>
          new Order(
            orderRow.country_code,
            pizzas,
            orderRow.address,
            orderRow.final_price,
            orderRow.created_at?.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            }) ?? undefined,
            orderRow.id,
            orderRow.status,
          ),
      );
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.db.delete(ordersTable).where(eq(ordersTable.id, orderId));
  }
}
