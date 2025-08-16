import express from "express";
import db from "../db/index.js";
import usersTable from "../db/schema.js";
import { createHmac, randomBytes } from "crypto";
import { eq } from "drizzle-orm";

const router = express.Router();

router.get('/', (req, res) => { });
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  const [existingUser] = await db
    .select({
      email: usersTable.email
    })
    .from(usersTable)
    .where((table) => eq(table.email, email));

  if (existingUser) {
    return res.status(400).json({ error: `user with email ${email} already exists.` })
  }

  const salt = randomBytes(256).toString('hex');
  const hashedPass = createHmac('sha256', salt)
    .update(password).digest('hex');

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashedPass,
      salt
    }).returning({ id: usersTable.id });

  return res.status(201).json({ status: `success`, data: { userId: user.id } });
});

export default router

