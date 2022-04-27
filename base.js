var base = {};
base.start = function (src) {
    if (!requestScreenCapture(false)) {
        toast("请求截图失败");
        exit();
    }
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
    captureScreen(this.src + 'sc.png');
    // shell("screencap -p " + this.src + "sc.png", true)
    // sleep(100)
    // setTimeout(() => {
    //     files.remove(this.src + "sc.png")
    // }, 1000)
    return images.read(this.src + 'sc.png')
}
// 用圖片找點
base.FindAndClick = function (png, isToast) {
    isToast = (typeof isToast !== 'undefined') ?  isToast : true;
    this.logClose();
    var img = this.rootGetScreen();
    var name = png.replace('.png', '')
    log(name);
    var wx = images.read(this.src + png);
    var p = findImage(img, wx);
    var re = false;
    if (p) {
        if(isToast)
            toast(name);
        log("click : " + png);
        // log([p.x, p.y])
        click(p.x, p.y);
        re = true;
    }
    else {
        // log("No : " + name)
    }
    this.logShow();
    img.recycle();
    wx.recycle();
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
            toast(pic);
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
base.waitImg = function (name, max, isToast) {
    var index = 0;
    while (index < max) {
        index = index + 1;
        beforeWait();
        if (base.FindAndClick(name, isToast)) {
            break;
        }
        afterWait();
    }
    return index < max;
}
base.waitImgs = function (names, max) {
    var reName = "";
    for (var index = 0; index < max; index++) {
        log([index, max]);
        var img = this.rootGetScreen();
        sleep(800);
        names.forEach(name => {
            if(index < max){
                var wx = images.read(this.src + name);
                var p = findImage(img, wx);
                if (p) {
                    toast(name.replace('.png', ''));
                    log("click : " + name);
                    click(p.x, p.y);
                    reName = name;
                    index = max;
                }
                else {
                    // log("No : " + name)
                }
                wx.recycle();
                sleep(100);
            }
        });
        img.recycle();
    }
    if (reName != '') {
        return reName;
    }
    return index < max;
}

module.exports = base;