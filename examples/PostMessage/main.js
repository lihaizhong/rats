import { MainPoint, Journal } from "@lihzsky/excelsior-channel";

const frame = document.body.getElementsByTagName('iframe')[0];
const journal = new Journal();
const pointer = new MainPoint(frame);

// 定义远程调用的函数
pointer.declare('move', (targetIndex, relativeIndex) => {
  // move
  journal.info('move success!', targetIndex, relativeIndex);
})

// 定义远程调用的函数
pointer.declare('delete', () => {
  // delete
  journal.info('delete success!');
})

// 通知update操作
pointer.notify('update')
