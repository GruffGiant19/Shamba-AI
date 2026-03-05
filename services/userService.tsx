import axios from "axios";
import { auth } from "./firebase";

const API_URL = "http://localhost:5000/api";

export const saveUserProfile = async (profileData: any) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const response = await axios.post(`${API_URL}/users/profile`, {
      firebaseUid: user.uid,
      email: user.email,
      ...profileData,
    });

    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const getUserProfile = async() => {
    try {
        const user = auth.currentUser;
        if(!user) throw new Error('No authenticated User')

        const response = await axios.get(`${API_URL}/users/profile/${user.uid}`);
        return response.data.user
    } catch (error:any) {
        throw new Error(error.response?.data?.error || error.message);
    }
}
