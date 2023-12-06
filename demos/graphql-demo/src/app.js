import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { PORT } from "./config";
import rootSchema from "./schemas/root";

const app = express();

app.use("/graphql", createHandler(rootSchema));

app.get("/", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
