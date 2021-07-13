import * as Types from "../../actions/constants";

const authReducer = (state = null, action) => {
  switch (action.type) {
    case Types.FETCH_USER:
      return action.payload;
    default:
      return state;
  }
};

export default authReducer;
