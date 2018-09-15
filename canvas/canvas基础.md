# canvas基础

## Canvas

### 方法

#### getContext("2d")

#### toDataURL()#### beginPath()

#### closePath()

#### clearRect(x, y, width, height)

#### save()

#### restore()

#### fillRect(x, y, width, height)

#### moveTo(x, y)

#### lineTo(x, y)

#### stroke()

#### fill()

#### arc(x, y, radius, startAngle, endAngle, anticlockwise)

#### arcTo(x1, y1, x2, y2, radius)

#### quadraticCurveTo(cpx, cpy, x, y)

#### bezierCurveTo(cpx1, cpxy1, cpx2, cpy2, x, y)

#### strokeRect(x, y, width, height)

#### fillText(text, x, y, maxWidth)

#### strokeText(text, x, y, maxWidth)

#### transition(x, y)

#### scale(xTimes, yTimes)

#### rotate(angle)

#### transform(a, b, c, d, e, f)

#### setTransform(a, b, c, d, e, f)

#### createLinearGradient(x0, y0, x1, y1)

#### createRadialGradient(x0, y0, r0, x1, y1, r1)

## Context

### 属性

#### fillStyle

#### strokeStyle

#### lineWidth

#### font

#### globalAlpha

#### shadowBlur

#### shadowOffsetX

#### shadowOffsetY

#### shadowColor

> 0.0 ~ 1.0

#### globalCompositeOperation

1. source-over
2. destination-over
3. source-atop
4. destination-atop
5. source-in
6. destination-in
7. source-out
8. destination-out
9. lighter
10. copy
11. xor

### CanvasGradient

#### addColorStop(x, y)

### 2D渲染上下文的变换矩阵

``` text
|a b c|   |x轴缩放 x轴倾斜 x轴平移|
|d e f| = |y轴倾斜 y轴缩放 y轴平移|
|0 0 1|   |  0      0      1   |
```

#### 默认矩阵

``` text
|1 0 0|
|0 1 0|
|0 0 1|
```
