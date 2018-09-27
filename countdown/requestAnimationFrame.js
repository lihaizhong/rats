/**
 * @author Sangbaipi
 * @email sangbaipi@2dfire.com
 * @create date 2018-08-27 05:39:18
 * @modify date 2018-08-27 05:39:18
 * @desc RequestAnimationFrame兼容
*/

let lastTime = 0
const vendors = ['webkit', 'moz']
let requestAnimationFrame = window.requestAnimationFrame
let cancelAnimationFrame = window.cancelAnimationFrame

for(var i = 0; !requestAnimationFrame && i < vendors.length; i++) {
    requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame']
    // Webkit中此取消方法的名字变了
    cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame']
}

// 模拟requestAnimationFrame
if (!requestAnimationFrame) {
    requestAnimationFrame = callback => {
        var currTime = new Date().getTime()
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime))
        var id = window.setTimeout(function() {
            callback()
        }, timeToCall)
        lastTime = currTime + timeToCall
        return id
    }
}

// 模拟cancelAnimationFrame
if (!cancelAnimationFrame) {
    cancelAnimationFrame = id => {
        clearTimeout(id)
    }
}

window.requestAnimationFrame = requestAnimationFrame
window.cancelAnimationFrame = cancelAnimationFrame
