import http from "node:http";
import config from "./config.mjs";
import router, { routerFallback } from "./router.mjs";

const server = http.createServer(async (request, response) => {
  // 查询路由
  const routerCallback = router[request.url];

  if (typeof routerCallback === "function") {
    // 执行预设方案
    routerCallback(request, response);
  } else {
    // 执行降级方案
    routerFallback(request, response);
  }
});

server.listen(config.PORT, () => {
  console.log(`Server started at ${config.PORT}`);
});
