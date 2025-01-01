import users from "./roles";

const loginData = {
  s1: users.student[0],
  s2: users.student[1],
  p1: users.professor[0],
  p2: users.professor[1],
  a1: users.admin[0],
  c1: users.coordinator[0],
  c2: users.coordinator[1],
};

export default loginData;

export const usernamePassword = (user) => {
  return `${user.username}:${user.password}`;
};
