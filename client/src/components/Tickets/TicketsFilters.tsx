import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { TICKET_STATUSES } from "../../types/ticket";
import { useState } from "react";

export default function TicketsFilters({
  status,
  setStatus,
  setSearch
}: any) {
  const [inputValue, setInputValue] = useState("");

  const debouncedSetSearch = useDebouncedCallback(setSearch, 400);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearch(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mt: 2,
        mb: 2,
        width: "100%"
      }}
    >
      <FormControl size="small" sx={{ flex: 1 }}>
        <InputLabel>Status</InputLabel>

        <Select
          value={status}
          label="Status"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>

          {TICKET_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}

          <MenuItem value="Default">Default</MenuItem>
        </Select>
      </FormControl>

      <TextField
        size="small"
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        sx={{ flex: 1 }}
      />
    </Box>
  );
}