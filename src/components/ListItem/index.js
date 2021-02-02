import React from "react";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Badge from "@material-ui/core/Badge";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import EmojiFoodBeverageIcon from "@material-ui/icons/EmojiFoodBeverage";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { withStyles } from "@material-ui/core/styles";

const StyledBadge = withStyles(theme => ({
  badge: {
    top: 36,
    right: theme.spacing(1) + 1,
    height: 10,
    minWidth: 10,
    borderRadius: 5,
    border: "solid 1px white"
  }
}))(Badge);

const Item = ({ player, showResult }) => {
  return (
    <ListItem divider>
      <ListItemAvatar>
        <StyledBadge variant="dot" color="primary">
          <Box
            style={{
              fontSize: 46,
              lineHeight: 1,
              color: "#444"
            }}
          >
            <AccountCircle fontSize="inherit" />
          </Box>
        </StyledBadge>
      </ListItemAvatar>
      <ListItemText primary={player.name} secondary="" />
      <React.Fragment>
        {showResult ? (
          <Box style={{ fontSize: 24 }}>
            {player.vote === "C" ? (
              <EmojiFoodBeverageIcon style={{ verticalAlign: "top" }} />
            ) : (
              player.vote
            )}
          </Box>
        ) : (
          <Box>
            {player.vote !== null && <CheckCircleOutlineIcon color="primary" />}
          </Box>
        )}
      </React.Fragment>
    </ListItem>
  );
};

export default Item;
