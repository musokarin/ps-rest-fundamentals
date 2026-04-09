import express from "express";
import { getOrderDetail, getOrders, upsertOrder } from "./orders.service";
import { idUUIDRequestSchema, orderPOSTRequestSchema, pagingRequestSchema } from "../types";
import { validate } from "../../middleware/validation.middleware";

export const ordersRouter = express.Router();

ordersRouter.get("/", validate(pagingRequestSchema), async (req, res) => {
  const data = pagingRequestSchema.parse(req);
  const orders = await getOrders(data.query.skip, data.query.take);
  res.json(orders);
});

ordersRouter.get("/:id", validate(idUUIDRequestSchema), async (req, res) => {
  const data = idUUIDRequestSchema.parse(req);
  const order = await getOrderDetail(data.params.id);
  res.json(order);
});

ordersRouter.post("/", validate(orderPOSTRequestSchema), async (req, res) => {
  const data = orderPOSTRequestSchema.parse(req);
  const order = await upsertOrder(data.body);
  if (order != null) {
    res.status(201).json(order);
  } else {
    res.status(500).json({ message: "Failed to create order" });
  }
});