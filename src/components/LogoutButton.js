import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "@emotion/react";
import { Button, Typography } from "@mui/material";
import React from "react";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const LogoutButton = (props) => {
  const { logout } = useAuth0();

  return (
    <Button variant={"contained"} color="secondary" sx={props.customStyles} onClick={() => logout({ returnTo: window.location.origin })}>
      {props.customStyles ? <MeetingRoomIcon sx={{ m: 1 }} /> : null}
      <Typography> SIGNOUT </Typography>
    </Button>
  );
};

export default LogoutButton;