const DDPClient = require('ddp')

const client = new DDPClient({
  host: 'localhost',
  port: 3000
})

client.on('message', (data, flags) => console.log('【DDP 消息】', data, flags))

client.connect(() => {
  client.subscribe('post', [], () => console.log('【post 订阅消息】'))
})
