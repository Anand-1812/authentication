import express from 'express';
import userRouter from "./routes/user.routes.js"
import jwt from "jsonwebtoken"
import adminRouter from "./routes/admin.routes.js";
import { authMiddleWare } from './middlewares/auth.middleware.js';

const app = express();
const PORT = process.env.PORT ?? 6969;

app.use(express.json());
app.use(authMiddleWare);

app.get('/', (req, res) => {
  return res.json({ status: `Server is up and runnning.` });
});

app.use('/users', userRouter);
app.use('/admin', adminRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
