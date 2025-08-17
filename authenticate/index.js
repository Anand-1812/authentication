import express from 'express';
import userRouter from "./routes/user.routes.js"
import jwt  from "jsonwebtoken"
import adminRouter from "./routes/admin.routes.js"; 

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
app.use('/admin', adminRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
