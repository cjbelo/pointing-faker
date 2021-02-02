import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import ClearIcon from "@material-ui/icons/Clear";
import EmojiFoodBeverageIcon from "@material-ui/icons/EmojiFoodBeverage";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    "& .close-button": {
      cursor: "Pointer"
    }
  },
  content: {
    margin: theme.spacing(6, 10),
    display: "flex",
    justifyContent: "space-between",
    "& ul": {
      margin: 0,
      padding: 0,
      listStyle: "none",
      fontSize: 24,
      "& li": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        "& span": {
          lineHeight: 1,
          padding: theme.spacing(0.8, 0),
          "&:first-child": {
            marginRight: theme.spacing(5),
            color: theme.palette.grey[600]
          },
          "& svg": {
            verticalAlign: "top"
          }
        }
      }
    }
  }
}));

const Result = ({ cards, players, hideResult, isHost }) => {
  const classes = useStyles();
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const votes = [];
    const findIndex = (votes, label) => {
      return votes.findIndex(vote => vote.label === label);
    };
    if (players.length) {
      for (var player of players) {
        const index = findIndex(votes, player.vote);
        if (index > -1) {
          votes[index].count += 1;
        } else {
          votes.push({ label: player.vote, count: 1 });
        }
      }
      setVotes(votes);
    }
  }, [players]);

  return (
    <Card style={{ minHeight: "100%" }}>
      <CardContent>
        <Box className={classes.header}>
          <Typography component="h3" variant="h5">
            Result
          </Typography>
          {isHost && (
            <ClearIcon className="close-button" onClick={hideResult} />
          )}
        </Box>
        <Box className={classes.content}>
          <Box>Pie is still being cooked...</Box>
          <ul>
            {votes.map((v, i) => {
              const coffee = <EmojiFoodBeverageIcon />;
              const label = v.label === "C" ? coffee : v.label;
              return (
                <li key={i}>
                  <span>{label}</span>
                  <span>{v.count}</span>
                </li>
              );
            })}
          </ul>
        </Box>
        {isHost && (
          <Box style={{ textAlign: "right" }} onClick={hideResult}>
            <Button variant="contained" color="primary">
              Done
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Result;
