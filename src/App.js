import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";

import HomePage from "./containers/HomePage/index";
import LoginPage from "./containers/LoginPage/index";
import NotFoundPage from "./containers/NotFoundPage/index";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink
  }
});

const App = () => {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Switch>
            <Route
              exact
              path={["/", "/board", "/board/:room"]}
              component={HomePage}
            />
            <Route
              exact
              path={["/login", "/login/:room"]}
              component={LoginPage}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
