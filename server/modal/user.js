
let uids = [];
function getRandomnumericId() {
  let uid = 10000;
  let sanity = 1000;
  do {
    sanity--;
    uid = Math.round(Math.random()*10000);
  } while (sanity > 0 && uids.indexOf(uid) !== -1);
  uids.push(uid);
  return uid;
}

class User {

  constructor() {
    this.id = getRandomnumericId();
    this.nick = 'anon';
    this.joined = new Date().getTime();
  }

  toJSON() {
    return {
      id: this.id,
      nick: this.nick,
      joined: this.joined
    };
  }

  destroy() {
    uids = uids.filter((val) => val != this.numericId);
  }

}

module.exports = User;
