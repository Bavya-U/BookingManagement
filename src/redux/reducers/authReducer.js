const initialState = {
  // user: null,
  loading: false,
  error: null,
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGNUP_REQUEST":
    case "LOGIN_REQUEST":
      return { ...state, loading: true, error: null };

    case "SIGNUP_SUCCESS":
    case "LOGIN_SUCCESS":
       localStorage.setItem("user", JSON.stringify(action.payload))
      return { ...state, loading: false, user: action.payload };

    case "SIGNUP_FAILURE":
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "LOGOUT":
        localStorage.removeItem("user"); // clear
      return { ...state, user: null };

    case "SIGNUP_RESET":
      return { ...state, user: null, error: null };

    default:
      return state;
  }
};

export default authReducer;
