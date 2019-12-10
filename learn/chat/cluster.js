const cluster = require('cluster')
const service = require('./index')
const os = require('os')

const cpus = os.cpus().length

if (cluster.isMaster) {
  // fork 多个进程
  cpus.forEach(() => {
    const worker = cluster.fork()

    worker.on('message', ({ memory }) => {
      console.log(memory && Math.round(memory.rss / 1024 / 1024))
    })
  })

  // 监听 worker death事件，并重新fork进程
  cluster.on('death', worker => {
    console.log(`worker ${worker.pid} died`)
    cluster.fork()
  })
} else {
  service()

  setInterval(function report () {
    process.send({ memory: process.memoryUsage(), process: process.pid })
  }, 1000)
}
