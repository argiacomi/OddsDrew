const compression = require('compression');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Import routes
const oddsRoutes = require('./routes/odds');

app.use(helmet()); // Enable Helemt HTTP headers for security
app.use(cors()); // Enable Cross Origin Resource Sharing to all origins by default
app.use(compression()); //Attempts to compress response bodies for all request
app.use(express.json()); // JSONify the string of req.body
app.use(express.urlencoded({ extended: true }));
app.use('/odds', oddsRoutes); // Use odds routes for all odds request

const expressLoader = app;

const startServer = async () => {
  expressLoader.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
};

startServer();
