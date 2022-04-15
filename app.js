
const ArtOfWarAct = 'com.addictive.strategy.army.UnityPlayerActivity';
const logger = true;

// 賞金任務
const taskHours = [11, 15, 20, 21];
const taskWaitSeconds = 15;
// 賞金任務-無限戰爭
const unlimitWarHours = [9, 21, 23, 0];
const unlimitWarWaitSeconds = 305;
// 榮耀狩獵
const hountingHours = [10];
const hountingWaitSeconds = 305;
// 競技場
const arenaHours = [18, 20];
const arenaWaitSeconds = 60;
// 開戰
const fightWaitSeconds = 30;
const fight8000WaitSeconds = 30;


function sleepAndLog(times) {
    for (let i = times; i > 0; --i) {
        sleep(1000);
        log(i);
    }
}

while (true) {
    devLog('### START ###');

    init();

    if (isArtOfWarAct() === false) {
        launchGame();
    }

    if (shouldCollectResourece()) {
        collectResource();
    }

    if (shouldTask()) {
        task();
    }

    if (shouldUnlimitWar()) {
        unlimitWar();
    }

    if (shouldArena()) {
        arena();
    }

    if (shouldHounting()) {
        hounting();
    }

    if (shouldFight()) {
        // fight();
        fight8000();
    }

    devLog('### END ###');
}

function init() {
    // 避免有時候如果點了左上角，但是戰鬥尚未結束時卡住的問題
    _clickGoBack();
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
    click(100 * 2, 170 * 2);
    sleepAndLog(1);
    click(100 * 2, 170 * 2);
    // 5M
    click(185 * 2, 170 * 2);
    sleepAndLog(1);
    click(185 * 2, 170 * 2);
    // 10M
    click(265 * 2, 170 * 2);
    sleepAndLog(1);
    click(265 * 2, 170 * 2);
    // 30M
    click(350 * 2, 170 * 2);
    sleepAndLog(1);
    click(350 * 2, 170 * 2);    
    // 40M
    click(435 * 2, 170 * 2);
    sleepAndLog(1);
    click(435 * 2, 170 * 2);
    // 50M
    click(520 * 2, 170 * 2);
    sleepAndLog(1);
    click(520 * 2, 170 * 2);


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

    let rnd = random(1, 2);
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

function devLog(str) {
    if (logger === true) {
        log(str);
    }
}