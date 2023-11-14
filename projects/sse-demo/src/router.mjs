import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function getAssetsPath(url) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const __filepath = url && url !== "/" ? url : "index.html";

  return path.join(__dirname, "../public", __filepath);
}

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
    console.log("订阅成功！");
    send(res, "订阅成功！");
  },
  "/message": (req, res) => {
    send(res, "hello");
  },
};
