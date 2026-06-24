import { createContext, useContext, useState, useMemo } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const ThemeModeContext = createContext()

const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#9c64f7', light: '#c084fc', dark: '#7c3aed' },
    secondary: { main: '#7c3aed' },
    ...(mode === 'dark' ? {
      background: { default: '#0f0f1a', paper: '#1a1a2e' },
      text: { primary: '#e2e8f0', secondary: '#94a3b8' },
      error: { main: '#f87171' },
    } : {
      background: { default: '#f5f3ff', paper: '#ffffff' },
      text: { primary: '#1e1040', secondary: '#6d6987' },
      error: { main: '#dc2626' },
    }),
    divider: 'rgba(156, 100, 247, 0.15)',
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7c3aed 0%, #9c64f7 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(156, 100, 247, 0.15)',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#9c64f7' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6 } },
    },
  },
})

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('jga-theme') ?? 'dark')

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('jga-theme', next)
      return next
    })
  }

  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

export const useThemeMode = () => useContext(ThemeModeContext)
