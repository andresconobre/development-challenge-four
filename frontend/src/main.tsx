import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App'
import './index.css'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00b3ad',
      dark: '#008984',
      light: '#72e3de',
    },
    secondary: {
      main: '#1476d1',
      light: '#6fb5f1',
    },
    background: {
      default: '#eef8fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#143042',
      secondary: '#5b7382',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Nunito Sans", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontSize: '2.1rem',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h5: {
      fontSize: '1.375rem',
      fontWeight: 700,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 18,
          minHeight: 44,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(20, 48, 66, 0.08)',
          boxShadow: '0 20px 50px rgba(13, 74, 109, 0.08)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        size: 'medium',
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#f8fcfd',
          '&.Mui-disabled': {
            backgroundColor: '#e9f1f4',
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(20, 48, 66, 0.18)',
            borderStyle: 'dashed',
          },
          '&.Mui-disabled .MuiOutlinedInput-input': {
            WebkitTextFillColor: '#6f8592',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#5b7382',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#5b7382',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
