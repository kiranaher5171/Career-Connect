"use client";
import { ThemeProvider, createTheme } from "@mui/material";
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import PropTypes from 'prop-types';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-outfit), Outfit, sans-serif',
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-outfit), Outfit, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-outfit), Outfit, sans-serif',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-outfit), Outfit, sans-serif',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-outfit), Outfit, sans-serif',
        },
      },
    },
  },
});

const ThemeProviderComponent = ({ children, nonce }) => {
  const cache = createCache({
    key: 'dpa',
    nonce: nonce,
    prepend: true,
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};

ThemeProviderComponent.propTypes = {
  children: PropTypes.node.isRequired,
  nonce: PropTypes.string.isRequired,
};

export default ThemeProviderComponent;
