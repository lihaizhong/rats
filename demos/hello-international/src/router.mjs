import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

export async function assetsCallback(req, res) {
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
  "/translate": (req, res) => {}
};
