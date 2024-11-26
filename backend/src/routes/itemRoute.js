import express from "express";

import * as roomController from "../controllers/roomController.js";

const router = express.Router();

router.get("/", roomController.getItems);
router.post("/", roomController.createItem);
router.delete("/:id", roomController.deleteItem);
// TODO3: add a router for the filter function

export default router;
