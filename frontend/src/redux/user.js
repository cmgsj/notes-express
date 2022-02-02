import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  token: null,
  tokenExpirationDate: null,
  isLoggedIn: false,
  notes: [],
  isLoading: false,
  error: null,
  sharingToken: null,
};

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
  async ({ name, email, password }, thunkAPI) => {
    try {
      const response = await fetch(`${backendURL}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
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

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      const { token, expirationDate } = action.payload;
      const tokenExpirationDate =
        expirationDate ||
        new Date(new Date().getTime() + 1000 * 60 * 60).toISOString();
      state.token = token;
      state.tokenExpirationDate = tokenExpirationDate;
      state.isLoggedIn = true;
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpirationDate', tokenExpirationDate);
    },
    logout: (state, action) => {
      state.userId = null;
      state.token = null;
      state.tokenExpirationDate = null;
      state.isLoggedIn = false;
      state.notes = [];
      state.isLoading = false;
      state.error = null;
      state.sharingToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpirationDate');
    },
    clearError: (state, action) => {
      state.error = null;
    },
    clearSharingToken: (state, action) => {
      state.sharingToken = null;
    },
  },
  extraReducers: {
    // login
    [fetchLogin.pending]: (state, action) => {
      state.isLoading = true;
    },
    [fetchLogin.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [fetchLogin.fulfilled]: (state, action) => {
      const { userId, token } = action.payload;
      state.userId = userId;
      state.isLoading = false;
      if (token) {
        userSlice.caseReducers.login(state, { payload: { token } });
      }
    }, // signup
    [fetchSignup.pending]: (state, action) => {
      state.isLoading = true;
    },
    [fetchSignup.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [fetchSignup.fulfilled]: (state, action) => {
      const { userId, token } = action.payload;
      state.userId = userId;
      state.isLoading = false;
      if (token) {
        userSlice.caseReducers.login(state, { payload: { token } });
      }
    }, // loadNotes
    [loadNotes.pending]: (state, action) => {
      state.isLoading = true;
    },
    [loadNotes.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [loadNotes.fulfilled]: (state, action) => {
      state.notes = action.payload.notes;
      state.isLoading = false;
    }, // createNote
    [createNote.pending]: (state, action) => {
      state.isLoading = true;
    },
    [createNote.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [createNote.fulfilled]: (state, action) => {
      const createdNote = action.payload.note;
      state.notes.unshift(createdNote);
      state.isLoading = false;
    }, // editNote
    [editNote.pending]: (state, action) => {
      state.isLoading = true;
    },
    [editNote.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [editNote.fulfilled]: (state, action) => {
      const editedNote = action.payload.note;
      const idx = state.notes.findIndex((note) => note.id === editedNote.id);
      state.notes[idx] = editedNote;
      state.isLoading = false;
    }, // deleteNote
    [deleteNote.pending]: (state, action) => {
      state.isLoading = true;
    },
    [deleteNote.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [deleteNote.fulfilled]: (state, action) => {
      const deletedNoteId = action.payload.noteId;
      state.notes = state.notes.filter((note) => note.id !== deletedNoteId);
      state.isLoading = false;
    }, // shareNote
    [shareNote.pending]: (state, action) => {
      state.isLoading = true;
      state.sharingToken = null;
    },
    [shareNote.rejected]: (state, action) => {
      state.isLoading = false;
      state.sharingToken = null;
      state.error = action.payload;
    },
    [shareNote.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.sharingToken = action.payload.token;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
