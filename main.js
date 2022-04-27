
const ArtOfWarAct = 'com.addictive.strategy.army.UnityPlayerActivity';
const ArtOfWarActADS = 'com.google.android.gms.ads.AdActivity';
const src = './pictures/'; // 打包用
// const src = '/sdcard/Pictures/'; // 打包用
// const src = './autojs-artofwar/Pictures/';
const logger = true;
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
const arenaHours = [0, 1];
const arenaWaitSeconds = 60;
// 英雄試煉
const heroHours = [8]; //[18, 20];
const heroWaitSeconds = 30;
// 開戰
const fightWaitSeconds = 30;
const fight8000WaitSeconds = 25;


var base = require("./base.js");
base.start(src);
base.floaty_set();

var storage = storages.create("RITK");
var sFeatures = (storage.get("features")) ? storage.get("features") : '0';
var afeatures = dialogs.multiChoice(
    '請選擇使用的功能',
    [
        '執行關卡', // 0
        '無限戰爭', // 1
        '競技場', // 2
        '賞金任務', // 3
        '榮耀狩獵', // 4
        '英雄試煉', // 5
        '觀看三倍獎勵廣告', // 6
    ],
    sFeatures.split(',')
);
sFeatures = afeatures.join(',');
sFeatures = (sFeatures == "") ? '0' : sFeatures;
storage.put("features", sFeatures)

// 用戶選擇模式
type_id = dialogs.singleChoice(
    "請選擇類型", [
    "自動戰鬥8000關前",
    "自動戰鬥8000關後",
    "關閉"
]
)
switch (type_id) {
    case 0:
        自動戰鬥8000關前();
        break;
    case 1:
        自動戰鬥8000關後();
        break;
    default:
        break;
}

function 自動戰鬥8000關前() {

    while (true) {
        try {
            devLog('### START ###');

            if (isArtOfWarAct() === false) { // 檢查是否啟動
                launchGame();
            }

            goBackUntilIndex(); // 返回首頁

            if (shouldCollectResourece()) { // 蒐集資源
                collectResource();
            }

            if (shouldUnlimitWar()) { // 無限戰爭
                unlimitWar();
            }

            if (shouldArena()) { // 競技場
                arenaV2();
            }

            if (shouldTask()) { // 賞金任務
                task();
            }

            if (shouldHounting()) { // 榮耀狩獵
                hounting();
            }

            if (shouldHero()) { // 英雄試煉
                hero();
            }

            if (shouldFight()) { // 執行關卡
                fight();
            }

            if (shouldUnlock()) { // 是否有新解鎖
                unlock();
            }
            toast("三秒後重新啟動");
            sleepAndLog(3);
            devLog('### END ###');
        }
        catch (e) {
            devLog(e);
            // 卡住處理
            stuckHandling();
        }
    }

}
function 自動戰鬥8000關後() {
    while (true) {
        try {
            devLog('### START ###');

            if (isArtOfWarAct() === false) { // 檢查是否啟動
                launchGame();
            }

            goBackUntilIndex(); // 返回首頁

            if (shouldCollectResourece()) { // 蒐集資源
                collectResource();
            }

            if (shouldCollectBox8000()) { // 蒐集寶箱
                collectBox8000();
            }

            if (shouldUnlimitWar()) { // 無限戰爭
                unlimitWar();
            }

            if (shouldArena()) { // 競技場
                arenaV2();
            }

            if (shouldTask()) { // 賞金任務
                task();
            }

            if (shouldHounting()) { // 榮耀狩獵
                hounting();
            }

            if (shouldHero()) { // 英雄試煉
                hero();
            }

            if (shouldFight()) { // 執行關卡
                // fight();
                // fight8000();
                fight8000V2();
            }

            toast("三秒後重新啟動");
            sleepAndLog(3);

            devLog('### END ###');
        }
        catch (e) {
            devLog(e);
            // 卡住處理
            stuckHandling();
        }

    }
}

// ----------
// 遊戲模組
// ----------

// 返回主頁
function goBackUntilIndex() {
    var items = ['關閉.png', '返回.png'];
    if (!base.FindAndClick('主頁.png') && !base.FindAndClick('主頁2.png')) {
        while (true) {
            launchApp('Art of War');
            base.ScanPicsAndClick(items);
            beforeWait();
            // 試兩次
            if (base.FindAndClick('主頁.png') || base.FindAndClick('主頁.png')) {
                break;
            }
            if (base.FindAndClick('主頁2.png')) {
                break;
            }
            back();
            // 如果卡在下一步就先下一步
            // 卡住處理
            stuckHandling();
            afterWait();
        }
    }
}

// 檢查是否啟動
function isArtOfWarAct() {
    return currentActivity() === ArtOfWarAct || currentActivity() === ArtOfWarActADS;
}

// 啟動遊戲
function launchGame() {
    devLog(currentActivity());
    // home();
    devLog('--- 檢查並非在遊戲中, 重新進入遊戲 ---');
    launchApp('Art of War');
    // sleepAndLog(30);
    base.waitImgs(['主頁.png', '主頁2.png'], 6);
}

// 是否有新解鎖 ---
function shouldUnlock() {
    devLog('--- 檢查新解鎖 ---');
    if (!base.waitImg('主頁_解鎖.png', 2)) {
        return false;
    }
    return true;
}

function unlock() {
    devLog('--- 新解鎖 ---');
    base.waitImg('主頁_解鎖_好.png', 2);
    return true;
}

// 執行關卡 ---
function shouldFight() {
    if (afeatures.indexOf(0) < 0) {
        return false;
    }
    devLog('--- 執行關卡 ---');
    return true;
}

function fight() {
    // toast("執行關卡");
    _clickMainPage();
    if (!base.waitImg('主頁_開戰.png', 6, false)) {
        throw "找不到主頁_開戰、重新執行流程";
    }

    // if(base.waitImg('主頁_開戰_抽卡.png', 2)){
    //     sleep(2000);
    //     base.FindAndClick('好.png');
    //     base.FindAndClick('關閉.png');
    // }

    if (!base.waitImg('主頁_開戰_關卡2.png', 6, false)) {
        if (!base.waitImg('主頁_開戰_關卡.png', 2)) {
            throw "找不到主頁_開戰_關卡、重新執行流程";
        }
    }

    sleepAndLog(10);
    base.FindAndClick('主頁_開戰_關卡_Auto_off.png')
    var re = base.waitImgs([
        '主頁_開戰_關卡_勝利.png',
        '主頁_開戰_關卡_失敗.png'], 20);
    if (re === '主頁_開戰_關卡_勝利.png' || re === '主頁_開戰_關卡_失敗.png') {

        if (!base.waitImg('主頁_開戰_關卡_勝利_三倍獎勵.png', 3)
            || afeatures.indexOf(6) < 0 // 勾選不看廣告
        ) {
            if (!base.waitImg('主頁_開戰_關卡_勝利_下一步.png', 3)) {
                throw "找不到主頁_開戰_關卡_勝利_下一步、重新執行流程";
            }
        }
        else {
            var re = base.waitImgs(
                ['主頁_開戰_關卡_勝利_三倍獎勵_更多資訊.png',
                    '主頁_開戰_關卡_勝利_三倍獎勵_更多資訊2.png',
                    '主頁_開戰_關卡_勝利_三倍獎勵_瞭解詳情.png',
                    '主頁_開戰_關卡_勝利_三倍獎勵_已發放獎勵.png',
                ], 9);
            if (re === '主頁_開戰_關卡_勝利_三倍獎勵_更多資訊.png'
                || re === '主頁_開戰_關卡_勝利_三倍獎勵_更多資訊2.png'
                || re === '主頁_開戰_關卡_勝利_三倍獎勵_瞭解詳情.png'
            ) {
                sleep(2000);
                back();
                sleep(2000);
                back();
            }
            else {
                back();
                base.FindAndClick('主頁_開戰_關卡_勝利_三倍獎勵_關閉.png')
                // toast("三倍獎勵領取中");
                sleepAndLog(5);
            }
        }
    }
    else {
        throw "無戰後結果、重新執行流程";
    }

    // while (true) {
    //     beforeWait();
    //     if (base.FindAndClick('主頁_開戰_關卡8000_下一步.png')) {
    //         break;
    //     }
    //     afterWait();
    // }

}

function fight8000() {

    // 智障禮包廣告
    base.logClose();
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
    base.logClose();
    sleepAndLog(3);
}

function fight8000V2() {

    _clickMainPage();

    if (!base.waitImg('主頁_開戰.png', 6, false)) {
        throw "找不到主頁_開戰、重新執行流程";
    }

    if (!base.waitImg('主頁_開戰_關卡8000.png', 6, false)) {
        throw "找不到主頁_開戰_關卡8000、重新執行流程";
    }

    // 進入戰鬥延時等待秒數
    sleepAndLog(10);

    if (!base.waitImg('主頁_開戰_關卡8000_下一步.png', 6, false)) {
        throw "找不到主頁_開戰_關卡8000_下一步、重新執行流程";
    }
}

// 蒐集資源 ---
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
    // toast("執行蒐集資源");

    // _clickLeftTop();

    _clickMainPage();

    base.logClose();
    click(378, 683);
    sleepAndLog(5);

    click(545, 1242);
    base.logShow();
    sleepAndLog(5);
}

// 蒐集寶箱 ---
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
    base.logClose();
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
    base.logShow();
}

// 榮耀狩獵 ---
function shouldHounting() {

    if (afeatures.indexOf(4) < 0) {
        return false;
    }

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
    // toast("榮耀狩獵");
    if (base.FindAndClick('領地1.png') || base.FindAndClick('領地2.png')) {
        if (!base.FindAndClick('榮耀狩獵_鎖.png')) {
            base.logClose();
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
            base.logShow();
            sleepAndLog(5);

            _clickLeftTop();
        }
    }
    else {
        throw '進入領地錯誤';
    }
}

// 競技場 ---
function shouldArena() {

    if (afeatures.indexOf(2) < 0) {
        return false;
    }

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
    base.logClose();
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
    base.logShow();
    sleepAndLog(5);

    // console.log('先點左上角避免一直卡住')
    // click(80, 80);
    // sleepAndLog(3);
}

function arenaV2() {
    // toast("競技場");
    // break label 
    // ref: https://stackoverflow.com/questions/1564818/how-to-break-nested-loops-in-javascript
    if (base.FindAndClick('競技場1.png') || base.FindAndClick('競技場2.png')) {
        if (!base.FindAndClick('競技場_鎖.png')) {
            var arenaContinue = true;
            競技場:
            while (arenaContinue) {
                beforeWait();
                if (FindAndClick('競技場.png')) {
                    afterWait();
                }
                if (!base.waitImg('競技場_挑戰.png', 10)) {
                    throw "找不到競技場_挑戰、重新執行流程";
                }
                if (!base.waitImg('競技場_挑戰_挑戰.png', 10)) {
                    throw "找不到競技場_挑戰_挑戰、重新執行流程";
                }
                if (base.waitImg('競技場_挑戰_挑戰_額外挑戰次數.png', 10)) {
                    goBackUntilIndex();
                    arenaContinue = false;
                    break 競技場;
                }
            }
        }
    }
    else {
        throw '進入競技場錯誤';
    }
}

// 英雄試煉 ---
function shouldHero() {

    if (afeatures.indexOf(5) < 0) {
        return false;
    }

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

    // toast("英雄試煉");
    if (base.FindAndClick('領地1.png') || base.FindAndClick('領地2.png')) {
        if (!base.FindAndClick('英雄試煉_鎖.png')) {

            base.logClose();
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

            base.logShow();
            sleepAndLog(5);

            _clickLeftTop();
            _clickLeftTop();
        }
    }
    else {
        throw '進入領地錯誤';
    }
}

// 無限戰爭 ---
function shouldUnlimitWar() {

    if (afeatures.indexOf(1) < 0) {
        return false;
    }

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
    if (base.FindAndClick('領地1.png') || base.FindAndClick('領地2.png')) {
        if (!base.FindAndClick('賞金任務_鎖.png')) {
            base.logClose();

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

            base.logShow();
            sleepAndLog(2);
        }
    }
    else {
        throw '進入領地錯誤';
    }
}

// 賞金任務 ---
function shouldTask() {

    if (afeatures.indexOf(3) < 0) {
        return false;
    }

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
    // toast("賞金任務");
    _clickLeftTop();

    if (base.FindAndClick('領地1.png') || base.FindAndClick('領地2.png')) {
        if (!base.FindAndClick('賞金任務_鎖.png')) {

            base.logClose();
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

            base.logShow();
            sleepAndLog(2);
        }
    }
    else {
        throw '進入領地錯誤';
    }
}


// ----------
// 共用方法
// ----------

function init() {
    // 避免有時候如果點了左上角，但是戰鬥尚未結束時卡住的問題
    _clickGoBack();
}

function _clickLeftTop() {
    // console.log('點左上角'); 
    // toast('點主頁');
    base.logClose();
    click(70, 70);
    click(70, 70);
    base.logShow();
    sleepAndLog(2);
}

function _clickMainPage() {
    // console.log('點主頁'); 
    // toast('點主頁');
    // click(545, 1845);
    // sleepAndLog(2);
    // click(545, 1845);
    // sleepAndLog(2);

    if (base.FindAndClick('主頁2.png')) {
        return true;
    }
    if (base.FindAndClick('主頁.png')) {
        sleepAndLog(2);
        return true;
    }

    // 卡住處理
    if (stuckHandling()) {
        return _clickMainPage();
    }
    throw "找不到主頁、重新執行流程";

}

function _clickGoBack() {

    base.logClose();
    click(275 * 2, 525 * 2);
    sleepAndLog(2);

    click(340 * 2, 600 * 2);

    base.logShow();
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
    base.logShow();
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

function beforeWait() {
    sleep(600);
}

function afterWait() {
    sleep(600);
}


// 卡住處理
function stuckHandling() {
    var re = base.waitImgs([
        '取消.png',
        '關閉.png',
        '關閉2.png',
        '領取.png',
        '重試.png',
        '好.png',
        '提交.png',
        '主頁_開戰_關卡_下一步.png',
        '主頁_開戰_關卡_勝利_三倍獎勵_關閉.png',
    ], 1);
    if (re != false) {
        return true;
    }
    return false;
}