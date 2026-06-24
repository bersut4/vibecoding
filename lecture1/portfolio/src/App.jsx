import { useState } from 'react'
import {
  Box, AppBar, Toolbar, Typography, Tabs, Tab,
  Container, IconButton, Menu, MenuItem, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert, CircularProgress,
} from '@mui/material'
import {
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import HomePage from './pages/HomePage'
import { useAdmin } from './contexts/AdminContext'

const TABS = [
  { label: 'Home', value: 'home' },
]

export default function App() {
  const [tab, setTab] = useState('home')
  const { user, isAdmin, login, logout } = useAdmin()

  const [adminOpen, setAdminOpen] = useState(false)
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setLoginError('이메일과 비밀번호를 입력해주세요.'); return }
    setLoginLoading(true)
    setLoginError('')
    try {
      await login(email, password)
      setAdminOpen(false)
      setEmail('')
      setPassword('')
    } catch {
      setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
    setLoginLoading(false)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '2px solid',
          borderColor: 'primary.light',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: 'primary.main', letterSpacing: '-0.5px' }}
          >
            ✨ 권은별
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ minHeight: 48 }}
            >
              {TABS.map((t) => (
                <Tab key={t.value} label={t.label} value={t.value} sx={{ fontWeight: 600, minHeight: 48 }} />
              ))}
            </Tabs>

            {user && isAdmin ? (
              <>
                <Tooltip title="관리자 메뉴">
                  <IconButton
                    size="small"
                    onClick={(e) => setAdminMenuAnchor(e.currentTarget)}
                    sx={{ color: 'primary.main', ml: 1 }}
                  >
                    <AdminIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={adminMenuAnchor}
                  open={Boolean(adminMenuAnchor)}
                  onClose={() => setAdminMenuAnchor(null)}
                >
                  <MenuItem disabled>
                    <Typography variant="caption" color="text.secondary">
                      관리자 모드 활성
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { logout(); setAdminMenuAnchor(null) }}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    로그아웃
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Tooltip title="관리자 로그인">
                <IconButton
                  size="small"
                  onClick={() => setAdminOpen(true)}
                  sx={{ color: 'text.secondary', opacity: 0.3, ml: 1, '&:hover': { opacity: 1 } }}
                >
                  <AdminIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box>
        {tab === 'home' && <HomePage />}
      </Box>

      {/* 관리자 로그인 다이얼로그 */}
      <Dialog open={adminOpen} onClose={() => setAdminOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>🔐 관리자 로그인</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="이메일" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <TextField
            fullWidth label="비밀번호" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {loginError && <Alert severity="error" sx={{ mt: 2 }}>{loginError}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAdminOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleLogin} disabled={loginLoading}>
            {loginLoading ? <CircularProgress size={20} /> : '로그인'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
