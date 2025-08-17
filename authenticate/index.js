import express from 'express';
import userRouter from "./routes/user.routes.js"
import db from "./db/index.js";
import { eq } from "drizzle-orm";
import { usersSessions, usersTable } from "./db/schema.js";
import { profileEnd } from 'console';
import jwt  from "jsonwebtoken"

const app = express();
const PORT = process.env.PORT ?? 6969;

app.use(express.json());

app.use(async function(req, res, next) {

  const tokenHeader = req.headers['authorization'];
  if (!tokenHeader ) {
    return next();
  }

  if (!tokenHeader.startsWith('Bearer')) {
    return res.status(400)
      .json({ error: `authorization header must starts with bearer` });
  }

  const token = tokenHeader.split(' ')[1];
  const decode = jwt.verify(token, process.env.JWT_TOKEN);

  req.user = decode;
  next();
});

app.get('/', (req, res) => {
  return res.json({ status: `Server is up and runnning.` });
});

app.use('/users', userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
