var api = require('../controllers/page/api');

module.exports = [
  {
    method: 'get',
    url: '/api/users/list',
    middleware: api.users.list
  }
]