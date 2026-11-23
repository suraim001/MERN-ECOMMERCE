import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { create } from "axios";

// Registration API
export const register = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/api/v1/register', userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Registration failed. Please try again later' });
    }
})

// Login API
export const login = createAsyncThunk('user/login', async ({ email, username, password }, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/v1/login', { email, username, password }, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Login failed. Please try again later")
    }
})

export const loadUser = createAsyncThunk('user/loadUser', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/profile');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to load user profile');
    }
})

export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/api/v1/logout', { withCredentials: true });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong. Logout failed");
    }
})

export const updateProfile = createAsyncThunk('user/updateProfile', async (userData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.patch('/api/v1/profile/update', userData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to update the profile. Please try again later' })
    }
})

export const updatePassword = createAsyncThunk('user/updatePassword', async(formData, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        }
        const {data} = await axios.patch('/api/v1/password/update', formData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to change the password. Please try again later')
    }
})
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
        success: false,
        isAuthenticated: false,
        message: null
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
                state.isAuthenticated = action.payload.user?.isLoggedIn;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Registration Failed. Please try agin later';
                state.user = null;
                state.isAuthenticated = false;
            })

        // Login Cases
        builder.addCase(login.pending, (state) => {
            state.loading = true,
                state.error = null
        })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.error = null;
                state.user = action.payload?.user || null;
                state.isAuthenticated = action.payload.user?.isLoggedIn;
                // console.log(state.user);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login Failed. Please try agin later';
                state.user = null;
                state.isAuthenticated = false;
            })

        // Loading User Cases
        builder.addCase(loadUser.pending, (state) => {
            state.loading = true,
                state.error = null
        })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // state.user = action.payload?.user || null;
                // state.isAuthenticated = action.payload.user?.isLoggedIn;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to load user profile';
                state.user = null;
                state.isAuthenticated = false;
            })

        // Logout cases
        builder.addCase(logout.pending, (state) => {
            state.loading = true,
                state.error = null
        })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Logout Failed';
            })

        // Update User Profile
        builder.addCase(updateProfile.pending, (state) => {
            state.loading = true,
                state.error = null
        })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload?.user || null;
                state.success = action.payload?.success;
                state.message = action.payload?.message;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update the profile. Please try again later';
            })

        // Update User Password
        builder.addCase(updatePassword.pending, (state) => {
            state.loading = true,
                state.error = null
        })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload?.success;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update the password. Please try again later';
            })

    }

});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;