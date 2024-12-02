import http from "node:http";
import config from "./config.mjs";
import routes, { assetsCallback } from "./router.mjs";

const server = http.createServer(async (request, response) => {
  // 查询路由
  const requestCallback = routes[request.url];

  if (typeof requestCallback === "function") {
    // 执行预设方案
    requestCallback(request, response);
  } else {
    // 执行降级方案
    assetsCallback(request, response);
  }
});

server.listen(config.PORT, () => {
  console.log(`Server started at ${config.PORT}`);
});
