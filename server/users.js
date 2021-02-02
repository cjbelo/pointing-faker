const users = [];
let storyTitle = "Story Title";

const addUser = ({ id, name, room }) => {
  name = name.trim();
  room = room.trim();

  const existingUser = users.find(
    user => user.room === room && user.name === name
  );

  if (existingUser) {
    return { error: "Name is already taken!" };
  }

  const user = { id, name, room, vote: null };

  users.push(user);

  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => users.find(user => user.id === id);

const getUsersInRoom = room => users.filter(user => user.room === room);

const getUsers = () => users;

const getRooms = () => {
  const rooms = [];

  if (users.length) {
    for (var u of users) {
      if (rooms.indexOf(u.room) < 0) {
        rooms.push(u.room);
      }
    }
  }

  return rooms;
};

const setVote = (vote, id) => {
  const index = users.findIndex(user => user.id === id);
  users[index].vote = vote;
  return users[index];
};

const resetVotes = room => {
  const filteredUsers = getUsersInRoom(room);
  if (filteredUsers.length) {
    for (var i in filteredUsers) {
      filteredUsers[i].vote = null;
    }
  }
  return filteredUsers;
};

const setStoryTitle = str => {
  storyTitle = str.trim();
  return storyTitle;
};

const getStoryTitle = () => {
  return storyTitle;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getUsers,
  getRooms,
  setVote,
  resetVotes,
  setStoryTitle,
  getStoryTitle
};
