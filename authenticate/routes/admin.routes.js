import express from "express";
import db from "../db/index.js";
import { usersTable } from "../db/schema.js";

const router = express();

router.get('/users', async (req, res) => {

  if (!req.header) {
    return res.status(401).json({ error: `You must be authenticated to access this.` })
  }

  const users = await db.select({
    id: usersTable.id,
    email: usersTable.email,
    name: usersTable.name,
  }).from(usersTable);

  return res.json({ users });
})

export default router

