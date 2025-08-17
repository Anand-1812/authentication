import express from "express";
import db from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { ensureAuth, restrcitToRole } from "../middlewares/auth.middleware.js";

const router = express();

const adminRestrictMiddleWare = restrcitToRole('ADMIN');

router.get('/users', ensureAuth, adminRestrictMiddleWare, async (req, res) => {

  const users = await db.select({
    id: usersTable.id,
    email: usersTable.email,
    name: usersTable.name,
  }).from(usersTable);

  return res.json({ users });
})

export default router

