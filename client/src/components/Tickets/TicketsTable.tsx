import { Box, Button, Select, MenuItem, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useAppDispatch } from "../../redux/hook";
import { updateTicket, deleteTicket } from "../../redux/ticket/ticketSlice";
import { useMemo, useState } from "react";
import { TICKET_STATUSES, type Ticket } from "../../types/ticket";
import { normalizeStatus } from "../../utils/status";

interface TicketsTableProps {
  tickets: Ticket[];
  status: string;
  search: string;
  isAdmin: boolean;
}

export default function TicketsTable({
  tickets,
  status,
  search,
  isAdmin
}: TicketsTableProps) {
  const dispatch = useAppDispatch();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Ticket>>({});

  const filtered = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return tickets.filter((t) => {
      const matchesStatus = status === "All" || t.status === status;

      const matchesSearch =
        t.name.toLowerCase().includes(lowerSearch) ||
        t.description.toLowerCase().includes(lowerSearch);

      return matchesStatus && matchesSearch;
    });
  }, [tickets, status, search]);

  const startEdit = (row: Ticket) => {
    setEditingId(row.id);
    setDraft(row);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = () => {
    if (!editingId) return;

    dispatch(
      updateTicket({
        id: editingId,
        data: draft
      })
    );

    setEditingId(null);
    setDraft({});
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this ticket?")) {
      dispatch(deleteTicket(id));
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "summary", headerName: "Summary", flex: 2 },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        editingId === params.row.id && isAdmin ? (
          <Select
            size="small"
            value={draft.status || ""}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                status: e.target.value
              }))
            }
          >
            {TICKET_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        ) : (
          params.value
        )
    },

    {
      field: "resolution",
      headerName: "Resolution",
      flex: 2,
      renderCell: (params: GridRenderCellParams) =>
        editingId === params.row.id && isAdmin ? (
          <TextField
            size="small"
            value={draft.resolution || ""}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                resolution: e.target.value
              }))
            }
          />
        ) : (
          params.value
        )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const isEditing = editingId === params.row.id;

        if (!isAdmin) return null;

        return isEditing ? (
          <>
            <Button size="small" onClick={saveEdit}>
              Save
            </Button>
            <Button size="small" onClick={cancelEdit}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button size="small" onClick={() => startEdit(params.row)}>
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </Button>
          </>
        );
      }
    }
  ];

  return (
    <Box sx={{ height: 400 }}>
      <DataGrid
        rows={filtered}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
      />
    </Box>
  );
}