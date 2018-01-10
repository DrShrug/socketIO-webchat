class Users {
  constructor() {
    this.users = [];
  };

  addUser(id, username) {
    var user = {id, username};
    this.users.push(user);
    return user
  };

  removeUser(id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  };

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  };

  getUserList() {
    return this.users.map((user) => user.username);
  };
};

module.exports = {
  Users
};