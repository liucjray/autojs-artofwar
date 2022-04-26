
const ArtOfWarAct = 'com.addictive.strategy.army.UnityPlayerActivity';
const logger = true;
const src = '/sdcard/Pictures/';

// 賞金任務
const isTaskRandom = false;
const taskHours = [13, 14];
const taskWaitSeconds = 15;
// 賞金任務-無限戰爭
const unlimitWarHours = [9, 20];
const unlimitWarWaitSeconds = 305;
// 榮耀狩獵
const hountingHours = [10];
const hountingWaitSeconds = 305;
// 競技場
const arenaHours = [18, 20];
const arenaWaitSeconds = 60;
// 英雄試煉
const heroHours = [8]; //[18, 20];
const heroWaitSeconds = 30;
// 開戰
const fightWaitSeconds = 30;
const fight8000WaitSeconds = 25;


if (!requestScreenCapture(false)) {
    toast("请求截图失败");
    exit();
}

FindAndClick = function (png) {
    var img = rootGetScreen();
    log(png);
    var wx = images.read(src + png);
    var p = findImage(img, wx);
    var re = false;
    if (p) {
        toast(png);
        // log("find : " + png);
        log([p.x, p.y])
        click(p.x, p.y);
        re = true;
    }
    else {
        log("Not found: " + png)
    }
    img.recycle();
    wx.recycle();
    return re;
}

// 截圖
rootGetScreen = function () {
    captureScreen(src + 'sc.png');
    return images.read(src + 'sc.png')
}

beforeWait = function () {
    sleep(600);
}
afterWait = function () {
    sleep(600);
}

while (true) {
    // break label
    初始位置:

    devLog('### START ###');

    init();

    if (isArtOfWarAct() === false) {
        launchGame();
    }

    if (shouldCollectResourece()) {
        collectResource();
    }

    if (shouldCollectBox8000()) {
        collectBox8000();
    }

    if (shouldUnlimitWar()) {
        unlimitWar();
    }

    if (shouldArena()) {
        // arena();
        arenaV2();
    }

    if (shouldTask()) {
        task();
    }

    if (shouldHounting()) {
        hounting();
    }

    if (shouldHero()) {
        hero();
    }

    if (shouldFight()) {
        // fight();
        // fight8000();
        fight8000V2();
    }

    devLog('### END ###');
}

function isArtOfWarAct() {
    return currentActivity() === ArtOfWarAct;
}

function launchGame() {
    home();
    launchApp('Art of War');
    devLog('--- 檢查並非在遊戲中, 重新進入遊戲 ---');
    sleepAndLog(30);
}

function shouldFight() {
    devLog('--- 執行關卡 ---');
    return true;
}

function fight() {

    // 智障禮包廣告
    sleepAndLog(2);
    click(964, 294);
    sleepAndLog(2);

    // console.log('點主頁'); //toast('點主頁');
    click(545, 1845);
    sleepAndLog(2);
    click(545, 1845);
    sleepAndLog(2);

    // console.log('點開戰'); //toast('點開戰');
    click(545, 1550);
    sleepAndLog(3);

    // console.log('點關卡'); //toast('點關卡');
    click(545, 1550);

    // // 等待 x 秒戰鬥完成
    sleepAndLog(fightWaitSeconds);

    // console.log('點下一步'); //toast('點戰鬥完成下一步按鈕');
    click(700, 1250);
    sleepAndLog(3);
}

function fight8000() {

    // 智障禮包廣告
    sleepAndLog(2);
    click(964, 294);
    sleepAndLog(2);


    click(545, 1845);
    sleepAndLog(2);
    click(545, 1845);
    sleepAndLog(3); // matching load


    click(545, 1550);
    sleepAndLog(5);

    // 點 8000 關 按鈕
    click(545, 1550);

    // // 等待 x 秒戰鬥完成
    log('--- 戰鬥開始等待 ' + fight8000WaitSeconds + ' 秒  ---');
    sleepAndLog(fight8000WaitSeconds);

    // 失敗 (下一步)
    click(360 * 2, 630 * 2);
    click(360 * 2, 730 * 2);

    // click(700, 1250);
    sleepAndLog(3);
}

function fight8000V2() {
    while (true) {
        beforeWait();
        if (FindAndClick('主頁_開戰.png')) {
            break;
        }
        afterWait();
    }

    while (true) {
        beforeWait();
        if (FindAndClick('主頁_開戰_關卡8000.png')) {
            break;
        }
        afterWait();
    }

    while (true) {
        beforeWait();
        if (FindAndClick('主頁_開戰_關卡8000_下一步.png')) {
            break;
        }
        afterWait();
    }
}

function shouldCollectResourece() {
    let rnd = random(1, 10);
    if (rnd == 1) {
        devLog('--- 執行蒐集資源 ---');
        return true;
    }
    devLog('--- 無須執行蒐集資源 ---');
    return false;
}

function collectResource() {

    // _clickLeftTop();

    _clickMainPage();

    click(378, 683);
    sleepAndLog(5);

    click(545, 1242);
    sleepAndLog(5);
}


function shouldCollectBox8000() {
    let rnd = random(1, 30);
    if (rnd == 1) {
        devLog('--- 執行蒐集寶箱列表 ---');
        return true;
    }
    devLog('--- 無須執行蒐集寶箱列表 ---');
    return false;
}

function collectBox8000() {
    _clickMainPage();

    // 點寶箱圖示
    click(480 * 2, 100 * 2);
    // 20
    multipleClick(170 * 2, 225 * 2, 3, 0);
    // 40
    multipleClick(245 * 2, 225 * 2, 3, 0);
    // 60
    multipleClick(320 * 2, 225 * 2, 3, 0);
    // 100
    multipleClick(480 * 2, 225 * 2, 3, 0);
    // 點 X
    click(500 * 2, 115 * 2);
}

function shouldHounting() {

    let nowDate = new Date();

    // 執行競技場時段
    if (hountingHours.indexOf(nowDate.getHours()) !== -1) {
        devLog('--- 執行榮耀狩獵 ---');
        return true;
    }

    devLog('--- 無須執行榮耀狩獵 ---');
    return false;
}

function hounting() {

    _clickLeftTop();

    _clickMainPage();

    // console.log('點領地');
    click(770, 1845);
    sleepAndLog(1);
    click(770, 1845);
    sleepAndLog(1);

    // console.log('點榮耀狩獵');
    click(130 * 2, 460 * 2);
    sleepAndLog(3);

    // console.log('點挑戰');
    click(720, 1680);
    sleepAndLog(5);

    // console.log('點開戰');
    click(560, 1600);
    sleepAndLog(hountingWaitSeconds);

    // console.log('點下一步');
    click(540, 1440);
    sleepAndLog(5);

    _clickLeftTop();
}

function shouldArena() {

    let nowDate = new Date();

    // 執行競技場時段
    if (arenaHours.indexOf(nowDate.getHours()) !== -1) {
        devLog('--- 執行競技場 ---');
        return true;
    }

    devLog('--- 無須執行競技場 ---');
    return false;
}

function arena() {
    // console.log('點競技場'); 點兩次避免執行完有彈窗卡住
    click(980, 1850);
    sleepAndLog(2);
    click(980, 1850);
    sleepAndLog(2);

    // console.log('點挑戰');
    click(540, 1660);
    sleepAndLog(5);

    // console.log('點第一位去挑戰');
    click(830, 510);
    sleepAndLog(5);

    // console.log('點開戰');
    click(550, 1580);
    sleepAndLog(arenaWaitSeconds);

    // console.log('點下一步');
    click(550, 1400);
    sleepAndLog(5);

    // console.log('先點左上角避免一直卡住')
    // click(80, 80);
    // sleepAndLog(3);
}

function arenaV2() {
    // break label 
    // ref: https://stackoverflow.com/questions/1564818/how-to-break-nested-loops-in-javascript
    競技場:
    while (true) {

        while (true) {
            beforeWait();
            if (FindAndClick('競技場.png')) {
                break;
            }
            afterWait();
        }

        while (true) {
            beforeWait();
            if (FindAndClick('競技場_挑戰.png')) {
                break;
            }
            afterWait();
        }

        while (true) {
            beforeWait();
            if (FindAndClick('競技場_挑戰_挑戰.png')) {
                break;
            }
            afterWait();
        }

        while (true) {
            beforeWait();
            if (FindAndClick('競技場_挑戰_挑戰_額外挑戰次數.png')) {
                // break label
                break 競技場;
            }
            afterWait();
        }

        while (true) {
            beforeWait();
            if (FindAndClick('競技場_挑戰_挑戰_開戰.png')) {
                break;
            }
            afterWait();
        }

        while (true) {
            beforeWait();
            if (FindAndClick('競技場_挑戰_挑戰_開戰_下一步.png')) {
                break;
            }
            afterWait();
        }

        // 有主頁就先回主頁
        for (let $i = 1; $i <= 3; $i++) {
            afterWait();
            if (FindAndClick('主頁.png')) {
                break;
            }
            beforeWait();
        }

    }
}

function shouldHero() {

    let nowDate = new Date();

    // 執行競技場時段
    if (heroHours.indexOf(nowDate.getHours()) !== -1) {
        devLog('--- 執行英雄試煉 ---');
        return true;
    }

    devLog('--- 無須執行英雄試煉 ---');
    return false;
}

function hero() {
    // console.log('點 領地'); 點兩次避免執行完有彈窗卡住
    multipleClick(400 * 2, 940 * 2, 2);
    sleepAndLog(2);

    // 點英雄試煉
    multipleClick(220 * 2, 640 * 2, 2);
    sleepAndLog(2);

    // console.log('點挑戰');
    click(540 * 2, 1660 * 2);
    sleepAndLog(2);

    // console.log('點前往');
    click(440 * 2, 330 * 2);
    sleepAndLog(5);

    // console.log('點 挑戰');
    click(275 * 2, 910 * 2);
    sleepAndLog(4);

    // console.log('超過挑戰次數的確認');
    click(285 * 2, 600 * 2);
    sleepAndLog(2);

    // console.log('點一位去挑戰');
    click(425 * 2, 520 * 2);
    sleepAndLog(5);

    // console.log('點開戰');
    click(270 * 2, 800 * 2);
    sleepAndLog(heroWaitSeconds);

    // console.log('點下一步');
    click(275 * 2, 720 * 2);
    sleepAndLog(5);

    _clickLeftTop();
    _clickLeftTop();
}

function shouldUnlimitWar() {

    let nowDate = new Date();

    devLog('nowDate.getHours() = ' + nowDate.getHours());

    // 任務時段
    if (unlimitWarHours.indexOf(nowDate.getHours()) !== -1) {
        devLog('--- 執行無限戰爭 ---');
        return true;
    }

    devLog('--- 無須執行無限戰爭 ---');
    return false;
}

function unlimitWar() {

    _clickLeftTop();

    // console.log('點領地');
    click(770, 1845);
    sleepAndLog(1);
    click(770, 1845);
    sleepAndLog(1);

    // console.log('點賞金任務');
    click(878, 1045);
    sleepAndLog(3);

    // console.log('點 挑戰');
    click(440 * 2, 350 * 2);
    sleepAndLog(5);

    // console.log('進入 玩家排名榜 點 挑戰');
    click(274 * 2, 920 * 2);
    sleepAndLog(5);

    // console.log('點開戰');
    click(270 * 2, 800 * 2);
    sleepAndLog(unlimitWarWaitSeconds);

    // console.log('點下一步');
    click(270 * 2, 750 * 2);
    sleepAndLog(3);

    // 蒐集鑽石
    // 1M
    multipleClick(100 * 2, 170 * 2, 5, 0);
    sleepAndLog(1);
    // 5M
    multipleClick(185 * 2, 170 * 2, 5, 0);
    sleepAndLog(1);
    // 10M
    multipleClick(265 * 2, 170 * 2, 5, 0);
    sleepAndLog(1);
    // 30M
    multipleClick(350 * 2, 170 * 2, 5, 0);
    sleepAndLog(1);
    // 40M
    multipleClick(435 * 2, 170 * 2, 5, 0);
    sleepAndLog(1);
    // 50M
    multipleClick(520 * 2, 170 * 2, 5, 0);
    sleepAndLog(1);


    // console.log('點上頁箭頭');
    click(78, 78);
    sleepAndLog(2);

    // console.log('點上頁箭頭');
    click(78, 78);
    sleepAndLog(2);
}


function shouldTask() {

    let nowDate = new Date();

    devLog('nowDate.getHours() = ' + nowDate.getHours());

    // 任務時段
    if (taskHours.indexOf(nowDate.getHours()) !== -1) {
        devLog('--- 執行賞金任務 ---');
        return true;
    }

    devLog('--- 無須執行賞金任務 ---');
    return false;
}

function task() {

    _clickLeftTop();

    // console.log('點領地');
    click(770, 1845);
    sleepAndLog(1);
    click(770, 1845);
    sleepAndLog(1);

    // console.log('點賞金任務');
    click(878, 1045);
    sleepAndLog(3);

    let rnd = 0;
    if (isTaskRandom) {
        log('--- 使用 random 執行賞金任務 ---');
        rnd = random(1, 2);
    } else {
        let nowDate = new Date();
        log('--- 使用 %2 執行賞金任務 ---', nowDate.getHours(), nowDate.getHours() % 2);
        rnd = nowDate.getHours() % 2;
    }
    log('rnd: ' + rnd);

    if (rnd == 1) {
        // console.log('點沙漠尋寶');
        click(850, 1200);
    } else {
        // console.log('點雪境冒險');
        click(850, 1700);
    }
    sleepAndLog(5);

    // console.log('點開戰');
    click(550, 1580);
    sleepAndLog(taskWaitSeconds);

    // console.log('點下一步');F
    click(700, 1250);
    sleepAndLog(3);

    // console.log('點上頁箭頭');
    click(78, 78);
    sleepAndLog(2);
}


// ----------
// 共用方法
// ----------

function init() {
    // 避免有時候如果點了左上角，但是戰鬥尚未結束時卡住的問題
    _clickGoBack();
}

function _clickLeftTop() {
    // console.log('點左上角'); //toast('點主頁');
    click(70, 70);
    click(70, 70);
    sleepAndLog(2);
}

function _clickMainPage() {
    // console.log('點主頁'); //toast('點主頁');
    click(545, 1845);
    sleepAndLog(2);
    click(545, 1845);
    sleepAndLog(2);
}

function _clickGoBack() {
    click(275 * 2, 525 * 2);
    sleepAndLog(2);

    click(340 * 2, 600 * 2);
    sleepAndLog(2);
}

function multipleClick(x, y, times, delaySeconds) {
    for (let i = 1; i <= times; i++) {
        click(x, y);
        if (delaySeconds > 0) {
            sleepAndLog(delaySeconds);
        }
    }
}

function sleepAndLog(times) {
    for (let i = times; i > 0; --i) {
        sleep(1000);
        log(i);
    }
}

function devLog(str) {
    if (logger === true) {
        log(str);
    }
}