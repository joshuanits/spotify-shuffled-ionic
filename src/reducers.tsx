import { SET_TOKEN } from './actions';

export interface AppState {
  token: string;
}

const initialState: AppState = {
  token: ''
};

export function appReducer(state = initialState, action: any): AppState {
  switch (action.type) {
    case SET_TOKEN:
      return Object.assign({}, state, {
        token: action.token
      });
  }

  return state;
}
