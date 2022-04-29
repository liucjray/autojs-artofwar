var base = {};
base.api = require("./api.js");
base.start = function (src) {
    if (!requestScreenCapture(false)) {
        toast("请求截图失败");
        exit();
    }
    auto();
    this.w = false;
    this.src = src;
    base.api.construct();
}
// 懸浮框初始化
base.floaty_set = function () {
    log("开启悬浮窗");
    try {
        this.w = floaty.window('<vertical><button id="show" text="顯示流程框" /><button id="stop" text="關閉程式" /></vertical>');
        this.w.setPosition(device.width - 300, device.height - 400);
        this.w.show.click(function () {
            threads.start(function () {
                console.hide();
                sleep(600);
                console.show();
                sleep(300);
                console.setPosition(0, 0);
                sleep(300);
                console.setSize(device.width, device.height / 2)
                sleep(300);
            });
        });
        this.w.stop.click(function () {
            toast("腳本終止、手動關閉");
            console.hide();
            this.w.setPosition(device.width - 50, device.height / 3);
            this.w.setSize(0, 0);
            this.w.close();
            exit();
        });
        this.w.setSize(0, 0);
        sleep(200);
        console.hide();
        sleep(600);
        this.w.setSize(-2, -2);
        sleep(200);
        console.show();
        sleep(200);
        console.setPosition(0, 0);
        sleep(200)
        console.setSize(device.width, device.height / 2)
        sleep(200);
    } catch (e) {
        log(e)
    }
}
// 懸浮框顯示
base.logShow = function () {
    try {
        if (this.w) {
            this.w.setSize(-2, -2);
            sleep(200);
            console.setPosition(0, 0);
            sleep(200);
        }
    }
    catch (e) {
        log(e)
    }
}
// 懸浮框關閉
base.logClose = function () {
    try {
        if (this.w) {
            this.w.setSize(0, 0);
            sleep(200);
            console.setPosition(5000, 5000);
            sleep(500);
        }
    }
    catch (e) {
        log(e)
    }
}
base.floaty_msg = function (msg) {
    if(msg==""){
        if(this.fMsg){
            this.fMsg.close();
        }
        return true;
    }
    if(this.fMsg){
        this.fMsg.close();
    }
    this.fMsg = floaty.window(
        <frame gravity="center">
            <text id="fMsg" color="#33CCFF" text="" textSize="18sp" />
        </frame>
    );
    if(this.fMsg){
        this.fMsg.setPosition(200, 10);
        this.fMsg.fMsg.setText(msg);
    }
    
}
// 截圖
base.rootGetScreen = function () {
    this.floaty_msg(""); // 確保截圖不受影響
    captureScreen('/storage/emulated/0/sc.png');
    // shell("screencap -p " + this.src + "sc.png", true)
    // sleep(100)
    // setTimeout(() => {
    //     files.remove(this.src + "sc.png")
    // }, 1000)
    return images.read('/storage/emulated/0/sc.png')
}
base.Find = function (png) {
    this.logClose();
    var img = this.rootGetScreen();
    var name = png.replace('.png', '')
    var wx = images.read(this.src + png);
    var p = findImage(img, wx);
    var re = false;
    if (p) {
        log(name);
        re = true;
    }
    else {
        // log("No : " + name)
    }
    img.recycle();
    wx.recycle();
    this.logShow();
    return re;
}
// 用圖片找點
base.FindAndClick = function (png) {
    this.logClose();
    var img = this.rootGetScreen();
    var name = png.replace('.png', '')
    log(name);
    var wx = images.read(this.src + png);
    var p = findImage(img, wx);
    var re = false;
    if (p) {
        // toast(name);
        // log("click : " + png);
        // log([p.x, p.y])
        click(p.x, p.y);
        re = true;
    }
    else {
        // log("No : " + name)
    }
    img.recycle();
    wx.recycle();
    this.logShow();
    return re;
}
base.waitImg = function (png, max) {
    var index = 0;
    while (index < max) {
        index = index + 1;
        var name = png.replace('.png', '')
        this.floaty_msg(name + " : 進行中(" + index + "/" + max + ")");
        sleep(500);
        if (base.FindAndClick(png)) {
            break;
        }
        sleep(500);
    }
    this.floaty_msg("");
    return index < max;
}
base.waitImgsFast = function (pngs, max) {
    this.logClose();
    var reName = "";
    for (var index = 0; index < max; index++) {
        log('進行中(' + (index + 1) + '/' + max + ')');
        var img = this.rootGetScreen();
        sleep(800);
        pngs.forEach(png => {
            if (index < max) {
                var name = png.replace('.png', '')
                this.floaty_msg(name + " : 進行中(" + index + "/" + max + ")");
                var wx = images.read(this.src + png);
                var p = findImage(img, wx);
                if (p) {
                    click(p.x, p.y);
                    reName = png;
                    index = max;
                }
                wx.recycle();
                sleep(10);
            }
        });
        img.recycle();
    }
    this.floaty_msg("");
    this.logShow();
    if (reName != '') {
        return reName;
    }
    return index < max;
}
base.closeApp = function (packageName) {
    app.openAppSetting(packageName);
    sleep(1000);
    text(app.getAppName(packageName)).waitFor();
    sleep(1000);
    let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne();
    if (is_sure.enabled()) {
        sleep(1000);
        textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne().click();
        sleep(500);
        textMatches(/(.*确.*|.*定.*)/).findOne().click();
        log(app.getAppName(packageName) + "應用程式已關閉");
        sleep(1000);
        back();
        sleep(3000);
        launch(packageName);
    } else {
        log(app.getAppName(packageName) + "應用程式無法關閉");
        back();
    }
}
module.exports = base;