import AppRouters from "./routers";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    // primary: {
    //   main: '#4FD15A'
    // }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> <AppRouters />
    </ThemeProvider>
  );
}

export default App;
