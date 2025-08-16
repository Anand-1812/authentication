import express from "express";
import db from "../db/index.js";
import { usersSessions, usersTable } from "../db/schema.js";
import { createHmac, randomBytes } from "crypto";
import { eq } from "drizzle-orm";

const router = express.Router();

router.get('/', async (req, res) => {
  const sessionId = req.headers['session-id'];
  if (!sessionId) {
    return res.status(401).json({ error: `You are not logged in.` });
  }

  const [data] = await db
    .select({
      sessionId: usersSessions.id,
      userId: usersSessions.userId,
      name: usersTable.name,
      email: usersTable.email
    })
    .from(usersSessions)
    .rightJoin(usersTable, eq(usersTable.id, usersSessions.userId))
    .where(eq(usersSessions.id, sessionId));

  if (!data) {
    return res.status(401).json({ error: `You are not logged in.` });
  }

  return res.json({ data })
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

  const [session] = await db
    .insert(usersSessions)
    .values({
      userId: existingUser.id,
    }).returning({ id: usersSessions.id });

  return res.status(201).json({ status: 'success', sessionId: session.id });
})


export default router

