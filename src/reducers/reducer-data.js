import { GET_PROFILE_SUCCESS, LOGIN_DETAILS_SUCCESS } from '../actions/action-data'
const INITIAL_STATE = {
  userProfile: { data: null },
  getUsersObj: { userCredentials: null },
  getMenuOptionJson: {menuOptions: null}
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_DETAILS_SUCCESS:
        return { ...state, getUsersObj: { userCredentials: action.payload }};
    case GET_PROFILE_SUCCESS:
        return { ...state, userProfile: { data: action.payload }}
    default:
        return state
  }
}
