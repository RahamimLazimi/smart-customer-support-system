import { Box, Typography } from "@mui/material";
import LogoutButton from "../Logout/Logout";

export default function TicketsHeader() {
  return (
    <Box
      sx={{
        backgroundColor: "#1976d2",
        color: "white",
        textAlign: "center",
        p: 2
      }}
    >
      <LogoutButton />
      <Typography variant="h5">
        Ticket Management
        
      </Typography>

    </Box>
  );
}