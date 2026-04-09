import express from "express";
import { getCustomerDetail, getCustomers, searchCustomers, upsertCustomer } from "./customers.service";
import { getOrdersForCustomer } from "../orders/orders.service";
import { customerPOSTRequestSchema, idUUIDRequestSchema } from "../types";
import { validate } from "../../middleware/validation.middleware";

export const customersRouter = express.Router();

customersRouter.get("/", async (req, res) => {
  const customers = await getCustomers();
  res.json(customers);
});

customersRouter.get("/:id", validate(idUUIDRequestSchema), async (req, res) => {
  const data = idUUIDRequestSchema.parse(req);
  const customer = await getCustomerDetail(data.params.id);
  res.json(customer);
});

customersRouter.get("/:id/orders", async (req, res) => {
  const id = req.params.id;
  const orders = await getOrdersForCustomer(id);
  res.json(orders);
});

customersRouter.get("/search:query", async (req, res) => {
  const query = req.params.query;
  const customer = await searchCustomers(query);
    res.json(customer);
});

customersRouter.post("/", validate(customerPOSTRequestSchema), async (req, res) => {
  const data = customerPOSTRequestSchema.parse(req);
  const customer = await upsertCustomer(data.body);
  if (customer != null) {
    res.status(201).json(customer);
  } else {
    res.status(500).json({ message: "Failed to create customer" });
  }
});