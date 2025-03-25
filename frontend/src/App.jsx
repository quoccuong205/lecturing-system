import { Box, Typography, Container, Paper } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LecturesPage from './pages/LecturesPage';
import LectureDetailsPage from './pages/LectureDetailsPage';
import AddLecturePage from './pages/AddLecturePage';
import EditLecturePage from './pages/EditLecturePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Loading application..." />;
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={
            !isAuthenticated ? <LoginPage /> : <Navigate to="/lectures" />
          } />
          <Route path="register" element={
            !isAuthenticated ? <RegisterPage /> : <Navigate to="/lectures" />
          } />
          
          {/* Protected routes */}
          <Route path="lectures" element={
            isAuthenticated ? <LecturesPage /> : <Navigate to="/login" />
          } />
          <Route path="lectures/:id" element={
            isAuthenticated ? <LectureDetailsPage /> : <Navigate to="/login" />
          } />
          <Route path="lectures/add" element={
            isAuthenticated && user?.role === 'admin' ? <AddLecturePage /> : <Navigate to="/lectures" />
          } />
          <Route path="lectures/edit/:id" element={
            isAuthenticated && user?.role === 'admin' ? <EditLecturePage /> : <Navigate to="/lectures" />
          } />
          <Route path="profile" element={
            isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />
          } />
          
          {/* Admin Dashboard */}
          <Route path="admin" element={
            isAuthenticated && user?.role === 'admin' ? <AdminDashboardPage /> : <Navigate to="/" />
          } />
          
          {/* Not found route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
