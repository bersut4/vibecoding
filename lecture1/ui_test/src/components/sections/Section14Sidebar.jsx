import { useState } from 'react'
import {
  Box, Typography, Stack, Button, Divider, Paper, Chip,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  IconButton, ToggleButtonGroup, ToggleButton, Avatar,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Widgets as WidgetsIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'

const NAV_GROUPS = [
  {
    label: '메인',
    items: [
      { id: 'home', label: '홈', icon: <HomeIcon fontSize="small" /> },
      { id: 'profile', label: '프로필', icon: <PersonIcon fontSize="small" /> },
      { id: 'components', label: '컴포넌트', icon: <WidgetsIcon fontSize="small" /> },
      { id: 'docs', label: '문서', icon: <ArticleIcon fontSize="small" /> },
    ],
  },
  {
    label: '계정',
    items: [
      { id: 'settings', label: '설정', icon: <SettingsIcon fontSize="small" /> },
      { id: 'logout', label: '로그아웃', icon: <LogoutIcon fontSize="small" />, color: 'error.main' },
    ],
  },
]

const Section14Sidebar = () => {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState('left')
  const [activeId, setActiveId] = useState('home')

  const handleNavClick = (id) => {
    setActiveId(id)
    setOpen(false)
  }

  const activeItem = NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === activeId)

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        14. Sidebar (Drawer)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Drawer + List + ListItemButton — 왼쪽/오른쪽 위치 선택, 네비게이션 링크
      </Typography>

      {/* 컨트롤 */}
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">위치:</Typography>
        <ToggleButtonGroup
          value={anchor}
          exclusive
          onChange={(_, v) => v && setAnchor(v)}
          size="small"
        >
          <ToggleButton value="left">
            <ChevronRightIcon fontSize="small" sx={{ mr: 0.5 }} /> 왼쪽
          </ToggleButton>
          <ToggleButton value="right">
            오른쪽 <ChevronLeftIcon fontSize="small" sx={{ ml: 0.5 }} />
          </ToggleButton>
        </ToggleButtonGroup>

        <Button
          variant="contained"
          startIcon={<MenuIcon />}
          onClick={() => setOpen(true)}
        >
          사이드바 열기
        </Button>
      </Stack>

      {/* 선택된 메뉴 표시 */}
      <Paper variant="outlined" sx={{ px: 2.5, py: 2, display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
        <Typography variant="caption" color="text.secondary">현재 페이지:</Typography>
        {activeItem && (
          <>
            <Box sx={{ color: 'primary.main', display: 'flex' }}>{activeItem.icon}</Box>
            <Chip label={activeItem.label} color="primary" size="small" />
          </>
        )}
      </Paper>

      {/* Drawer */}
      <Drawer
        anchor={anchor}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={{ width: 260, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* 헤더 */}
          <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem' }}>U</Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>사용자</Typography>
                <Typography variant="caption" color="text.secondary">user@example.com</Typography>
              </Box>
            </Stack>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider />

          {/* 네비게이션 */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 1 }}>
            {NAV_GROUPS.map(({ label, items }, gi) => (
              <Box key={label}>
                {gi > 0 && <Divider sx={{ my: 1 }} />}
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ px: 2, py: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}
                >
                  {label}
                </Typography>
                <List dense disablePadding>
                  {items.map(({ id, label: itemLabel, icon, color }) => {
                    const isActive = activeId === id
                    return (
                      <ListItem key={id} disablePadding>
                        <ListItemButton
                          selected={isActive}
                          onClick={() => handleNavClick(id)}
                          sx={{
                            mx: 1,
                            borderRadius: 1,
                            color: color ?? 'inherit',
                            '&.Mui-selected': {
                              bgcolor: 'primary.main',
                              color: '#fff',
                              '&:hover': { bgcolor: 'primary.dark' },
                              '& .MuiListItemIcon-root': { color: '#fff' },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36, color: color ?? (isActive ? '#fff' : 'inherit') }}>
                            {icon}
                          </ListItemIcon>
                          <ListItemText primary={itemLabel} />
                        </ListItemButton>
                      </ListItem>
                    )
                  })}
                </List>
              </Box>
            ))}
          </Box>

          {/* 하단 */}
          <Divider />
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="caption" color="text.disabled">v1.0.0 — MUI Sidebar 예제</Typography>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}

export default Section14Sidebar
