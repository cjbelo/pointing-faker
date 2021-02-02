import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  appBarTitle: {
    flexGrow: 1
  },
  icon: {
    marginRight: theme.spacing(2)
  },
  iconButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Bar = ({ name, logout }) => {
  const classes = useStyles();

  return (
    <AppBar position="relative">
      <Toolbar>
        <SettingsBackupRestoreIcon fontSize="large" className={classes.icon} />
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          className={classes.appBarTitle}
        >
          Pointing Faker
        </Typography>
        <Button color="inherit" title="Logout" onClick={logout}>
          {name}
          <ExitToAppIcon className={classes.iconButton} />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Bar;
