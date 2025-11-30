import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import HomePage from './components/home/HomePage';
import SignInForm from './components/auth/SignInForm';
import CreateAccountForm from './components/auth/CreateAccountForm';
import EditAccountForm from './components/auth/EditAccountForm';
import PlaylistsPage from './components/playlists/PlaylistsPage';
import SongCatalogPage from './components/songs/SongCatalogPage';
import './App.css';

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/create-account" element={<CreateAccountForm />} />
          <Route path="/edit-account" element={<EditAccountForm />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/songs" element={<SongCatalogPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
