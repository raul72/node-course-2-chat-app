class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
    const user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    const user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }
  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }
  getUserList(room) {
    const users = this.users.filter((user) => user.room === room);
    return users.map((user) => user.name);
  }
}

module.exports = {Users};

/*
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  getUserDescription() {
    return `${this.name} is ${this.age} year(s) old.`;
  }
}
const me = new Person('Billy', 194);
console.log('me', me);
console.log('me.name', me.name);
console.log('me.age', me.age);
console.log('me.description', me.getUserDescription());
*/
