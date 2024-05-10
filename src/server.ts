import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as env from "dotenv";
import session from 'express-session';
import RedisStore from "connect-redis";



import routes from "./routes/index";
import errorHandler from "./middleware/application/errorHandler";
import notFoundHandler from "./middleware/application/notFoundHandler";
import { connectDB, redisClient } from "./db/connect";
import logger from "./utils/logger";
import config from "./config";
import { limiter } from "./middleware/application/rateLimit";

env.config();

const app = express();
const server = http.createServer(app);

// app.set("trust proxy", true);

app.use(cors());
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
      store: new RedisStore({ client: redisClient }),
      secret: config.app.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
          secure: false,
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
      },
  })
)

app.use(limiter);
app.use('/api', routes);
app.use(errorHandler);
app.use(notFoundHandler);




const startServer = async () => {
  (global as any).isStartingUp = true;

  server.listen(config.app.port, () => {
    logger.info(
      `! Server Started and Listening on Port: ${config.app.port} with PID: ${process.pid}`
    );
    (global as any).isStartingUp = false;
  });
};

const start = async () => {
  try {
    await startServer();
    await connectDB();
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};
start();
export default app;
