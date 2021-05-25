const express = require('express');
// connection
require('./database/mongoose');
const postRouter = require('./routers/postRouter.js');
const userRouter = require('./routers/userRouter.js');

const app = express();
const port = process.env.PORT || 3000;

// sample of simple middleware
// app.use((req, res, next) => {
//    res.status(503).send("Maintenance in progress")
// })

// to automatic parse the incoming json as an object so we can easily use it,
// will be parsed in the terminal




app.use(express.json());
app.use(userRouter);
app.use(postRouter);


app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
