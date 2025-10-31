import express from "express";
import quoteRoutes from "./routes/quoteRoutes";

const app = express();

app.use(express.json());
app.use('/api', quoteRoutes);

export {app};