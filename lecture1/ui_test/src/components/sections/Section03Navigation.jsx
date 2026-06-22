import { useState } from 'react'
import {
  Box, Typography, AppBar, Toolbar, Button, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemText, Divider,
} from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material'

const MENU_ITEMS = ['홈', '소개', '서비스', '연락처']

const Section03Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleMenuClick = (item) => {
    alert(`"${item}" 메뉴 클릭!`)
    setDrawerOpen(false)
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        03. Navigation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        AppBar + Toolbar — 데스크탑 메뉴 / 모바일 햄버거 메뉴
      </Typography>

      <AppBar position="static" color="primary" sx={{ borderRadius: 1 }}>
        <Toolbar>
          {/* 로고 */}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            MyApp
          </Typography>

          {/* 데스크탑 메뉴 */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {MENU_ITEMS.map((item) => (
              <Button
                key={item}
                color="inherit"
                onClick={() => handleMenuClick(item)}
              >
                {item}
              </Button>
            ))}
          </Box>

          {/* 모바일 햄버거 아이콘 */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 모바일 드로어 */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 220 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
            <Typography variant="h6" fontWeight={700}>메뉴</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {MENU_ITEMS.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton onClick={() => handleMenuClick(item)}>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

export default Section03Navigation
