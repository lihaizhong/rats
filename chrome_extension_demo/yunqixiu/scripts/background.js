/**
 * Created by sky on 2017/2/16.
 */

var site = 'http://www.yunqixiu.com/legend/portal',
    sitePattern = '*://www.yunqixiu.com/*',
    title = '淘汽云修';

// 右键菜单栏
var contextMenus = {
    menuItemId: 'bookmark',
    create: function () {
        chrome.contextMenus.removeAll(function () {
            chrome.contextMenus.create({
                id: contextMenus.menuItemId,
                title: '收藏淘汽云修',
                documentUrlPatterns: [sitePattern]
            })
        })
    },
    genericOnClick: function () {
        // 创建书签
        chrome.bookmarks.create({
            parentId: '1',
            title: title,
            url: site
        }, function (bookmarkTreeNode) {
            alert('收藏成功！')
        })
    }
}

//// Event Bind ////

// 点击chrome扩展图标
chrome.browserAction.onClicked.addListener(function (tab) {
    // 创建新tab
    chrome.tabs.create({url: site})
})

// 点击右键菜单栏项
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    // 如果当前菜单项是我们新建的菜单项
    if (info.menuItemId === contextMenus.menuItemId) {
        contextMenus.genericOnClick()
    }
})

//// Initialize ////

// 创建右键菜单项
contextMenus.create()




//// debugger ////

// chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
//     alert(JSON.stringify(bookmarkTreeNodes))
// })


