import { createSlice } from '@reduxjs/toolkit';
import {
  fetchLogin,
  fetchSignup,
  loadNotes,
  createNote,
  editNote,
  deleteNote,
  shareNote,
} from './userAsyncThunks';

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

const loadingStateHandler = (state) => {
  state.isLoading = true;
};
const errorStateHandler = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

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
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpirationDate');
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSharingToken: (state) => {
      state.sharingToken = null;
    },
  },
  extraReducers: {
    // login
    [fetchLogin.pending]: loadingStateHandler,
    [fetchLogin.rejected]: errorStateHandler,
    [fetchLogin.fulfilled]: (state, action) => {
      const { userId, token } = action.payload;
      state.userId = userId;
      state.isLoading = false;
      if (token) {
        userSlice.caseReducers.login(state, { payload: { token } });
      }
    },
    // signup
    [fetchSignup.pending]: loadingStateHandler,
    [fetchSignup.rejected]: errorStateHandler,
    [fetchSignup.fulfilled]: (state, action) => {
      const { userId, token } = action.payload;
      state.userId = userId;
      state.isLoading = false;
      if (token) {
        userSlice.caseReducers.login(state, { payload: { token } });
      }
    },
    // loadNotes
    [loadNotes.pending]: loadingStateHandler,
    [loadNotes.rejected]: errorStateHandler,
    [loadNotes.fulfilled]: (state, action) => {
      state.notes = action.payload.notes;
      state.isLoading = false;
    },
    // createNote
    [createNote.pending]: loadingStateHandler,
    [createNote.rejected]: errorStateHandler,
    [createNote.fulfilled]: (state, action) => {
      const createdNote = action.payload.note;
      state.notes.unshift(createdNote);
      state.isLoading = false;
    },
    // editNote
    [editNote.pending]: loadingStateHandler,
    [editNote.rejected]: errorStateHandler,
    [editNote.fulfilled]: (state, action) => {
      const editedNote = action.payload.note;
      const idx = state.notes.findIndex((note) => note.id === editedNote.id);
      state.notes[idx] = editedNote;
      state.isLoading = false;
    },
    // deleteNote
    [deleteNote.pending]: loadingStateHandler,
    [deleteNote.rejected]: errorStateHandler,
    [deleteNote.fulfilled]: (state, action) => {
      const deletedNoteId = action.payload.noteId;
      state.notes = state.notes.filter((note) => note.id !== deletedNoteId);
      state.isLoading = false;
    },
    // shareNote
    [shareNote.pending]: loadingStateHandler,
    [shareNote.rejected]: errorStateHandler,
    [shareNote.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.sharingToken = action.payload.token;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
