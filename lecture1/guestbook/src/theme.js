import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F97316',
      light: '#FB923C',
      dark: '#EA580C',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FBBF24',
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#1C1917',
    },
    background: {
      default: '#FFFBF5',
      paper: '#FFF7ED',
    },
    text: {
      primary: '#1C1917',
      secondary: '#78716C',
    },
    divider: '#FDE8D0',
    error: {
      main: '#EF4444',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.125rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    caption: { fontSize: '0.75rem', fontWeight: 400 },
  },
  spacing: 8,
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
})

export default theme
