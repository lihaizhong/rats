import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ServerSentEvents } from "./ServerSentEvents.mjs";

/**
 * 获取静态资源地址
 * @params {String} url
 * @returns {String}
 */
function getAssetsPath(url) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const __filepath = url && url !== "/" ? url : "index.html";

  return path.join(__dirname, "../public", __filepath);
}

/**
 * 响应请求数据
 * @param {Request} res
 * @param  {...any} args
 */
function send(res, ...args) {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end(...args);
}

export async function routerFallback(req, res) {
  try {
    const assetsPath = getAssetsPath(req.url);
    const data = await fs.readFile(assetsPath, "binary");

    res.end(data, "binary");
  } catch (ex) {
    console.error("Failed to obtain static resources.", ex);
    send(res, "静态资源读取失败！");
  }
}

export default {
  "/subscribe": (req, res) => {
    const sse = new ServerSentEvents(req, res)

    // Send a message on connection
    sse.connect();

    // Send a subsequent message every five seconds
    setInterval(() => {
      sse.send(new Date().toLocaleString());
    }, 5000);

    // Close the connection when the client disconnects
    req.on("close", () => sse.close());
  }
};
