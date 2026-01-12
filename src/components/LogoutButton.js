import { useAuth0 } from "@auth0/auth0-react";
import { Button, Typography } from "@mui/material";
import React from "react";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const LogoutButton = (props) => {
  const { logout } = useAuth0();

  // Mobile drawer passes customStyles
  if (props.customStyles) {
    return (
      <Button
        variant="contained"
        color="secondary"
        sx={props.customStyles}
        onClick={() => logout({ returnTo: window.location.origin })}
      >
        <MeetingRoomIcon sx={{ m: 1 }} />
        <Typography>SIGNOUT</Typography>
      </Button>
    );
  }

  // Desktop header button
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: 'primary.main',
        color: '#000',
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
        px: 2,
        py: 1,
        borderRadius: 2,
      }}
      onClick={() => logout({ returnTo: window.location.origin })}
      startIcon={<MeetingRoomIcon />}
    >
      Sign Out
    </Button>
  );
};

export default LogoutButton;