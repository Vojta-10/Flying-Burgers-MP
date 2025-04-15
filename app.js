require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const path = require('path');

const cors = require('cors');
app.use(
  cors({
    origin: 'https://flyingburgers.onrender.com',
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
app.use('/order', orderAuth, orderRouter);
app.use('/user', orderAuth, userRouter);

app.use(express.static('./public'));

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

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
