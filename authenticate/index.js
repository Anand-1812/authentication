import express from 'express';
import userRouter from "./routes/user.routes.js"
import db from "./db/index.js";
import { eq } from "drizzle-orm";
import { usersSessions, usersTable } from "./db/schema.js";

const app = express();
const PORT = process.env.PORT ?? 6969;

app.use(express.json());

app.use(async function(req, res, next) {
  try {
    const sessionId = req.headers['session-id'];
    if (!sessionId) {
      return next();
    }

    console.log("Looking up session:", sessionId);

    const [data] = await db
      .select({
        sessionId: usersSessions.id,
        userId: usersSessions.userId,
        name: usersTable.name,
        email: usersTable.email
      })
      .from(usersSessions)
      .innerJoin(usersTable, eq(usersTable.id, usersSessions.userId))
      .where(eq(usersSessions.id, sessionId));

    console.log("DB result:", data);

    if (!data) {
      return next();
    }

    req.user = data;
    next();
  } catch (err) {
    console.error("Session middleware error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/', (req, res) => {
  return res.json({ status: `Server is up and runnning.` });
});

app.use('/users', userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
