import { useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, IconButton, Avatar,
  Menu, MenuItem, Divider, Chip, useMediaQuery, useTheme,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Forum as ForumIcon,
  Chat as ChatIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  EmojiEvents as TrophyIcon,
  SportsEsports as GameIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

const DRAWER_WIDTH = 240

const boards = [
  { id: 1, name: '자유게시판', icon: <ForumIcon /> },
  { id: 2, name: '공략 & 팁', icon: <TrophyIcon /> },
  { id: 3, name: '모집 & 파티', icon: <GroupsIcon /> },
]

export default function Layout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box
        onClick={() => { navigate('/boards/1'); setMobileOpen(false) }}
        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
      >
        <GameIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={700} color="primary.light">
          JGA
        </Typography>
      </Box>
      <Divider />

      <Typography variant="caption" sx={{ px: 2, pt: 2, pb: 0.5, color: 'text.secondary', fontWeight: 600, letterSpacing: 1 }}>
        게시판
      </Typography>
      <List dense>
        {boards.map((board) => (
          <ListItem key={board.id} disablePadding>
            <ListItemButton
              onClick={() => { navigate(`/boards/${board.id}`); setMobileOpen(false) }}
              sx={{ borderRadius: 1, mx: 1, '&:hover': { bgcolor: 'rgba(156,100,247,0.1)' } }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'primary.light' }}>{board.icon}</ListItemIcon>
              <ListItemText primary={board.name} primaryTypographyProps={{ fontSize: 14 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />
      <Typography variant="caption" sx={{ px: 2, pb: 0.5, color: 'text.secondary', fontWeight: 600, letterSpacing: 1 }}>
        채팅
      </Typography>
      <List dense>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => { navigate('/chat'); setMobileOpen(false) }}
            sx={{ borderRadius: 1, mx: 1, '&:hover': { bgcolor: 'rgba(156,100,247,0.1)' } }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'primary.light' }}><ChatIcon /></ListItemIcon>
            <ListItemText primary="실시간 채팅" primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: 14 }}>
          {profile?.username?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Typography variant="body2" fontWeight={600} noWrap>{profile?.username ?? user?.email}</Typography>
          <Chip label="온라인" size="small" sx={{ height: 16, fontSize: 10, bgcolor: 'rgba(74,222,128,0.15)', color: '#4ade80' }} />
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" elevation={0} sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1, color: 'primary.light' }}>
            공동 게임 구역
          </Typography>
          <IconButton onClick={() => navigate('/posts/new')} color="primary" title="새 글 작성">
            <AddIcon />
          </IconButton>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: 14 }}>
              {profile?.username?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">{profile?.username ?? user?.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { signOut(); setAnchorEl(null) }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              로그아웃
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent"
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', borderRight: '1px solid', borderColor: 'divider' } }}
          open>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, mt: '64px', p: { xs: 1.5, md: 3 } }}>
        <Outlet />
      </Box>
    </Box>
  )
}
