export class ServerSentEvents {
  constructor(req, res) {
    this.request = req;
    this.response = res;
    this.count = 0;

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    });
  }

  connect() {
    this.response.write("event: connected\n");
    this.response.write("data: You are now subscribed!\n");
    this.response.write(`id: ${this.count}\n\n`);
    this.count += 1;
  }

  send(message) {
    this.response.write("event: message\n");
    this.response.write(`data: ${message}\n`);
    this.response.write(`id: ${this.count}\n\n`);
    this.count += 1;
  }

  close() {
    this.response.end('OK');
  }
}
