import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ---------------------------------------------------------
   1️⃣ Fetch permissions of a specific user
--------------------------------------------------------- */
export const fetchPermissionsByUser = createAsyncThunk(
  "userPermission/fetchPermissionsByUser",
  async (userId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/userPermission/getPermissionbyuser/${userId}`
      );
      return response.data; // should be array of menu/actions
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

/* ---------------------------------------------------------
   2️⃣ Save User Permission (Create or Update)
--------------------------------------------------------- */
export const saveUserPermission = createAsyncThunk(
  "userPermission/saveUserPermission",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/userPermission/createPermissionByUser`,
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

/* ---------------------------------------------------------
   Initial State
--------------------------------------------------------- */
const initialState = {
  selectedUserPermissions: [], // actual assigned permissions
  loading: false,
  saving: false,
  error: null,
};

/* ---------------------------------------------------------
   Slice
--------------------------------------------------------- */
const userPermissionSlice = createSlice({
  name: "userPermissions",
  initialState,
  reducers: {
    clearPermissions: (state) => {
      state.selectedUserPermissions = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* -------------------------------
         FETCH PERMISSIONS
      ------------------------------- */
      .addCase(fetchPermissionsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUserPermissions = action.payload;
      })
      .addCase(fetchPermissionsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch permissions";
      })

      /* -------------------------------
         SAVE PERMISSION
      ------------------------------- */
      .addCase(saveUserPermission.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveUserPermission.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(saveUserPermission.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || "Failed to save permission";
      });
  },
});

export const { clearPermissions } = userPermissionSlice.actions;
export default userPermissionSlice.reducer;
