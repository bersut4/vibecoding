import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import MenuIcon from '@mui/icons-material/Menu'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

const NAV_ITEMS = [
  { label: 'Home',       path: '/' },
  { label: 'About Me',   path: '/about' },
  { label: 'Projects',   path: '/projects' },
]

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleNav = (path) => {
    navigate(path)
    setDrawerOpen(false)
  }

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 2,
            color: 'var(--color-secondary)',
          }}
          onClick={() => handleNav('/')}
        >
          MY PORTFOLIO
        </Typography>

        {isMobile ? (
          <>
            <IconButton sx={{ color: 'var(--color-secondary)' }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{ sx: { backgroundColor: 'var(--color-bg-card)', borderLeft: '1px solid var(--color-border-gold)' } }}
            >
              <Box sx={{ width: 220, pt: 2 }}>
                <List>
                  {NAV_ITEMS.map((item) => (
                    <ListItem key={item.path} disablePadding>
                      <ListItemButton
                        selected={location.pathname === item.path}
                        onClick={() => handleNav(item.path)}
                        sx={{
                          color: 'var(--color-text-primary)',
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(200,160,86,0.15)',
                            color: 'var(--color-secondary)',
                          },
                          '&:hover': { color: 'var(--color-secondary)' },
                        }}
                      >
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.path}
                onClick={() => handleNav(item.path)}
                sx={{
                  color: location.pathname === item.path
                    ? 'var(--color-secondary)'
                    : 'var(--color-text-secondary)',
                  fontWeight: location.pathname === item.path ? 700 : 400,
                  borderBottom: location.pathname === item.path
                    ? '2px solid var(--color-secondary)'
                    : '2px solid transparent',
                  borderRadius: 0,
                  pb: 0.5,
                  '&:hover': { color: 'var(--color-secondary)', borderBottom: '2px solid rgba(200,160,86,0.4)' },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
