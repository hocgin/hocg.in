// 彩蛋
console.log("%c Welcome ❤ %c https://hocg.in \n","color: #fadfa3; background: #030307; padding:5px 0;","background: #fadfa3; padding:5px 0;")
// 切换标题
let c,
    u = document.title;
    document.addEventListener('visibilitychange', function () {
    document.hidden ? ($('[rel="shortcut icon"]').attr('href', 'https://hocg.in/fail.ico'),
        document.title = '(●—●)喔哟，崩溃啦！',
        clearTimeout(c)) : ($('[rel="shortcut icon"]').attr('href', 'https://hocg.in/favicon.ico?v=0.5.0'),
        document.title = '(/≧▽≦/)咦！又好了！' + u,
        c = setTimeout(function () {
            document.title = u
        }, 2e3))
});