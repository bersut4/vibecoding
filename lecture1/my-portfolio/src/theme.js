import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C8A056',
      light: '#E8BA66',
      dark: '#A07030',
      contrastText: '#0A0A14',
    },
    secondary: {
      main: '#D42B2B',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0A0A14',
      paper: '#1E1E2E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0C0',
      disabled: '#6A6A7A',
    },
    divider: '#2E2E3E',
    error: { main: '#D42B2B' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem',   fontWeight: 700 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem',fontWeight: 600 },
    body1: { fontSize: '1rem',    lineHeight: 1.7 },
    body2: { fontSize: '0.875rem',lineHeight: 1.6 },
  },
  spacing: 8,
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 8,
        },
        containedPrimary: {
          color: '#0A0A14',
          '&:hover': { backgroundColor: '#E8BA66' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E2E',
          border: '1px solid #2E2E3E',
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0A0A14',
          borderBottom: '1px solid #5A4520',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#2E2E3E' },
            '&:hover fieldset': { borderColor: '#C8A056' },
            '&.Mui-focused fieldset': { borderColor: '#C8A056' },
          },
        },
      },
    },
  },
})

export default theme
