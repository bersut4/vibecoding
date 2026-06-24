import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PostListPage from './pages/PostListPage'
import PostDetailPage from './pages/PostDetailPage'
import PostCreatePage from './pages/PostCreatePage'
import ChatPage from './pages/ChatPage'
import ChatRoomPage from './pages/ChatRoomPage'
import ProfilePage from './pages/ProfilePage'
import { CircularProgress, Box } from '@mui/material'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress color="primary" />
    </Box>
  )
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter basename="/vibecoding/my-community">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/boards/1" replace />} />
          <Route path="boards/:boardId" element={<PostListPage />} />
          <Route path="posts/new" element={<PostCreatePage />} />
          <Route path="posts/:postId" element={<PostDetailPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:channelId" element={<ChatRoomPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
