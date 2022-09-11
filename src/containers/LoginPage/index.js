import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import md5 from "md5";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import VpnKey from "@material-ui/icons/VpnKey";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import Copyright from "../../components/Copyright/index";

import * as Session from "../../utils/session";
import * as Helper from "../../utils/helper";

// const ENDPOINT = "172.168.0.76:5000";
const ENDPOINT = "192.168.1.44:5001";
let socket;

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundImage: "url(https://source.unsplash.com/collection/137627/calm-wallpapers)",
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.type === "dark" ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    padding: theme.spacing(2),
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
  note: {
    marginTop: theme.spacing(1),
    fontSize: 12,
    color: theme.palette.grey[700],
  },
}));

const LoginPage = ({ history, match }) => {
  const [room, setRoom] = useState("");
  const [showError, setShowError] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Create a Room");
  const [isHost, setIsHost] = useState(true);

  const classes = useStyles();

  useEffect(() => {
    const { room: paramRoom } = match.params;
    const isLoggedIn = Session.get("isLoggedIn");

    if (isLoggedIn) {
      history.push("/");
    } else {
      socket = io(ENDPOINT);

      if (paramRoom && Helper.isMd5(paramRoom)) {
        socket.emit("getRooms", (rooms) => {
          setRoom(paramRoom);
          if (rooms.indexOf(paramRoom) > -1) {
            setButtonLabel("Join");
            setIsHost(false);
          }
        });
      } else {
        setRoom(md5(new Date()));
      }
    }
  }, [history, match.params]);

  const formSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();

    if (name) {
      socket.emit("getUsersInRoom", room, (users) => {
        const user = users ? users.find((user) => user.name === name) : undefined;
        if (user) {
          setShowError("Name is already taken!");
        } else {
          Session.set("name", name);
          Session.set("room", room);
          Session.set("isLoggedIn", true);
          if (isHost) {
            Session.set("isHost", true);
          }
          history.push("/");
        }
      });
    } else {
      setShowError("Please enter your name!");
    }
  };

  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowError("");
  };

  const handleKeyUp = (e) => {
    const { value } = e.target;
    if (value && showError && e.key !== "Enter") {
      setShowError("");
    }
  };

  return (
    <Box component="main" className={classes.root}>
      <Container maxWidth="xs">
        <Card className={classes.container} elevation={6}>
          <Box className={classes.paper}>
            <Avatar className={classes.avatar}>
              <VpnKey />
            </Avatar>
            <Typography component="h1" variant="h5">
              Let's start pointing!
            </Typography>
            <form className={classes.form} noValidate onSubmit={formSubmit}>
              <TextField
                error={!!showError}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Enter your Name"
                name="name"
                autoComplete="off"
                // autoFocus
                onKeyUp={handleKeyUp}
              />
              {showError && (
                <Alert onClose={handleClose} severity="error">
                  {showError}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                size="large"
              >
                {buttonLabel}
              </Button>
              {isHost && <Typography className={classes.note}>* You are hosting a session</Typography>}
            </form>
            <Box mt={8}>
              <Copyright />
            </Box>
          </Box>
        </Card>
      </Container>
      {/* <Snackbar open={showError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Please enter your name!
        </Alert>
      </Snackbar> */}
    </Box>
  );
};

export default LoginPage;
