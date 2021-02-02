import React from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import EmojiFoodBeverageIcon from "@material-ui/icons/EmojiFoodBeverage";

const useStyles = makeStyles(theme => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0 2px 5px rgba(0,0,0,.4)"
    },
    "& .CardLabel": {
      color: "grey",
      paddingBottom: theme.spacing(0.5),
      "&.Bottom": {
        transform: "rotate(180deg)"
      }
    },
    "& .CardContent": {
      flexGrow: 1,
      margin: theme.spacing(0, 2.5),
      padding: theme.spacing(4, 0),
      border: "1px solid #d5d9de",
      borderRadius: theme.spacing(0.5),
      textAlign: "center"
    }
  },
  cardSelected: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "& .CardLabel": {
      color: "white"
    },
    "& .CardContent": {
      borderColor: "white"
    }
  }
}));

const CardItem = ({ card, vote, setVote }) => {
  const classes = useStyles();

  const coffee = <EmojiFoodBeverageIcon style={{ fontSize: 50 }} />;
  const inner = card === "C" ? coffee : card;

  return (
    <Grid item xs={6} sm={3}>
      <Card
        className={`${classes.card} ${
          vote === card ? classes.cardSelected : ""
        }`}
        onClick={() => setVote(card)}
      >
        <Typography className="CardLabel Top">{card}</Typography>
        <Box className="CardContent">
          <Box fontSize={40}>{inner}</Box>
        </Box>
        <Typography className="CardLabel Bottom">{card}</Typography>
      </Card>
    </Grid>
  );
};

export default CardItem;
