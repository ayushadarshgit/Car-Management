import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";

interface initialState {
    name?: string,
    email?: string,
    isLoggedIn: boolean
}

const initialState: initialState = {
    name: undefined,
    email: undefined,
    isLoggedIn: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        reset: () => initialState,
        setLoggedin: (state, action: PayloadAction <boolean>) => {
            state.isLoggedIn = action.payload;
        },
        setBootData: (_, action: PayloadAction <{name: string, email: string, isLoggedIn: boolean}>) => {
            return {...action.payload};
        }
    }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;