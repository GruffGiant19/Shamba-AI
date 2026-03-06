import axios from "axios";
import { auth } from "./firebase";

const API_URL = "http://172.20.10.2:5000/api";

export const saveUserProfile = async (profileData: any) => {
  try {
    const user = auth.currentUser;
    
    console.log('🔐 Current user:', user?.uid, user?.email);  // ✅ DEBUG
    
    if (!user) throw new Error("No authenticated user");

    const payload = {
      firebaseUid: user.uid,
      email: user.email,
      ...profileData,
    };

    console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));  // ✅ DEBUG
    console.log('🌐 API endpoint:', `${API_URL}/users/profile`);  // ✅ DEBUG

    const response = await axios.post(`${API_URL}/users/profile`, payload);

    console.log('✅ Response received:', response.data);  // ✅ DEBUG

    return response.data;
  } catch (error: any) {
    console.error('❌ Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });  // ✅ DEBUG
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const getUserProfile = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated User");

    const response = await axios.get(`${API_URL}/users/profile/${user.uid}`);
    return response.data.user;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message);
  }
};