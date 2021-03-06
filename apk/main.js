// const src = '/sdcard/Pictures/'; 
// const src = './autojs-artofwar/apk/Pictures/';
const src = './pictures/'; // 打包用
const version = '1.1.4';
const gane_id = '1';
const logger = true;
const ArtOfWarPackageName = 'com.addictive.strategy.army';
const ArtOfWarAct = 'com.addictive.strategy.army.UnityPlayerActivity';
var is_auto_off = true;
var isLogin = false;
var storage = storages.create("RITK");
var number_error = 0;
var type_id = false;
var afeatures = [];
var aCollectBox = [0, 0];
var base = require("./base.js");
base.start(src, version);
base.floaty_set();

// ----------
// 驗證
// ----------
var thread_login = threads.start(function () {
    log("版本：" + app.versionCode);
    let storage_lot_number = (storage.get("lot_number")) ? storage.get("lot_number") : '123456789';
    var lot_number = rawInput("請輸入啟動序號", storage_lot_number);
    isLogin = base.api.getGameOpen(lot_number);
    if (isLogin) { // 序號認證成功
        storage.put("lot_number", lot_number);
        dialogs.build({
            //对话框标题
            title: "您好！",
            //对话框内容
            content: "使用期限：2022/12/31 23:59:59"
                // + "\n發現新版本: 請下載網站更新 \n"
                + "\n有任何問題或建議請私訊臉書粉絲團",
            //确定键内容
            positive: "確定",
            negative: "下載",
            neutral: "臉書粉絲團",
        }).on("negative", () => {
            //监听中性键
            // app.openUrl("https://mega.nz/");
            app.openUrl("https://www.facebook.com/AOW%E5%8A%A9%E6%89%8B-108406395191937/");
            console.hide();
            exit();
        }).on("neutral", () => {
            //监听中性键
            app.openUrl("https://www.facebook.com/AOW%E5%8A%A9%E6%89%8B-108406395191937/");
            console.hide();
            exit();
        }).show();
    }
    else {
        // 認證失敗
        dialogs.build({
            //对话框标题
            title: "您好！",
            //对话框内容
            content: "認證失敗、請確認您的序號及有效期限"
                + "\n有任何問題及建議請私訊臉書粉絲團 \n",
            //确定键内容
            positive: "確定",
            neutral: "臉書粉絲團",
        }).on("neutral", () => {
            //监听中性键
            app.openUrl("https://www.facebook.com/AOW%E5%8A%A9%E6%89%8B-108406395191937/");
        }).show();
        console.hide();
    }
});
thread_login.join();
if (base.api.lot_number != "" && isLogin) {
    try {
        automation(); 1
    } catch (e) {
        log('例外處理5');
        log(e);
        automation();
    }
}
else {
    log("發生異常");
    exit();
}


// 用戶選擇模式
function automation() {
    launchApp('Art of War');
    if (type_id === false) {
        type_id = dialogs.singleChoice(
            "請選擇類型", [
            "自動戰鬥8000關前",
            "自動戰鬥8000關後",
            "關閉"
        ]
        )
    }
    switch (type_id) {
        case 0:
        case 1:
            afeatures = setFeatures();
            自動戰鬥(type_id == 0);
            break;
        default:
            log("終止程序");
            console.hide();
            exit();
            break;
    }
}
function setFeatures() {
    let sFeaturesIndex = (storage.get("featuresIndex")) ? storage.get("featuresIndex") : '0';

    var items = [];
    var afeaturesData = [];
    if (base.api.lot_number == "britbritbrit") {
        items = [
            '#執行關卡#',
            '#自動看廣告拿獎勵#',
            '#檢查寶箱列表、並領取#',
            '#賞金任務#\n每次循環進行10次',
            '#競技場#\n每次循環進行10次\n次數不足、自動關閉',
            '#英雄試煉#\n次數不足、自動關閉',
            '#榮耀狩獵#\n次數不足、自動關閉',
        ];
        afeaturesData = [
            '執行關卡',
            '看廣告',
            '寶箱列表',
            '賞金任務',
            '競技場',
            '英雄試煉',
            '榮耀狩獵',
        ];
    }
    else {
        items = [
            '#執行關卡#',
            '#自動看廣告拿獎勵#',
            '#檢查寶箱列表、並領取#',
            '#賞金任務#\(試用版暫不開放)',
            '#競技場#\n(試用版暫不開放)',
            '#英雄試煉#\n(試用版暫不開放)',
            '#榮耀狩獵#\n(試用版暫不開放)',
        ];
        afeaturesData = [
            '執行關卡',
            '看廣告',
            '寶箱列表',
        ];
    }
    let afeaturesOne = dialogs.multiChoice(
        '請選擇使用的功能', items, sFeaturesIndex.split(',')
    );
    sFeaturesIndex = afeaturesOne.join(',');
    sFeaturesIndex = (sFeaturesIndex == "") ? '0' : sFeaturesIndex;
    storage.put("featuresIndex", sFeaturesIndex)

    var afeaturesNew = [];
    afeaturesOne.forEach(index => {
        if (afeaturesData.hasOwnProperty(index))
            afeaturesNew[afeaturesNew.length] = afeaturesData[index];
    })
    sFeatures = afeaturesNew.join(',');
    sFeatures = (sFeatures == "") ? '執行關卡' : sFeatures;
    storage.put("features", sFeatures)

    return afeaturesNew;
}
function 自動戰鬥(after8000) {
    try {
        var while_index = 0;
        while (while_index < 300) {
            while_index = while_index + 1;
            try {
                log(afeatures);
                // 檢查是否啟動
                if (isArtOfWarAct() === false) {
                    launchGame();
                }
                // 返回首頁
                goBackUntilIndex();

                // 蒐集資源
                if (shouldCollectResourece()) {
                    collectResource();
                }
                // 蒐集寶箱
                if (shouldCollectBox()) {
                    collectBox();
                }
                // 競技場
                if (shouldArena()) {
                    arenaV2();
                }
                // 賞金任務
                if (shouldTask()) {
                    task();
                }
                // 榮耀狩獵
                if (shouldHounting()) {
                    hounting();
                }
                // 英雄試煉
                if (shouldHero()) {
                    hero();
                }
                // 執行關卡
                if (shouldFight()) {
                    fight();
                }
                // 是否有新解鎖 8000前
                if (!after8000 && shouldUnlock()) {
                    unlock();
                }
            }
            catch (e) {
                devLog(e);
                // 卡住處理
                log("例外處理1");
                stuckHandling();
            }

        }
        base.closeApp(ArtOfWarPackageName);
        sleepAndLog(5);
        自動戰鬥(after8000);
    } catch (e) {
        log('例外處理4');
        log(e);
        自動戰鬥(after8000);
    }

}

// ----------
// 遊戲模組
// ----------


// 檢查是否啟動
function isArtOfWarAct() {
    return currentActivity() === ArtOfWarAct || (currentActivity().indexOf('ads') >= 0);
}

// 啟動遊戲
function launchGame() {
    devLog(currentActivity());
    devLog('--- 檢查並非在遊戲中, 重新進入遊戲 ---');
    launch(ArtOfWarPackageName);
    sleepAndLog(5);
    base.waitImgsFast([
        '主頁.png',
        '主頁2.png',
        '主頁3.png',
        '主頁4.png',
    ], 10);
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
    do {
        var re = base.waitImgsFast([
            '主頁_開戰.png',
        ], 10);
        if (re === false) {
            throw "找不到主頁_開戰_關卡、重新執行流程";
        }
        var re = base.waitImgsFast([
            '主頁_開戰_關卡8000.png',
            '主頁_開戰_關卡2.png',
            '主頁_開戰_關卡.png',
        ], 10);
        if (re === false) {
            throw "找不到主頁_開戰_關卡、重新執行流程";
        }
        battleProgress(true, 5, 100);
    } while (afeatures.indexOf("執行關卡") >= 0 && afeatures.length == 1);
}

function battleProgress(isADS, waitSec, times) {
    // 進入戰鬥延時等待秒數
    sleepAndLog(waitSec);
    if (is_auto_off) {
        base.FindAndClick('主頁_開戰_關卡_Auto_off.png');
        is_auto_off = false;
    }
    if (!isADS || afeatures.indexOf("看廣告") < 0) { // 不看廣告
        var re = base.waitImgsFast([
            '下一步.png',
            '主頁_開戰_關卡8000_下一步.png',
        ], times);
        log(re);
        if (re === false) {
            throw "無戰後結果、重新執行流程";
        }
    }
    else {
        var re = base.waitImgsFast([
            '勝利.png',
            '主頁_開戰_關卡_勝利.png',
            '主頁_開戰_關卡_失敗.png',
        ], times);
        log(re);
        if (re === false) {
            throw "無戰後結果、重新執行流程";
        }
        else {
            re = base.waitImgsFast([
                '主頁_開戰_關卡_勝利_三倍冷卻中.png',
                '主頁_開戰_關卡_勝利_三倍獎勵.png',
                '主頁_開戰_關卡_勝利_四倍獎勵.png',
                '主頁_開戰_關卡_勝利_重試.png',
                '勝利.png',
            ], 25);
            log(re);
            if (re === false ||
                re === '主頁_開戰_關卡_勝利_三倍冷卻中.png' ||
                re === '勝利.png' ||
                re === '主頁_開戰_關卡_勝利_重試.png'
            ) {
                if (!base.waitImg('主頁_開戰_關卡8000_下一步.png', 2)) {
                    throw "找不到主頁_開戰_關卡8000_下一步、重新執行流程";
                }
            }
            else if (re === '主頁_開戰_關卡_勝利_三倍獎勵.png') {
                re = base.waitImgsFast(
                    ['主頁_開戰_關卡_勝利_三倍獎勵_更多資訊.png',
                        '主頁_開戰_關卡_勝利_三倍獎勵_更多資訊2.png',
                        '主頁_開戰_關卡_勝利_三倍獎勵_瞭解詳情.png',
                        '主頁_開戰_關卡_勝利_三倍獎勵_已發放獎勵.png',
                        '主頁_開戰_關卡_勝利_三倍獎勵_已發放獎勵1.png',
                        '主頁_開戰_關卡_勝利_三倍獎勵_立即觀看.png',
                        '主頁_開戰_關卡_勝利_三倍獎勵_立即下載.png',
                    ], 18);
                log(re);
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
                    sleepAndLog(2);
                }
            }
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
    base.logClose();
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
function shouldCollectBox() {
    if (afeatures.indexOf('寶箱列表') < 0) {
        return false;
    }
    if (aCollectBox[0] < aCollectBox[1]) {
        log('等待中、不執行')
        return false;
    }
    log('執行蒐集寶箱')
    return true;
}

function collectBox() {
    _clickMainPage();

    // 主頁_寶箱
    var re = base.waitImgsFast([
        '主頁_寶箱.png',
        '主頁_寶箱1.png',
    ], 3);
    if (re === false) {
        throw "無主頁_寶箱、重新執行流程";
    }
    sleep(2000);
    var re = base.waitImgsFast([
        '主頁_寶箱_打開.png',
    ], 3);
    if (re === false) {
        log("沒有需要打開的寶箱、等待20分鐘後再檢查");
        let now = Date.parse(new Date());
        aCollectBox[0] = now;
        aCollectBox[1] = now + (60 * 20 * 1000);
        base.FindAndClick('關閉.png');
    }
    else {
        for (let i = 0; i < 5; i++) {
            sleep(5000);
            var re = base.waitImgsFast([
                '主頁_寶箱_打開_好.png',
            ], 3);
            if (re === false) {
                break;
            }
        }
    }
}

// 榮耀狩獵 ---
function shouldHounting() {
    if (afeatures.indexOf('榮耀狩獵') < 0) {
        return false;
    }
    return true;
}

function hounting() {
    _clickLeftTop();
    _clickMainPage();
    if (base.FindAndClick('領地1.png') || base.FindAndClick('領地2.png')) {
        if (!base.waitImg('榮耀狩獵.png', 3)) {
            throw "找不到榮耀狩獵、重新執行流程";
        }
        var index = 0;
        while (index < 4 && base.waitImg('榮耀狩獵_挑戰.png', 3)) {
            index = index + 1;
            log('第' + index + '次');
            var re = base.waitImgsFast([
                '榮耀狩獵_挑戰_開戰.png',
            ], 10);
            if (re === false) {
                throw "找不到榮耀狩獵_挑戰_開戰、重新執行流程";
            }
            battleProgress(false, 10, 100);
        }
        if (!base.Find('榮耀狩獵_挑戰.png')) {
            log("次數已達上限、自動關閉");
            var key = afeatures.indexOf('榮耀狩獵');
            if (key !== -1) {
                afeatures.splice(key, 1);
            }
        }
        sleepAndLog(2);
        _clickLeftTop();
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
        var re = base.waitImgsFast([
            '關閉.png',
            '關閉2.png',
            '關閉3.png',
            '關閉4.png',
        ], 1);
        var index = 0;
        while (index < 5) {
            index = index + 1;
            log('第' + index + '次');
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
            var re = base.waitImgsFast(['主頁_開戰.png',], 10);
            if (re === false) {
                break;
            }
            battleProgress(false, 15, 200);

            // 再檢查一次有沒有按到下一步
            base.waitImgsFast(['主頁_開戰_關卡8000_下一步.png',], 1);

            // 關閉禮包
            var re = base.waitImgsFast([
                '關閉.png',
                '關閉2.png',
                '關閉3.png',
                '關閉4.png',
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
        if (!base.waitImg('英雄試煉.png', 3)) {
            throw "找不到英雄試煉、重新執行流程";
        }
        sleep(2000);
        log('英雄試煉_前往');
        base.logClose();
        click(850, 645);
        sleep(500);
        click(850, 645);
        sleep(500);
        base.logShow();

        var index = 0;
        log('英雄試煉_前往_挑戰');
        while (index < 10 && base.waitImg('英雄試煉_前往_挑戰.png', 5)) {
            log("檢查次數");
            if (base.Find('英雄試煉_前往_挑戰_提示.png')) {
                log("次數已達上限、自動關閉");
                var re = base.waitImgsFast([
                    '關閉.png',
                    '關閉2.png',
                    '關閉3.png',
                    '關閉4.png',
                    '英雄試煉_前往_挑戰_提示_確認.png',
                ], 1);
                var key = afeatures.indexOf('英雄試煉');
                if (key !== -1) {
                    afeatures.splice(key, 1);
                }
                break;
            }
            index = index + 1;
            log('第' + index + '次');
            log('英雄試煉_前往_挑戰_挑戰');
            re = base.waitImgsFast([
                '英雄試煉_前往_挑戰_挑戰.png',
            ], 10);

            log('英雄試煉_前往_挑戰_挑戰_挑戰');
            re = base.waitImgsFast([
                '英雄試煉_前往_挑戰_挑戰_挑戰.png',
            ], 10);
            battleProgress(false, 10, 100);
        }
        sleepAndLog(2);
        _clickLeftTop();
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
        if (!base.waitImg('賞金任務.png', 3)) {
            throw "找不到賞金任務、重新執行流程";
        }
        var index1 = 0;
        log('優先處理非無限戰爭')
        while (index1 < 20 && base.waitImgsFastRegion([
            '賞金任務_挑戰.png',
        ], 3, 0, 800)) {
            index1 = index1 + 1;
            log('第' + index1 + '次');
            var re = base.waitImgsFast([
                '主頁_開戰.png',
                '賞金任務_挑戰.png',
            ], 10);
            if (re === false) {
                throw "找不到賞金任務_開戰、重新執行流程";
            }
            else if (re === '賞金任務_挑戰.png') {
                re = base.waitImgsFast([
                    '主頁_開戰.png',
                ], 10);
                if (re === false) {
                    break;
                }
            }
            battleProgress(false, 5, 100);
        }
        var index2 = 0;
        log('下滑確認是否還有挑戰')
        sleep(1000);
        swipe(500, 1600, 500, 300, 600);
        sleep(1000);
        while (index2 < 10 && base.waitImgsFastRegion([
            '賞金任務_挑戰.png',
        ], 3, 0, 800)) {
            index2 = index2 + 1;
            log('第' + index2 + '次');
            var re = base.waitImgsFast([
                '主頁_開戰.png',
                '賞金任務_挑戰.png',
            ], 10);
            if (re === false) {
                throw "找不到賞金任務_開戰、重新執行流程";
            }
            else if (re === '賞金任務_挑戰.png') {
                re = base.waitImgsFast([
                    '主頁_開戰.png',
                ], 10);
                if (re === false) {
                    break;
                }
            }
            battleProgress(false, 5, 100);
            sleep(1000);
            swipe(500, 1600, 500, 300, 600);
            sleep(1000);
        }
        log('無限戰爭')
        var index3 = 0;
        while (index3 < 10 && base.waitImg('賞金任務_挑戰.png', 3)) {
            index3 = index3 + 1;
            log('第' + index3 + '次');
            var re = base.waitImgsFast([
                '主頁_開戰.png',
                '賞金任務_挑戰.png',
            ], 10);
            if (re === false) {
                throw "找不到賞金任務_開戰、重新執行流程";
            }
            else if (re === '賞金任務_挑戰.png') {
                re = base.waitImgsFast([
                    '主頁_開戰.png',
                ], 10);
                if (re === false) {
                    if (base.Find('提示.png') && index1 == 0 && index2 == 0) {
                        log("次數已達上限、領取傷害獎勵");
                        taskAward();
                        var key = afeatures.indexOf('賞金任務');
                        if (key !== -1) {
                            afeatures.splice(key, 1);
                        }
                        break;
                    }
                    throw "找不到賞金任務_開戰、重新執行流程";
                }
            }
            battleProgress(false, 5, 100);
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
    else {
        throw '進入領地錯誤';
    }
}
function taskAward() {
    taskAwardCheck();
    log("500K");
    click(190, 330);
    click(190, 330);
    taskAwardCheck();
    log("1M");
    click(360, 330);
    click(360, 330);
    taskAwardCheck();
    log("5M");
    click(530, 330);
    click(530, 330);
    taskAwardCheck();
    log("8M");
    click(700, 330);
    click(700, 330);
    taskAwardCheck();
    log("12M");
    click(870, 330);
    click(870, 330);
    taskAwardCheck();
    log("15M");
    click(1040, 330);
    click(1040, 330);
    taskAwardCheck();
    base.logShow();
}
function taskAwardCheck() {
    var re = base.waitImgsFast([
        '關閉.png',
    ], 2);
    sleep(1000);
    base.logClose();
}

// ----------
// 共用方法
// ----------

// 返回主頁
function goBackUntilIndex() {
    log("回到主頁");
    var index = 0;
    while (index < 10) {
        index = index + 1;
        log("回到主頁第" + index + '次');
        launchApp('Art of War');
        beforeWait();
        var re = base.waitImgsFast([
            '關閉.png',
            '返回.png',
            '主頁.png',
            '主頁2.png',
            '主頁3.png',
            '主頁4.png',
        ], 1);
        log(re);
        if (re === '主頁.png' ||
            re === '主頁2.png' ||
            re === '主頁3.png' ||
            re === '主頁4.png'
        ) {
            number_error = 0;
            break;
        }
        else if (re === '關閉.png') {
            continue;
        }
        else {
            if (base.Find('主頁_開戰.png')) {
                number_error = 0;
                break;
            }
        }
        // 連續三次返回加左上角
        if (index % 3 == 0) {
            back();
            _clickLeftTop();
        }
        else {
            base.FindAndClick('領地2.png');
        }
        log("例外處理2");
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
        '主頁.png',
        '主頁2.png',
        '主頁3.png',
        '主頁4.png',
    ], 1);
    if (re != false) {
        return true;
    }
    // 卡住處理
    log("例外處理3");
    if (stuckHandling()) {
        return _clickMainPage();
    }
    throw "找不到主頁、重新執行流程";
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
    number_error = number_error + 1;
    log('Handling : ' + number_error);
    if (number_error > 4) {
        number_error = 0;
        base.closeApp(ArtOfWarPackageName);
        sleepAndLog(5);
    }
    else {
        home();
        launchApp('Art of War');
    }
    var re = base.waitImgsFast([
        '取消.png',
        '關閉.png',
        '關閉2.png',
        '關閉3.png',
        '關閉4.png',
        '領取.png',
        '重試.png',
        '好.png',
        '主頁_解鎖_好.png',
        '主頁_寶箱_打開_好.png',
        '提交.png',
        '主頁_開戰_繼續.png',
        '主頁_開戰_關卡_下一步.png',
        '主頁_開戰_關卡_勝利_三倍獎勵_關閉.png',
    ], 1);
    if (re != false) {
        log(re);
        return true;
    }
    base.FindAndClick('領地2.png');
    return false;
}