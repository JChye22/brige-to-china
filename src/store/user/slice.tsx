/** @format */

import { createSlice } from '@reduxjs/toolkit';
import { USER_INFO } from '@/constants';

const initialState = {
  // username: '123',
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const data = action.payload;
      let userInfo = {
        ...state,
        ...data,
      };
      localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
      return {
        ...userInfo,
      };
    },
    userLogout: (state) => {
      localStorage.removeItem(USER_INFO);
      localStorage.removeItem('token');
      //刷新
      return {
        ...initialState,
      };
    },
  },
});
export const { updateUser, userLogout } = UserSlice.actions;
export default UserSlice.reducer;
