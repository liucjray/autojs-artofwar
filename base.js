var base = {};
base.start = function (src) {
    if (!requestScreenCapture(false)) {
        toast("请求截图失败");
        exit();
    }
    auto();
    this.w = false;
    this.src = src;
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
// 截圖
base.rootGetScreen = function () {
    captureScreen('/storage/emulated/0/sc.png');
    // shell("screencap -p " + this.src + "sc.png", true)
    // sleep(100)
    // setTimeout(() => {
    //     files.remove(this.src + "sc.png")
    // }, 1000)
    return images.read('/storage/emulated/0/sc.png')
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
base.ScanPicsAndClick = function (pics) {
    var img = this.rootGetScreen();
    log(pics);
    var re = false;
    pics.forEach(pic => {
        var wx = images.read(this.src + pic);
        var p = findImage(img, wx);
        if (p) {
            // toast(pic);
            log([p.x, p.y])
            click(p.x, p.y);
            re = true;
        }
        else {
            // log("Not found: " + pic);
        }
        wx.recycle();
    });
    img.recycle();
    return re;
}
base.waitImg = function (name, max) {
    var index = 0;
    while (index < max) {
        index = index + 1;
        sleep(500);
        if (base.FindAndClick(name)) {
            break;
        }
        sleep(500);
    }
    return index < max;
}
base.waitImgsFast = function (names, max) {
    this.logClose();
    var reName = "";
    for (var index = 0; index < max; index++) {
        log('進行中(' + (index+1) + '/' + max + ')');
        var img = this.rootGetScreen();
        sleep(800);
        names.forEach(name => {
            if(index < max){
                var wx = images.read(this.src + name);
                var p = findImage(img, wx);
                if (p) {
                    click(p.x, p.y);
                    reName = name;
                    index = max;
                }
                wx.recycle();
                sleep(10);
            }
        });
        img.recycle();
    }
    this.logShow();
    if (reName != '') {
        return reName;
    }
    return index < max;
}

module.exports = base;