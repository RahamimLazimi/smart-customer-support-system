import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import type { Ticket } from "../../types/ticket";

interface TicketState {
  items: Ticket[];
  loading: boolean;
  error: string | null;
}

const initialState: TicketState = {
  items: [],
  loading: false,
  error: null
};

// GET
export const fetchTickets = createAsyncThunk<Ticket[]>(
  "tickets/fetch",
  async () => {
    const res = await api.get("/tickets");
    return res.data;
  }
);

// POST (FormData)
export const createTicket = createAsyncThunk<Ticket, FormData>(
  "tickets/create",
  async (formData) => {
    const res = await api.post("/tickets", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  }
);

// PUT
export const updateTicket = createAsyncThunk(
  "tickets/update",
  async ({ id, data }: any) => {
    await api.put(`/tickets/${id}`, data);
    return { id, data };
  }
);

export const deleteTicket = createAsyncThunk<string, string>(
  "tickets/delete",
  async (id) => {
    await api.delete(`/tickets/${id}`);
    return id;
  }
);

const slice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        const ticket = state.items.find(t => t.id === action.payload.id);
        if (ticket) {
          Object.assign(ticket, action.payload.data);
        }
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      });
  }
});

export default slice.reducer;