import express from "express";
import db from "../db/index.js";
import { usersSessions, usersTable } from "../db/schema.js";
import { createHmac, randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { ensureAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.patch('/', ensureAuth,  async (req, res) => {
  const { name } = req.body;
  await db.update(usersTable).set({ name }).where(eq(usersTable.id, user.userId));

  return res.json({ status: 'success' });

})

router.get('/', ensureAuth,  async (req, res) => {
  return res.json({ user })
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  const [existingUser] = await db
    .select({
      email: usersTable.email
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const [existingUser] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      role: usersTable.role,
      salt: usersTable.salt,
      password: usersTable.password
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!existingUser) {
    return res.status(404).json({ error: `user with email ${email} does not exists.` })
  }

  const salt = existingUser.salt;
  const existingHash = existingUser.password;

  const newHash = createHmac('sha256', salt).update(password).digest('hex');

  if (newHash != existingHash) {
    return res.status(400).json({ error: `Incorrect password` });
  }

  const payload = {
    id: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
    name: existingUser.name,
  }

  console.log("JWT_SECRET:", process.env.JWT_TOKEN);

  const token = jwt.sign(payload, process.env.JWT_TOKEN);

  return res.json({ status: 'success', token });
})


export default router

