export const SET_TOKEN = 'SET_TOKEN';

interface SetTokenAction {
  type: typeof SET_TOKEN;
  token: string;
}

export function setToken(token: string): SetTokenAction {
  return {
    type: SET_TOKEN,
    token: token
  };
}
