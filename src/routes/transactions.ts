import { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import { z } from "zod";
import { knex } from "../database";

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.get("/", async () => {
    const transactions = await knex("transactions").select("*");

    return {
      transactions,
    };
  });

  app.get("/:id", async (req) => {
    const getTransactionParams = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionParams.parse(req.params);

    const transaction = await knex("transactions").where("id", id).first();

    return {
      transaction,
    };
  });

  app.post("/", async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { amount, title, type } = createTransactionBodySchema.parse(req.body);

    await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
    });

    return res.status(201).send();
  });
};
