function Greet(opt) {
  this.plateform = null;
  this.greet = opt.greet;
  this.callback = opt.callback;
  this.init() 
}
Greet.prototype = {
  constructor:Greet,
  init : function() {
    this.judgeEnv();
    this.say();
  },
  judgeEnv: function() {
    this.plateform = typeof(window) === undefined ? 'V8' : 'browser'
    console.error(this.plateform)
    process.nextTick(this.callback)
  },
  say:function() {
    console.log('hello ',this.greet)
  }
}

module.exports = Greet