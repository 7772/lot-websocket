/**
 * WebSocket Server
 * 
 * 2018-05-27 박현도
 */

const port = 8080;

const WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: port});

// url parse 를 위해 선언
const url = require('url');

console.log(`LOT WebSocket Server Start.. port : ${port}`);

/**
 * @array users
 * 여러 웹 클라이언트(매장 a,b,c,d ..) 의 받는 주소가 저장될 배열.
 * 이 users 배열에 저장된 shopId 들은 각각 ws 로 선언되어 .send() 을 수행할 수 있다.
 * users = [
 *  "shop_1",
 *  "shop_2",
 *  ...
 * ]
 */
let users = [];
/**
 * @string receiveId
 * 웹클라이언트에서 메시지를 받는 Id.
 * 웹에서 DB 접속해서 get 하거나 직접 입력을 받아서 쿼리로 보내온 shopId 가 됨.
 */
let receiveId = null;

/**
 * @string sendId
 * 앱에서 param 으로 보내온 Id.
 * 앱에서 메시지를 어느 웹클라이언트(매장 a,b,c,d ..)로 보낼지 결정하는 shopId 임.
 * 
 */
let sendId = null;

let param = {};

wss.on('connection', function connection(ws, req) {

  console.log('req.url', req.url);

  const parameters = url.parse(req.url, true);

  console.log(parameters);

  receiveId = parameters.query.shopId;
  if(receiveId !== null) {
    // 1. users 배열에 receiveId 키에 ws 를 할당해줌.
    users[receiveId] = ws;
  }
  else {
    console.log("Error. ShopId won't be null.");
    // null 일 경우 0000 으로 대체하여 보냄
    receiveId = "0000";
  }

  ws.on('message', function (message) {
    // console.log('received: %s', message);
    // param = JSON.parse(message);

    // console.log('message from app', message);
    // console.log('parse message from app', JSON.parse(message).shopId);

    /**
     * @string sendId
     * sendId 에는 앱에서 보내온 shopId 가 저장되어
     * users 배열에 저장된 receiveId 를 찾아 해당 웹클라이언트(매장)으로 보내게 된다.
     */

    sendId = JSON.parse(message).shopId;
    users[sendId].send(message);

    // test code
    // users["1234"].send(param);
  })
})