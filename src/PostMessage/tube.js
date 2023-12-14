import { NodePoint, Journal } from "@lihzsky/excelsior-channel";

const journal = new Journal();
const pointer = new NodePoint();

// 定义远程调用的函数
pointer.declare('update', () => {
  // update
  journal.info('update success!');
});

window.onload = async function load() {
  // 通知delete操作，删除指定内容
  pointer.notify('delete', 1);

  // 调用move操作，移动指定内容
  // invoke的方式可以获取到返回的数据，用于下一步的操作
  const data = await pointer.invoke('move', 1, 6);

  journal.info('数据返回', data);
}
