import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, IconButton, Avatar,
  Menu, MenuItem, Divider, Chip, useMediaQuery, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Forum as ForumIcon,
  Chat as ChatIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  SportsEsports as GameIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const DRAWER_WIDTH = 240

export default function Layout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [boards, setBoards] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [newBoardDesc, setNewBoardDesc] = useState('')
  const [editBoardOpen, setEditBoardOpen] = useState(false)
  const [editBoardId, setEditBoardId] = useState(null)
  const [editBoardName, setEditBoardName] = useState('')
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { fetchBoards() }, [])

  const fetchBoards = async () => {
    const { data } = await supabase.from('boards').select('*').order('id')
    setBoards(data ?? [])
  }

  const handleAddBoard = async () => {
    if (!newBoardName.trim()) return
    await supabase.from('boards').insert({ name: newBoardName.trim(), description: newBoardDesc.trim() })
    setNewBoardName('')
    setNewBoardDesc('')
    setAddOpen(false)
    fetchBoards()
  }

  const handleOpenEditBoard = (board, e) => {
    e.stopPropagation()
    setEditBoardId(board.id)
    setEditBoardName(board.name)
    setEditBoardOpen(true)
  }

  const handleEditBoard = async () => {
    if (!editBoardName.trim()) return
    await supabase.from('boards').update({ name: editBoardName.trim() }).eq('id', editBoardId)
    setEditBoardOpen(false)
    fetchBoards()
  }

  const handleDeleteBoard = async (boardId, e) => {
    e.stopPropagation()
    if (!window.confirm('이 게시판을 삭제하시겠습니까? 게시판의 모든 게시글도 삭제됩니다.')) return
    await supabase.from('boards').delete().eq('id', boardId)
    fetchBoards()
    navigate('/boards/' + (boards.find(b => b.id !== boardId)?.id ?? ''))
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box
        onClick={() => { navigate('/boards/1'); setMobileOpen(false) }}
        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
      >
        <GameIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={700} color="primary.light">JGA</Typography>
      </Box>
      <Divider />

      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 2, pb: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 1, flexGrow: 1 }}>
          게시판
        </Typography>
        {isAdmin && (
          <IconButton size="small" onClick={() => setAddOpen(true)} sx={{ color: 'primary.light' }}>
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>

      <List dense>
        {boards.map((board) => (
          <ListItem key={board.id} disablePadding secondaryAction={
            isAdmin && (
              <Box sx={{ display: 'flex' }}>
                <IconButton size="small" onClick={(e) => handleOpenEditBoard(board, e)} sx={{ color: 'primary.light', opacity: 0.6, '&:hover': { opacity: 1 } }}>
                  <EditIcon sx={{ fontSize: 13 }} />
                </IconButton>
                <IconButton size="small" onClick={(e) => handleDeleteBoard(board.id, e)} sx={{ color: 'error.main', opacity: 0.6, '&:hover': { opacity: 1 } }}>
                  <DeleteIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </Box>
            )
          }>
            <ListItemButton
              onClick={() => { navigate(`/boards/${board.id}`); setMobileOpen(false) }}
              sx={{ borderRadius: 1, mx: 1, '&:hover': { bgcolor: 'rgba(156,100,247,0.1)' } }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'primary.light' }}><ForumIcon /></ListItemIcon>
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
        <Avatar src={profile?.avatar_url ?? undefined} sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: 14 }}>
          {profile?.username?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" fontWeight={600} noWrap>{profile?.username ?? user?.email}</Typography>
            {isAdmin && <Chip label="관리자" size="small" sx={{ height: 16, fontSize: 9, bgcolor: 'rgba(248,113,113,0.15)', color: '#f87171' }} />}
          </Box>
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
            <Avatar src={profile?.avatar_url ?? undefined} sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: 14 }}>
              {profile?.username?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">{profile?.username ?? user?.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null) }}>
              <ProfileIcon fontSize="small" sx={{ mr: 1 }} />
              마이페이지
            </MenuItem>
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

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>새 게시판 추가</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="게시판 이름" value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)} sx={{ mb: 2, mt: 1 }} />
          <TextField fullWidth label="게시판 설명 (선택)" value={newBoardDesc}
            onChange={(e) => setNewBoardDesc(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleAddBoard}>추가</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editBoardOpen} onClose={() => setEditBoardOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>게시판 이름 수정</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus fullWidth label="게시판 이름" value={editBoardName}
            onChange={(e) => setEditBoardName(e.target.value)} sx={{ mt: 1 }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleEditBoard() }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditBoardOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleEditBoard}>저장</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
