/*
* socket Server
*
* 2018-05-27 박현도
*/
const port = 5000;

const WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: port});

// url parse 를 위해 선언
const url = require('url');

// WebSocketServer.listen(port, function() {
//   console.log("App is running on port " + port);
// });

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

/**
* Web-client 에 접속하면, 해당 접속 유저의 shopId 가 users 배열에 ws 로 선언된다.
* 참고 : ... users[receiveId] = ws;
* 앞으로 점주들이 Web-client 에 접속하기 전 폰으로 부터 발생된 send 요청건을 해결하기 위해
* Socket Server 에서 LOT 가입 점주들의 shopId 를 미리 users 배열에 담아놓아야 한다.
* 현재 이를 임시로 users 배열에 강제로 선언하여 해결하고
* 추후 db 연결로 해결하고, 이것이 어렵다면 임시로 점주들의 shopId 리스트를 users 배열에
* 자동 삽입하는 코드를 작성하여 해결할 것이다.
*/



let param = {};

wss.on('connection', function connection(ws, req) {

  //  console.log('check query', req);
  //  console.log('A connection request has occurred...', req.url);

  // 점주 shopId 강제 삽입 (임시코드)
  //  users["118a59d0"] = ws;
  //  users["118a59d0-3ec1-11e8-8876-6b89ab9b270e"] = ws;
  //  users["19w294c49"] = ws;

  const parameters = url.parse(req.url, true);

  try {
    console.log('A connection request has occurred...', parameters.query);
    // web-client 에서 접속하면 receiveId 를 생성함.
    if(parameters.query.shopId) {
      receiveId = parameters.query.shopId;
      users[receiveId] = ws;
    }
  }
  catch(e) {
    console.log(e);
  }

  /*
  if(receiveId !== null) {
    // 1. users 배열에 receiveId 키에 ws 를 할당해줌.
    users[receiveId] = ws;
  }
  else {
    console.log("Error. ShopId won't be null.");
    // null 일 경우 0000 으로 대체하여 보냄
    receiveId = "118a59d0-3ec1-11e8-8876-6b89ab9b270e";
  }
  */


  console.log('users', users);

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

    console.log('get message', message);
    sendId = JSON.parse(message).shopId;

    /**
     if(!sendId) {
      users[sendId].send(message);
    }
    else {
      console.log("Error. sendId is NULL ...");
    }
    */

    try {
      users[sendId].send(message);
    }
    catch(e) {
      console.log(e);
    }

    // test code
    // users["1234"].send(param);
  })
})
