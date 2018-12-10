const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'woo',
    }, {
      id: '2',
      name: 'Julie',
      room: 'boo',
    }, {
      id: '3',
      name: 'Jen',
      room: 'woo',
    }];
  });

  it('should add new user', () => {
    const users = new Users();
    const user = {
      id: '123',
      name: 'Brand',
      room: 'woo',
    };
    const resUser = users.addUser(user.id, user.name, user.room);

    expect(resUser).toEqual(user);
    expect(users.users).toEqual([user]);

  });

  it('should remove a user', () => {
    var userId = '1';
    var user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var userId = '99';
    var user = users.removeUser(userId);
    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('should find a user', () => {
    const userId = '2';
    const user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it('should not find a user', () => {
    const userId = '99';
    const user = users.getUser(userId);
    expect(user).toBeFalsy();
  });

  it('should return names for "woo" room', () => {
    const userList = users.getUserList('woo');
    expect(userList).toEqual(['Mike', 'Jen']);
  });

  it('should return names for "boo" room', () => {
    const userList = users.getUserList('boo');
    expect(userList).toEqual(['Julie']);
  });

});
