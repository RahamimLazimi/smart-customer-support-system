import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { fetchTickets } from "../../redux/ticket/ticketSlice";

import TicketsHeader from "../../components/Tickets/TicketsHeader";
import TicketsFilters from "../../components/Tickets/TicketsFilters";
import TicketsTable from "../../components/Tickets/TicketsTable";
import CreateTicketModal from "../../components/Tickets/CreateTicketModal";

export default function TicketsPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(s => s.tickets);

  const user = useAppSelector(s => s.auth.user);
  const isAdmin = user?.role === "Admin";

  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  return (
    <Box>

      <TicketsHeader />

      <TicketsFilters
        status={status}
        setStatus={setStatus}
        setSearch={setSearch}
      />

      <TicketsTable
        tickets={items}
        status={status}
        search={search}
        isAdmin={isAdmin}
      />

      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: "#ff9800",
            "&:hover": { backgroundColor: "#fb8c00" }
          }}
        >
          Create Ticket
        </Button>
      </Box>

      <CreateTicketModal open={open} setOpen={setOpen} />

    </Box>
  );
}