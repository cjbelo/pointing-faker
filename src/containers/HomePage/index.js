import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { SnackbarProvider, useSnackbar } from "notistack";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import * as Session from "../../utils/session";
import * as Helper from "../../utils/helper";

import AppBar from "../../components/AppBar/index";
import CardItem from "../../components/CardItem/index";
import ListItemComp from "../../components/ListItem/index";
import Copyright from "../../components/Copyright/index";
import Result from "../../components/Result/index";

// const ENDPOINT = "172.168.0.76:5000";
const ENDPOINT = "192.168.1.44:5001";
let socket;

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1.5, 0),
  },
  cardGrid: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  listSubheader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  invite: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#fafcfe",
    "& .actionButtons": {
      marginTop: theme.spacing(1),
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
    },
    "& .label": {
      marginTop: 30,
      fontSize: 20,
    },
    "& .inviteInput": {
      marginTop: 10,
      marginBottom: 10,
    },
  },
  alerts: {
    "& [role='alert']:not(:last-child)": {
      marginBottom: 5,
    },
  },
  titleCont: {
    display: "flex",
    alignItems: "center",
    height: 42,
    "& .icon": {
      color: theme.palette.grey[600],
    },
  },
}));

const cards = [0, "½", 1, 2, 3, 5, 8, 13, 20, 40, 100, "C"];

const HomePage = ({ history, match }) => {
  const [host, setHost] = useState(false);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [vote, setVote] = useState(null);
  const [players, setPlayers] = useState([]);
  const [canShowVote, setCanShowVote] = useState(false);
  const [canReset, setCanReset] = useState(false);
  const [story, setStory] = useState("Story Title");
  const [oldStory, setOldStory] = useState("Story Title");
  const [editing, setEditing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    socket = io(ENDPOINT);

    const isLoggedIn = Session.get("isLoggedIn");
    const { room: paramRoom } = match.params;
    const roomHash = !paramRoom ? "" : Helper.isMd5(paramRoom) ? `/${paramRoom}` : "";

    if (!isLoggedIn) {
      history.push(`/login${roomHash}`);
    } else {
      const isHost = Session.get("isHost");
      const name = Session.get("name");
      const room = Session.get("room");

      isHost && setHost(true);

      setName(name);
      setRoom(room);

      socket.emit("join", { name, room }, (ret) => {
        setStory(ret.title);
        if (ret.error) {
          console.log("Join error:", ret.error);
        }
      });

      return () => {
        socket.emit("disconnect");
        socket.off();
      };
    }
  }, [history, match.params]);

  useEffect(() => {
    socket.on("message", (obj) => {
      if (obj.reset) {
        setVote(null);
        setShowResult(false);
      }
      setPlayers(obj.users);
      enqueueSnackbar(obj.message, { variant: obj.variant });

      if (host) {
        if (obj.users.length) {
          let hasNull = false;
          let hasVote = false;
          for (var u of obj.users) {
            if (u.vote === null) {
              hasNull = true;
            } else {
              hasVote = true;
            }
          }
          setCanShowVote(!hasNull);
          setCanReset(hasVote);
        }
      }
    });
    socket.on("storyMessage", (obj) => {
      setStory(obj.story);
      enqueueSnackbar(obj.message, { variant: obj.variant });
    });
    socket.on("resultMessage", (obj) => {
      setPlayers(obj.users);
      setShowResult(obj.show);
      setVote(null);
    });
  }, [enqueueSnackbar, host]);

  const logout = () => {
    Session.clear();
    window.location.href = `/login`;
  };

  const handleSetVote = (card) => {
    socket.emit("setVote", card, () => {
      setVote(card);
    });
  };

  const resetVotes = () => {
    socket.emit("resetVotes");
  };

  const updateStory = () => {
    socket.emit("setStory", story, () => {
      setEditing(false);
    });
  };

  const showVotes = () => {
    socket.emit("showVotes", () => {
      setShowResult(true);
    });
  };

  const hideResult = () => {
    socket.emit("doneVoting", () => {
      setShowResult(false);
    });
  };

  return (
    <React.Fragment>
      <AppBar name={name} logout={logout} />
      <Box component="main">
        <Box className={classes.header}>
          <Container className={classes.titleCont}>
            {editing ? (
              <React.Fragment>
                <TextField
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Escape") {
                      setStory(oldStory);
                      setEditing(false);
                    }
                    e.key === "Enter" && updateStory();
                  }}
                  autoFocus={true}
                />
                <CheckIcon color="primary" onClick={updateStory} />
                <ClearIcon
                  color="secondary"
                  onClick={() => {
                    setStory(oldStory);
                    setEditing(false);
                  }}
                />
              </React.Fragment>
            ) : (
              <Typography
                component="h1"
                variant="h4"
                color="textPrimary"
                onClick={() => {
                  host && setOldStory(story);
                  setEditing(true);
                }}
              >
                {story}
                {host && (
                  <React.Fragment>
                    {" "}
                    <Box component="span" className="icon">
                      <EditIcon />
                    </Box>
                  </React.Fragment>
                )}
              </Typography>
            )}
          </Container>
        </Box>
        <Container className={classes.cardGrid}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              {showResult ? (
                <Result cards={cards} players={players} hideResult={hideResult} isHost={host} />
              ) : (
                <Grid container spacing={2}>
                  {cards.map((card) => (
                    <CardItem card={card} vote={vote} setVote={handleSetVote} key={card} />
                  ))}
                </Grid>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <List
                  className={classes.list}
                  disablePadding
                  subheader={
                    <ListSubheader component="div" className={classes.listSubheader}>
                      Players...
                    </ListSubheader>
                  }
                >
                  {players.map((p) => (
                    <ListItemComp key={p.id} player={p} showResult={showResult} />
                  ))}
                  <ListItem className={classes.invite}>
                    {host && (
                      <Box className="actionButtons">
                        <Button variant="contained" color="primary" disabled={!canShowVote} onClick={showVotes}>
                          Show Votes
                        </Button>
                        <Button variant="contained" color="secondary" disabled={!canReset} onClick={resetVotes}>
                          Reset Votes
                        </Button>
                      </Box>
                    )}
                    <Typography className="label">Invite your team</Typography>
                    <TextField
                      fullWidth
                      readOnly
                      variant="outlined"
                      className="inviteInput"
                      value={`${window.location.href}login/${room}`}
                      inputProps={{
                        readOnly: true,
                      }}
                      onClick={(event) => event.target.select()}
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box component="footer" className={classes.footer}>
        <Copyright />
      </Box>
    </React.Fragment>
  );
};

const IntegrationNotistack = ({ history, match }) => {
  return (
    <SnackbarProvider
      maxSnack={8}
      autoHideDuration={4000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <HomePage history={history} match={match} />
    </SnackbarProvider>
  );
};

export default IntegrationNotistack;
