## parseHTML.js

### 介绍
HTML字符串转换成HTML片段，存在以下三个参数
+ data HTML字符串
+ context 上下文，默认为document
+ keepScripts 是否允许\<script\>存在

### 解析
+ 如果data是单个标签，返回一个DOM数组
+ 如果data是复杂结构HTML片段，使用buildFragment构建该片段的DOM树，并返回DOM数组

