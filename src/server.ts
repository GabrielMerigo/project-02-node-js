import fastify from "fastify";
import crypto from "node:crypto";
import { knex } from "./database";

const app = fastify();

app.get("/hello", async () => {
  const transactions = await knex("transactions")
    .where("amount", 500)
    .select("*");

  return transactions;
});

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log("Server running!");
  });