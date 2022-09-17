import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axios";
import { User } from "../../models/User";
import { UserService } from "../../services/UserService";

export const updateUser = createAsyncThunk(
    "users/update",
    async (_,thunkAPI) => {
        try {
            return await UserService.getMe()
        } catch (e) {
            return thunkAPI.rejectWithValue("")
        }
    }
)