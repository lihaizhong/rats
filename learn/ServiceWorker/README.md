# Service Worker 教程

## 教学链接

- [使用ServiceWorker](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers)
- [PWA教程](https://www.bookstack.cn/read/pwa-doc/README.md)
- [PWA 应用实战](https://lavas-project.github.io/pwa-book/)

## MANIFEST配置

Web应用清单（Web Application Manifest）是一份JSON格式的文件。

网站提供这样一份应用程序清单，并满足一定的生效条件之后，将具有添加到主屏幕的能力。

> 添加到主屏幕的好处有很多，主要在用户黏性和用户体验上。

- 首先是减少了网站入口深度，用户可以直接从主屏幕直达站点。
- 其次是能够让网站具有更加接近原生体验的特性，具有启动页面，脱离浏览器UI。
- 最后，添加到主屏幕的网站如同安装原生应用那样，被纳入应用抽屉中，并且可以通过系统设置直接对站点进行设置。

### 引入方式

\<link rel="manifest" href="https://path/to/manifest.json" \/\>

### name或者short_name

必填，用来配置网站应用的名称。

> 其中，name是应用名称，用于应用安装提示、启动页面的显示；
> short_name是应用名称的简写，用于添加到主屏幕时的应用名展示。
### start_url

用来定义添加到桌面后的启动URL。可以采用绝对路径和相对路径的方式定义。

> **注意：**目前条件下，浏览器未提供任何值或者环境变量来帮助程序判断页面打开方式。可以通过在`start_url`上添加特殊query来实现。
### icons

用来定制应用图标。接收一个图标描述对象列表，每个图标的描述对象包含三个属性。

- src: 字符串，图标URL
- type: 字符串，图标尺寸，格式为`宽x高`，数值单位默认为`px`。对于`.ico`类型的图标支持多种尺寸的情况，可以使用空格作为间隔，如：`48x48 96x96 128x128`。
- sizes: 字符串，非必填。图标的MIME类型，可以用来让浏览器快速忽略掉不支持的图标类型。

### display

用来定义从桌面打开的网站的显示模式。目前支持以下几种：

| 显示模式 | 描述 | 降级显示类型 |
- | - | -
| fullscreen | 全屏模式，页面占满整个屏幕，包括移动设备的状态栏都会被页面覆盖 | standalone |
| standalone | 独立模式，浏览器相关UI将会被隐藏，移动设备状态栏不会被覆盖 | minimal-ui |
| minimal-ui | 显示形式与standalone类似，浏览器相关UI会最小化为一个按钮，不同浏览器在实现上略有不同，支持度较低 | browser |
| browser | 浏览器模式，直接通过浏览器打开网页的普通展示方式，包含地址栏、工具栏等浏览器元素 | None |

### background_color

定义网站背景色，在显示启动页面时生效。

### theme_color

定义网站主题色，会影响到浏览器UI元素的显示。比如启动页面的顶部手机状态栏的颜色。
