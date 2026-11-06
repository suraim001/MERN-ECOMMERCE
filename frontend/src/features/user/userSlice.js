import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Registration API
export const register = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
    try {
        const config = {
            Headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post('/api/v1/register', userData, config);
    } catch (error) {
        return rejectWithValue(error.response?.data) || 'Registration failed. Please try again later'
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
        success: false,
        isLoggedIn: false
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        // Registration cases
        builder.addCase(register.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.error = null;
                state.user = action.payload?.user || null;
                state.isLoggedIn = action.payload?.isLoggedIn;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Registration Failed. Please try agin later';
                state.user = null;
                state.isLoggedIn=false;
            })
    }

});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;