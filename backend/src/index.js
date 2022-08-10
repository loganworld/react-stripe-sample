import express from 'express';

import SERVER_CONFIGS from './constants/server';

import configureServer from './server';
import configureRoutes from './routes';
const cors = require("cors");

const app = express();
app.use(
    cors({
        origin: "*",
        methods: ["POST", "GET"],
    })
);

configureServer(app);
configureRoutes(app);

app.listen(SERVER_CONFIGS.PORT, error => {
  if (error) throw error;
  console.log('Server running on port: ' + SERVER_CONFIGS.PORT);
});
