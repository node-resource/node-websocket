let index = 0;

const Common = {
  home: async function(ctx, next){
    let user = ctx.state.user;
    if (user) {
      ctx.body= ctx.render('room.html', {
        user: user
      });
    } else {
      ctx.response.redirect('/sigin');
    }
  },
  sigin: async (ctx, next) => {
    let names = '甲乙丙丁戊己庚辛壬癸';
    let name = names[index % 10];
    ctx.body = ctx.render('sigin.html', {
      name: '路人'+name
    });
  },
  postSigin: async (ctx, next) => {
    index ++;
    let name = ctx.request.body.name || '路人甲';
    let user = {
      id: index,
      name: name,
      image: index % 10
    };
    let value = Buffer.from(JSON.stringify(user)).toString('base64');
    console.log('Set cookie value: '+value);
    ctx.cookies.set('username', value);
    ctx.response.redirect('/');
  },
  sigout: async (ctx, next) => {
    ctx.cookies.set('username', '');
    ctx.response.redirect('/sigin');
  }
};

module.exports = Common