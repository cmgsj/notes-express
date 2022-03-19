import { createAsyncThunk } from '@reduxjs/toolkit';

const backendURL = process.env.REACT_APP_BACKEND_URL;

export const fetchLogin = createAsyncThunk(
  'user/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await fetch(`${backendURL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        return responseData;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchSignup = createAsyncThunk(
  'user/signup',
  async (
    { firstName, lastName, email, password, confirmedPassword },
    thunkAPI
  ) => {
    try {
      const response = await fetch(`${backendURL}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmedPassword,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        return responseData;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ token, password, confirmedPassword }, thunkAPI) => {
    try {
      const response = await fetch(`${backendURL}/reset_password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmedPassword }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        return responseData;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const sendPasswordResetLink = createAsyncThunk(
  'user/sendPasswordResetLink',
  async (email, thunkAPI) => {
    try {
      const response = await fetch(`${backendURL}/reset_password/send_code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        return responseData;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loadNotes = createAsyncThunk(
  'user/getNotes',
  async (args, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      if (!token) {
        throw new Error('Not authenticated.');
      }
      const response = await fetch(`${backendURL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        return responseData;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createNote = createAsyncThunk(
  'user/postNote',
  async (note, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    try {
      const response = await fetch(`${backendURL}/notes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        return responseData;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editNote = createAsyncThunk(
  'user/editNote',
  async (note, thunkAPI) => {
    const { title, content } = note;
    const token = thunkAPI.getState().user.token;
    try {
      const response = await fetch(`${backendURL}/notes/${note.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        return responseData;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteNote = createAsyncThunk(
  'user/deleteNote',
  async (noteId, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    try {
      const response = await fetch(`${backendURL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        return responseData;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const shareNote = createAsyncThunk(
  'user/shareNote',
  async ({ noteId, permission, expiresIn = null }, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    try {
      const response = await fetch(`${backendURL}/notes/share`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId, permission, expiresIn }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        return responseData;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
