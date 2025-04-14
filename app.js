require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const cors = require('cors');
app.use(
  cors({
    // origin: 'http://127.0.0.1:5500',
    // methods: ['GET', 'POST', 'PATCH', 'DELETE'], // pro jistotu
    // allowedHeaders: ['Content-Type', 'Authorization'], // ← tohle je klíčové!
  })
);
const orderAuth = require('./middleware/authentication');
// ConnectDB
const connectDB = require('./db/connect');
// Routers
const authRouter = require('./routes/auth');
const orderRouter = require('./routes/orders');
const userRouter = require('./routes/user');
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/', orderAuth, orderRouter);
app.use('/user', orderAuth, userRouter);

app.use(express.static('./public'));

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
