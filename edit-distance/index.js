/**
 * Created by sky on 2017/2/9.
 */

(function () {
    var $$sug = document.getElementById('suggest')
    var $$res = document.getElementById('result')

    var mockData = [
        '今天天气好吗',
        '今天天气如何',
        '明天天气好吗',
        '明天天气如何',
        '今天我和你出去玩',
        '明天我们出去玩好吗',
        '后天天气怎么样',
        '后天天气好吗',
        '今天明天',
        '今天昨天',
        '今天今天',
        '今天明天天明',
        '今天天明天明',
        '明天天明天明',
        '明天明天天明天明'
    ];

    var waitingValue;

    function edit_distance(a, b) {
        var lenA = a.length,
            lenB = b.length,
            d = [],
            res = {
                // 最大的匹配词长度
                maxLength: -1,
                // 匹配词总长度
                count: 0,
                // 首个匹配字符的位置
                position: 30,
                // 最短编辑路径
                distance: -1
            },
            // 是否连续匹配到字符
            isConj = false,
            // 是否匹配到字符
            isMatched = false,
            curA,
            curB,
            curPos,
            tmp,
            tmpPos,
            tmpLen,
            tmpConj,
            i, j, old;

        function init() {
            tmpPos = -1;
            tmpLen = 0;
            tmpConj = '';
        }

        function setRes() {
            tmpLen = tmpConj.length;
            if (tmpLen) {
                // 设置最大匹配字符串长度
                if (tmpLen > res.maxLength) {
                    res.maxLength = tmpLen;
                }
                // 设置所有匹配字符的数量
                res.count += tmpLen;
                // 设置首个匹配字符位置
                if (tmpPos != -1 && res.position > tmpPos) {
                    res.position = tmpPos;
                }
                init();
            }
        }

        init();

        // 创建一个数组，用于单个字符匹配
        for (j = 0; j <= lenB; j++) {
            d[j] = j;
        }

        for (i = 1; i <= lenA; i++) {
            old = d[0];
            d[0] = i;
            curA = a[i - 1];

            for (j = 1; j <= lenB; j++) {
                tmp = d[j];
                curPos = j - 1;
                curB = b[curPos];

                // 是否匹配到字符
                if (curA == curB) {
                    d[j] = old;

                    if (tmpPos == -1 || tmpPos > curPos) {
                        tmpPos = curPos;
                    }

                    // 确保只匹配成功一次
                    if (!isConj) {
                        isMatched = true;
                        // 是否已经匹配到字符串，并且保证匹配的字符串可查询
                        isConj = a[i - 2] == b[j - 2] && b.indexOf(tmpConj + curA) != -1;
                    }
                } else {
                    // 获得最小编辑距离路径
                    d[j] = Math.min(tmp + 1, d[curPos] + 1, old + 1);
                }
                old = tmp;
            }

            // 如果是最后一个字符，无论字符串是否连续都执行设置结果集
            if (lenA == i) {
                // 如果是连续的字符串，就拼接最后一个字符
                if (isConj) {
                    tmpConj += curA;
                    isConj = isMatched = false;
                }

            }

            // 如果是连续的字符串，就拼接这个字符；否则去设置结果集
            if (isConj) {
                tmpConj += curA;
            } else {
                setRes();
                // 如果匹配到了字符，但是字符并不符合当前字符串的要求
                if (isMatched) {
                    tmpConj += curA;
                    // 如果匹配到了字符，但字符在最后一个位置
                    lenA == i && setRes();
                }
            }

            isConj = isMatched = false;
        }

        // 设置编辑距离
        res.distance = d[lenB];

        return res;
    }

    function filterData(data, key) {
        var len = data.length,
            res = [],
            i, sort, item;

        for (i = 0; i < len; i++) {
            item = data[i];
            sort = edit_distance(key, item);
            // 过滤完全没有匹配到的数据
            if (sort.count == 0) {
                continue;
            }

            res.push({
                sort: sort,
                data: item
            });
        }

        var tmp = [];
        res = res.sort(function (a, b) {
            // function rule(sort, txt) {
            //     var maxLength = sort.maxLength * 25,
            //         count = sort.count * 20,
            //         length = txt.length * 15,
            //         position = sort.position * 25,
            //         distance = sort.distance * 15,
            //         res = maxLength + count + length - position - distance;
            //     if ((',' + tmp.join(',') + ',').indexOf(',' + txt + ',') === -1) {
            //         console.log('最大长度:', sort.maxLength, '匹配长度:', sort.count, '内容长度:', txt.length, '首字符的位置:', sort.position, '最短编辑路径:', sort.distance, '权值:', res, txt);
            //         tmp.push(txt);
            //     }
            //     return res;
            // }

            // 设置排序规则，根据权值调整
            function rule(sort, txt) {
                return sort.maxLength * 25 + sort.count * 20 + txt.length * 15 - sort.position * 25 - sort.distance * 15;
            }

            // 等于0 顺序不变， 大于0 a排前面， 小于0 b排前面
            return rule(b.sort, b.data) - rule(a.sort, a.data);
        });

        // 还原数据结构
        return res.map(function (item) {
            return item.data;
        });
    }

    $$sug.addEventListener('keypress', function () {
        waitingValue = this.value;
    });

    $$sug.addEventListener('keyup', function (e) {
        var key = this.value,
            data,
            template = '<ul>';

        if (waitingValue == null) {
            return;
        }

        data = filterData(mockData, key);

        for (var i = 0; i < data.length; i++) {
            template += '<li>' + data[i] + '</li>';
        }
        $$res.innerHTML = template += '</ul>';
    }, false);
})()