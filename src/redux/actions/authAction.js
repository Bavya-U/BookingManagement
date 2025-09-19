import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import { auth,db } from "../../firebase"; 
import { toast } from "react-toastify";

// const db = getFirestore();

export const signupUser = (email, password, role) => async (dispatch) => {
  dispatch({ type: "SIGNUP_REQUEST" });
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), { email: user.email, role });

    dispatch({ type: "SIGNUP_SUCCESS", payload: { uid: user.uid, email: user.email, role } });
    toast.success("Signup successful!");
  } catch (error) {
    dispatch({ type: "SIGNUP_FAILURE", payload: error.message });
    toast.error(error.message); // ❌ error toast
  }
};

export const resetSignup = () => {
  return { type: "SIGNUP_RESET" };
};


export const loginUser = (email, password) => async (dispatch) => {
  dispatch({ type: "LOGIN_REQUEST" });
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // check Firestore
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const role = docSnap.data().role;
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { uid: user.uid, email: user.email, role },
      });
      toast.success("Login successful!");
    } else {
      throw new Error("No role found for this user");
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    dispatch({ type: "LOGIN_FAILURE", payload: error.message });
     toast.error(error.message);
  }

};
export const logout = () => {
  return {
    type: "LOGOUT",
  };
};