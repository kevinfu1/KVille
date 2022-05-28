import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    currGroupCode: "",
    currGroupName: "",
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    reset: (state) => {
      state.currentUser = null;
    },
    setGroupCode: (state, action) => {
      state.currGroupCode = action.payload;
    },
    setGroupName: (state, action) => {
      state.currGroupName = action.payload;
    }
  },
});

export const { setCurrentUser, reset, setGroupCode, setGroupName } = userSlice.actions;

export default userSlice.reducer;

// export const userSlice = createSlice({
//   name: "user",
//   initialState: {
//     inGroup: false,
//     groupInfo: {
//       groupCode: "",
//       userName: "",
//     },
//     isCreator: false,
//   },
//   reducers: {
//     inGroup: (state) => {
//       state.inGroup = true;
//     },
//     notInGroup: (state) => {
//       state.inGroup = false;
//     },
//     setGroupInfo: (state, action) => {
//       state.groupInfo = action.payload;
//     },
//     setCreatorRole: (state) => {
//       state.isCreator = true;
//     },
//     reset: (state) => {
//       state.inGroup = false;
//       state.groupInfo = {
//         groupCode: "",
//         userName: "",
//       };
//       state.isCreator = false;
//     },
//   },
// });

// export const { inGroup, notInGroup, setGroupInfo, setCreatorRole, reset } = userSlice.actions;

// export default userSlice.reducer;
