
const ArtOfWarAct = 'com.addictive.strategy.army.UnityPlayerActivity';
const ArtOfWarActADS = 'com.google.android.gms.ads.AdActivity';
// const src = '/sdcard/Pictures/'; 
const src = './autojs-artofwar/Pictures/';
// const src = './pictures/'; // 打包用
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

var afeatures = [];
var base = require("./base.js");
base.start(src);
base.floaty_set();

// ----------
// 驗證
// ----------
var lot_number = rawInput("請輸入啟動序號", "123456789");
var login = base.api.getGameOpen(lot_number);
if(login){
    dialogs.build({
        //对话框标题
        title: "您好！",
        //对话框内容
        content: "使用期限：2022/12/31 23:59:59\n發現新版本: 請至原下載網站更新 \n",
        //确定键内容
        positive: "確定",
    }).on("positive", ()=>{
        launchApp('Art of War');
        automation();
    }).show();
}

// 用戶選擇模式
function automation() {
    type_id = dialogs.singleChoice(
        "請選擇類型", [
        "自動戰鬥8000關前",
        "自動戰鬥8000關後",
        "關閉"
    ]
    )
    switch (type_id) {
        case 0:
            afeatures = setFeatures();
            自動戰鬥(true);
            break;
        case 1:
            afeatures = setFeatures();
            自動戰鬥(false);
            break;
        default:
            console.hide();
            break;
    }
}
function setFeatures() {
    let storage = storages.create("RITK");
    let sFeaturesIndex = (storage.get("featuresIndex")) ? storage.get("featuresIndex") : '0';
    let afeatures = dialogs.multiChoice(
        '請選擇使用的功能',
        [
            '執行關卡',
            '賞金任務\n每次循環進行10次',
            '自動看廣告拿獎勵',
            '競技場\n每次循環進行10次\n次數不足、自動關閉',
            '英雄試煉\n次數不足、自動關閉',
            '榮耀狩獵\n(測試中)',

        ],
        sFeaturesIndex.split(',')
    );
    // 排序要跟上面一致
    var afeaturesData = [
        '執行關卡',
        '賞金任務',
        '看廣告',
        '競技場',
        '英雄試煉',
        '榮耀狩獵',
    ];
    sFeaturesIndex = afeatures.join(',');
    sFeaturesIndex = (sFeaturesIndex == "") ? '0' : sFeaturesIndex;
    storage.put("featuresIndex", sFeaturesIndex)

    var afeaturesNew = [];
    afeatures.forEach(index => {
        afeaturesNew[afeaturesNew.length] = afeaturesData[index];
    })
    sFeatures = afeaturesNew.join(',');
    sFeatures = (sFeatures == "") ? '執行關卡' : sFeatures;
    storage.put("features", sFeatures)

    return afeaturesNew;
}
function 自動戰鬥(after8000) {
    while (true) {
        try {

            log(afeatures);

            if (isArtOfWarAct() === false) { // 檢查是否啟動
                launchGame();
            }

            goBackUntilIndex(); // 返回首頁

            if (shouldCollectResourece()) { // 蒐集資源
                collectResource();
            }

            // 8000後
            if (after8000 && shouldCollectBox8000()) { // 蒐集寶箱
                collectBox8000();
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

            // 8000前
            if (!after8000 && shouldUnlock()) { // 是否有新解鎖
                unlock();
            }
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
    base.waitImgsFast(['主頁.png', '主頁2.png'], 6);
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
    if (afeatures.indexOf("執行關卡") < 0) {
        return false;
    }
    devLog('--- 執行關卡 ---');
    return true;
}

function fight() {
    // toast("執行關卡");
    _clickMainPage();
    var re = base.waitImgsFast([
        '主頁_開戰.png',
    ], 6);
    if (re === false) {
        throw "找不到主頁_開戰_關卡、重新執行流程";
    }
    var re = base.waitImgsFast([
        '主頁_開戰_關卡8000.png',
        '主頁_開戰_關卡2.png',
        '主頁_開戰_關卡.png',
    ], 6);
    if (re === false) {
        throw "找不到主頁_開戰_關卡、重新執行流程";
    }
    battleProgress(true);
}
function battleProgress(isADS) {
    // 進入戰鬥延時等待秒數
    sleepAndLog(10);
    base.FindAndClick('主頁_開戰_關卡_Auto_off.png');

    if (!isADS || afeatures.indexOf("看廣告") < 0) { // 不看廣告
        var re = base.waitImgsFast([
            '主頁_開戰_關卡8000_下一步.png',
        ], 40);
        if (re === false) {
            throw "無戰後結果、重新執行流程";
        }
    }
    else {
        var re = base.waitImgsFast([
            '主頁_開戰_關卡_勝利.png',
            '主頁_開戰_關卡_失敗.png',
        ], 25);
        if (re === '主頁_開戰_關卡_勝利.png' || re === '主頁_開戰_關卡_失敗.png') {

            var re = base.waitImgsFast([
                '主頁_開戰_關卡_勝利_三倍獎勵.png',
                '主頁_開戰_關卡_勝利_四倍獎勵.png',
            ], 25);
            if (re === false) {
                if (!base.waitImg('主頁_開戰_關卡8000_下一步.png', 2)) {
                    throw "找不到主頁_開戰_關卡8000_下一步、重新執行流程";
                }
            }
            else if (re === '主頁_開戰_關卡_勝利_三倍獎勵.png') {
                var re = base.waitImgsFast(
                    ['主頁_開戰_關卡_勝利_三倍獎勵_更多資訊.png',
                        '主頁_開戰_關卡_勝利_三倍獎勵_更多資訊2.png',
                        '主頁_開戰_關卡_勝利_三倍獎勵_瞭解詳情.png',
                        '主頁_開戰_關卡_勝利_三倍獎勵_已發放獎勵.png',
                    ], 18);
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
    log("收集");
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

    if (afeatures.indexOf('榮耀狩獵') < 0) {
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
    if (afeatures.indexOf('競技場') < 0) {
        return false;
    }
    devLog('--- 執行競技場 ---');
    return true;
}

function arenaV2() {
    if (base.FindAndClick('競技場1.png') || base.FindAndClick('競技場2.png')) {
        if (!base.FindAndClick('競技場_鎖.png')) {
            var index = 0;
            while (index < 5) {
                index = index + 1;
                log('第'+index+'次');
                beforeWait();
                if (base.FindAndClick('競技場.png')) {
                    afterWait();
                }
                if (!base.waitImg('競技場_挑戰.png', 10)) {
                    throw "找不到競技場_挑戰、重新執行流程";
                }
                if (!base.waitImg('競技場_挑戰_挑戰.png', 10)) {
                    throw "找不到競技場_挑戰_挑戰、重新執行流程";
                }
                var re = base.waitImgsFast(['主頁_開戰.png',], 6);
                if (re === false) {
                    break;
                }
                battleProgress(false);

                // 再檢查一次有沒有按到下一步
                base.waitImgsFast(['主頁_開戰_關卡8000_下一步.png',], 1);

                // 關閉禮包
                var re = base.waitImgsFast([
                    '關閉.png',
                    '關閉2.png',
                    '關閉3.png',
                ], 1);
            }
            // base.waitImgsFast(['競技場_領取獎勵.png',], 10);
            if (base.waitImg('競技場_挑戰_挑戰_額外挑戰次數.png', 2)) {
                log("次數已達上限、自動關閉");
                var key = afeatures.indexOf('競技場');
                if (key !== -1) {
                    afeatures.splice(key, 1);
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
    if (afeatures.indexOf('英雄試煉') < 0) {
        return false;
    }
    return true;
}

function hero() {
    _clickLeftTop();
    if (base.FindAndClick('領地1.png') || base.FindAndClick('領地2.png')) {
        if (!base.FindAndClick('英雄試煉_鎖.png')) {
            if (!base.waitImg('英雄試煉.png', 3)) {
                throw "找不到英雄試煉、重新執行流程";
            }
            sleep(2000);
            log('英雄試煉_前往');
            base.logClose();
            click(850,645);
            sleep(500);
            click(850,645);
            sleep(500);
            base.logShow();
            
            var index = 0;
            log('英雄試煉_前往_挑戰');
            while (index < 10 && base.waitImg('英雄試煉_前往_挑戰.png', 5)) {

                log("檢查次數");
                if( base.Find('英雄試煉_前往_挑戰_提示.png')){
                    log("次數已達上限、自動關閉");
                    var key = afeatures.indexOf('英雄試煉');
                    if (key !== -1) {
                        afeatures.splice(key, 1);
                    }
                    break;
                }
                index = index + 1;
                log('第'+index+'次');
                log('英雄試煉_前往_挑戰_挑戰');
                re = base.waitImgsFast([
                    '英雄試煉_前往_挑戰_挑戰.png',
                ], 10);
                
                log('英雄試煉_前往_挑戰_挑戰_挑戰');
                re = base.waitImgsFast([
                    '英雄試煉_前往_挑戰_挑戰_挑戰.png',
                ], 10);
                battleProgress(false);
            }
            sleepAndLog(2);
            _clickLeftTop();
        }
    }
    else {
        throw '進入領地錯誤';
    }
}

// 賞金任務 ---
function shouldTask() {
    if (afeatures.indexOf('賞金任務') < 0) {
        return false;
    }
    devLog('--- 執行賞金任務 ---');
    return true;
}

function task() {
    // toast("賞金任務");
    _clickLeftTop();
    if (base.FindAndClick('領地1.png') || base.FindAndClick('領地2.png')) {
        if (!base.FindAndClick('賞金任務_鎖.png')) {
            if (!base.waitImg('賞金任務.png', 3)) {
                throw "找不到賞金任務、重新執行流程";
            }
            var index = 0;
            while (index < 10 && base.waitImg('賞金任務_挑戰.png', 3)) {
                index = index + 1;
                log('第'+index+'次');
                var re = base.waitImgsFast([
                    '主頁_開戰.png',
                ], 6);
                if (re === false) {
                    throw "找不到主頁_開戰_關卡、重新執行流程";
                }
                battleProgress(true);
            }
            if (!base.Find('賞金任務_挑戰.png')) {
                log("次數已達上限、自動關閉");
                var key = afeatures.indexOf('賞金任務');
                if (key !== -1) {
                    afeatures.splice(key, 1);
                }
            }
            sleepAndLog(2);
            _clickLeftTop();
        }
    }
    else {
        throw '進入領地錯誤';
    }
}


// ----------
// 共用方法
// ----------

// 返回主頁
function goBackUntilIndex() {
    var index = 0;
    while (index < 10) {
        index = index + 1;
        launchApp('Art of War');
        beforeWait();
        var re = base.waitImgsFast([
            '關閉.png',
            '返回.png',
            '主頁.png',
            '主頁2.png',
        ], 1);
        if (re === '主頁.png'
            || re === '主頁2.png'
        ) {
            break;
        }
        _clickLeftTop();
        if (index % 3 == 0)
            back();
        stuckHandling();
        afterWait();
    }
    if (index >= 10)
        throw '未知錯誤1';
}


function _clickLeftTop() {
    base.logClose();
    click(70, 70);
    sleep(500);
    click(70, 70);
    sleep(500);
    if (base.Find('玩家信息.png')) {
        click(70, 70);
    }
    base.logShow();
}

function _clickMainPage() {
    var re = base.waitImgsFast([
        '主頁2.png',
        '主頁.png',
    ], 1);
    if (re != false) {
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
    var re = base.waitImgsFast([
        '取消.png',
        '關閉.png',
        '關閉2.png',
        '領取.png',
        '重試.png',
        '好.png',
        '提交.png',
        '主頁_開戰_繼續.png',
        '主頁_開戰_關卡_下一步.png',
        '主頁_開戰_關卡_勝利_三倍獎勵_關閉.png',
    ], 1);
    if (re != false) {
        log(re);
        return true;
    }
    return false;
}