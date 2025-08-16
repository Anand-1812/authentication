import express from 'express';
import userRouter from "./routes/user.routes.js"

const app = express();
const PORT = process.env.PORT ?? 6969;

app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ status: `Server is up and runnning.` });
});

app.use('/users', userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
