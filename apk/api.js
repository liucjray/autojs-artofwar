var api = {};
var _ = require("./lodash.js");
api.host = '';
api.game_id = '';
api.game_version = '';
api.lot_number = '';
api.construct = function () {
  api.host = 'https://autohelper.pro/';
};
api.call = function (params) {

  let data = _.has(params, 'data') ? params.data : null;
  let method = _.has(params, 'method') ? params.method : "";
  let uri = _.has(params, 'uri') ? params.uri : "";
  let options = _.has(params, 'options') ? params.options : {};
  // 請求回應載體
  let resp;
  // 請求位置
  let apiUrl = api.host + uri;
  // log(apiUrl);
  // log(params);
  // 請求選項
  let sendOptions = {};
  if (_.has(options, 'headers')) sendOptions.headers = options.headers;
  if (_.has(options, 'body')) sendOptions.body = options.body;
  if (_.has(options, 'contentType')) sendOptions.contentType = options.contentType;

  switch (method.toUpperCase()) {
    // method = PUT, DELETE 等方法使用
    case 'PUT':
    case 'DELETE':
      sendOptions.method = method.toUpperCase();
      resp = http.request(apiUrl, sendOptions);
      break;
    case 'GET':
      resp = http.get(apiUrl, sendOptions);
      break;
    case 'POST':
      resp = http.post(apiUrl, data, sendOptions);
      break;
    case 'POSTJSON':
      resp = http.postJson(apiUrl, data, sendOptions);
      break;
    default:
      throw "尚未配置請求方法[method]";
  }
  var faceJson = JSON.parse(resp.body.string());
  return faceJson;
}

api.getGameOpen = function (lot_number) {
  try {
    log("序號：" + lot_number);
    if (lot_number == null || lot_number == "987654321") {
      return false;
    }
    resp = api.call({
      method: "get",
      uri: 'api/game/openGame',
    });
    if (resp.code === 1) {
      api.lot_number = lot_number;
      return true;
    }
    else {
      return false;
    }
  } catch (e) {
    log(e);
  }
  return false;
};

api.verifyGameSn = function () {
  try {
    resp = api.call({
      method: "get",
      uri: 'api/game/verifyGameSn?lot_number= ' + api.lot_number +
        '&machine_code = ' + device.serial +
        '&game_id = ' + api.game_id
    });
    if (resp.code === 1) {
      return true;
    }
    else {
      log(resp.msg)
      return false;
    }
  } catch (e) {
    log(e);
  }
  return false;
};
module.exports = api;