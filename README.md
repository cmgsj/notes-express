# Note-Taking App

## Developed with:

- MERN full-stack.

## Screenshots

<img src='./screenshots/login.png' height='350' width='350' /> <img src='./screenshots/signup.png' height='350' width='350' />
<img src='./screenshots/loading.png' height='350' width='350' /> <img src='./screenshots/error.png' height='350' width='350' />
<img src='./screenshots/home.png' height='350' width='350' /> <img src='./screenshots/new-note.png' height='350' width='350' />
<img src='./screenshots/edit.png' height='350' width='350' /> <img src='./screenshots/delete.png' height='350' width='350' />
<img src='./screenshots/dates.png' height='350' width='350' /> <img src='./screenshots/share.png' height='350' width='350' />
<img src='./screenshots/copy-url.png' height='350' width='350' /> <img src='./screenshots/url-copied.png' height='350' width='350' />
<img src='./screenshots/search.png' height='350' width='350' /> <img src='./screenshots/no-notes-found.png' height='350' width='350' />
<img src='./screenshots/side-drawer.png' height='350' width='350' /> <img src='./screenshots/reset-password.png' height='350' width='350' />
<img src='./screenshots/reset-password-done.png' height='350' width='350' /> <img src='./screenshots/new-password.png' height='350' width='350' />

## Features

- User login, signup, logout, forgot password, reset password.
- Auto-login with refresh token after JWT expires, and auto-logout when not authenticated.
- CRUD operations.
- Share notes with guest users setting expiration time and read_only or read_and_write permissions.
- View or edit note shared with you, as a guest user.
- Filter notes with search bar, and sort notes by creation and update dates.
- Loading spinner when fetching backend, and error modal if backend response not ok.
- REST API backend that issues jwt access and refresh tokens for protected endpoints.
