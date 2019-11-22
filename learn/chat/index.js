const net = require('net')

const chatServer = net.createServer()
const clientList = []

module.exports = function service() {
  /**
   * 广播消息
   * @param {string} message
   * @param {Client} client
   */
  function broadcast(message, client) {
    const cleanup = []

    // 遍历所有连接的客户端
    clientList.forEach(clientIns => {
      // 向出自己以外的客户端发送消息
      if (clientIns !== client) {
        // 检测客户端连接是否正常
        if (clientIns.writeable) {
          clientIns.write(`${client.name} says ${message}`)
        } else {
          cleanup.push(clientIns)
          clientIns.destroy()
        }
      }
    })

    // 清理已失效的客户端
    cleanup.forEach(item => {
      const clientIndex = clientList.indexOf(item)
      clientList.splice(clientIndex, 1)
    })
  }

  chatServer.on('connection', client => {
    const { remoteAddress, remotePort } = client
    client.name = `${remoteAddress}:${remotePort}`

    client.write(`Hi, ${client.name}!\n`)

    clientList.push(client)

    // 接收客户端数据
    client.on('data', data => broadcast(data, client))

    // 监听客户端连接断开消息
    client.on('end', () => {
      const clientIndex = clientList.indexOf(client)
      clientList.splice(clientIndex, 1)
    })

    // 捕获客户端连接报错信息
    client.on('error', error => {
      console.log(error)
    })
  })

  chatServer.listen(9000)
}
