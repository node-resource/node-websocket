const url = require('url');
const Cookies = require('cookies');
const WebSocket = require('ws');

const WebSocketServer = WebSocket.Server;

// parse user
function parseUser(obj) {
  if (!obj) {return;}
  console.log('trying to parse: ' + obj);
  let s = '';
  if (typeof obj === 'string') {
    s = obj;
  } else if (obj.headers) {
    let cookies = new Cookies(obj, null);
    s = cookies.get('username');
  }
  if (s) {
    try {
      let user = JSON.parse(Buffer.from(s, 'base64').toString());
      console.log('User:'+ user.name+', ID: '+user.id);
      return user;
    } catch (e) {
      // ignore
    }
  }
  return s
}

var messageIndex = 0;
function createMessage(type, user, data) {
  messageIndex ++;
  return JSON.stringify({
      id: messageIndex,
      type: type,
      user: user,
      data: data
  });
}

// connect
function _connect() {
  let user = this.user;
  console.log(user)
  let msg = createMessage('join', user, user.name+' joined.');
  this.wss.broadcast(msg);
  // build user list:
  let users = Array.from(this.wss.clients).map(function (client) {
    return client.user;
  });
  this.send(createMessage('list', user, users));
}
// message
function _message(message) {
  console.log(message);
  if (message && message.trim()) {
    let msg = createMessage('chat', this.user, message.trim());
    this.wss.broadcast(msg);
  }
}
// close
function _close() {
  let user = this.user;
  let msg = createMessage('left', user, user.name+' is left.');
  this.wss.broadcast(msg);
}

module.exports = app => {
  // parse user from cookies
  app.use(async (ctx, next) => {
    ctx.state.user = parseUser(ctx.cookies.get('username') || '');
    await next()
  })
  let server = app.listen(80,() => {
    console.log('server is running at http://localhost:80')
  });

  

  app.wss = ( config => {
    let wss = new WebSocketServer({
      server: server
    });
    // 把信息分配到每一个请求的客户端
    wss.broadcast = function broadcast(data) {
      wss.clients.forEach(function each(client) {
        client.send(data);
      });
    };
    // 重写websocket的生命周期
    let onConnection = config.onConnection || function () {
      console.log('[WebSocket] connected.');
    };
    let onMessage = config.onMessage || function (msg) {
      console.log('[WebSocket] message received: ' + msg);
    };
    let onClose = config.onClose || function (code, message) {
      console.log('[WebSocket] closed: '+code+' - '+message);
    };
    let onError = config.onError || function (err) {
      console.log('[WebSocket] error: ' + err);
    };
    // 监听websocket请求
    wss.on('connection', (ws, req) => {
      let location = url.parse(req.url, true);
      console.log('[WebSocketServer] connection: ' + location.href);
      ws.on('message', onMessage);
      ws.on('close', onClose);
      ws.on('error', onError);
      if (location.pathname !== '/ws/chat') {
        // close ws:
        ws.close(4000, 'Invalid URL');
      }
      // check user:
      let user = parseUser(req);
      if (!user) {
        ws.close(4001, 'Invalid user');
      }
      ws.user = user;
      ws.wss = wss;
      onConnection.apply(ws);
    })

  })({
    onConnection: _connect,
    onMessage: _message,
    onClose: _close
  })
  console.log('WebSocketServer was attached.');
}
