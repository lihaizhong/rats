import http from "node:http";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Router from "find-my-way";
import { ServerSentEvents } from "./sse.mjs";

const router = new Router();
const port = 10086

router.on("GET", "/subscribe", (req, res) => {
  const sse = new ServerSentEvents(req, res);
  // Send a message on connection
  sse.connect();
  // Send a subsequent message every five seconds
  setInterval(() => {
    sse.send(new Date().toLocaleString());
  }, 5000);
  // Close the connection when the client disconnects
  req.on("close", () => sse.close());
});

router.on("GET", "/pages/*", async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const assetsPath = path.join(__dirname, "..", req.url);
    const data = await fs.readFile(assetsPath, "binary");

    res.end(data, "binary");
  } catch (ex) {
    console.error("Failed to obtain static resources.", ex);
    res.setHeader("Content-Type", "text/html;charset=utf-8");
    res.end("静态资源读取失败！");
  }
});

const server = http.createServer(async (req, res) => {
  router.lookup(req, res);
});

server.listen(port, () => {
  console.log(`Server started at ${port}`);
});
