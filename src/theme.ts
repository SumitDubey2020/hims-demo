import { createTheme } from '@mui/material/styles';

export const colors = {
  header: '#0B5CAD',
  sidebar: '#0B3A7A',
  sidebarActive: '#1565C0',
  pageBg: '#F2F6FC',
  border: '#D5DEEB',
  tableHead: '#E6EEFA',
  text: '#1F2A44',
  muted: '#6B7A99',
  new: '#1976D2',
  save: '#1E9E4A',
  update: '#12408F',
  delete: '#E5252A',
};

/** Thin, light-grey scrollbar (Firefox + WebKit). */
export const thinScroll = (thumb = '#B8C2D3') => ({
  scrollbarWidth: 'thin',
  scrollbarColor: `${thumb} transparent`,
  '&::-webkit-scrollbar': { width: 5, height: 5 },
  '&::-webkit-scrollbar-thumb': { background: thumb, borderRadius: 4 },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
} as const);

export const theme = createTheme({
  palette: {
    primary: { main: colors.new },
    success: { main: colors.save },
    error: { main: colors.delete },
    background: { default: colors.pageBg },
    text: { primary: colors.text, secondary: colors.muted },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
    fontSize: 13,
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    // Stops MUI from locking page scroll (and shifting layout) when a dropdown/menu/popup opens
    MuiModal: { defaultProps: { disableScrollLock: true } },
    MuiPopover: { defaultProps: { disableScrollLock: true } },
    MuiMenu: { defaultProps: { disableScrollLock: true } },
    MuiCssBaseline: {
      styleOverrides: {
        html: { overflowY: 'scroll' },
        'html, body, #root': {
          width: '100% !important', maxWidth: 'none !important', margin: '0 !important', padding: '0 !important',
          textAlign: 'left !important', display: 'block !important', minHeight: '100%',
        },
        body: { overflowX: 'hidden' },
      },
    },
    MuiFormControlLabel: { styleOverrides: { label: { fontSize: 13 } } },
    MuiTextField: { defaultProps: { size: 'small', fullWidth: true } },
    MuiOutlinedInput: { styleOverrides: { root: { background: '#fff', fontSize: 12.5 } } },
    MuiMenuItem: { styleOverrides: { root: { fontSize: 12.5, minHeight: 32 } } },
  },
});
