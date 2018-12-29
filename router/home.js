var common = require('../controllers/page/common');

module.exports = [
  {
    method: 'get',
    url: '/',
    middleware: common.home
  },{
    method: 'get',
    url: '/sigin',
    middleware: common.sigin
  },{
    method: 'post',
    url: '/sigin',
    middleware: common.postSigin
  },{
    method: 'get',
    url: '/sigout',
    middleware: common.sigout
  }
]