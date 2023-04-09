# 二维码原理解析

## 二维码基本知识

二维码存在40种尺寸（Version），最小 **21 x 21**，最大 **177 x 177**。版本`+1`，尺寸`+4`。

> 计算方法：Size = (Version - 1) x 4 + 21

### QR码的数据编码有四种

1. 数字：`0-9`
2. 大写字母和数字：`0-9`，`A-Z`，`空格`，`$`，`%`，`*`，`+`，`-`，`.`，`/`，`:`
3. 二进制/字节：通过[ISO/IEC 8859-1](https://link.zhihu.com/?target=https%3A//en.wikipedia.org/wiki/ISO/IEC_8859-1)标准编码
4. 日本汉字/假名：通过[Shift JISJIS X 0208](https://link.zhihu.com/?target=https%3A//en.wikipedia.org/wiki/Shift_JIS)标准编码

### QR码有四种容错级别

1. **L（Low）**：`7%`的字码可被修正
2. **M（Medium）**：`15%`的字码可被修正
3. **Q（Quartile）**：`25%`的字码可被修正
4. **H（High）**：`30%`的字码可被修正

## 参考资料

- [为程序员写的Reed-Solomon码解释](https://www.jianshu.com/p/8208aad537bb)
- [二维码的生成细节和原理](https://coolshell.cn/articles/10590.html#%E6%8E%A9%E7%A0%81%E5%9B%BE%E6%A1%88)
- [深度探索二维码原理及其应用](https://www.jianshu.com/p/38c4781c1f5d)
- [二维码生成原理及解析代码](https://cloud.tencent.com/developer/article/1010480)
