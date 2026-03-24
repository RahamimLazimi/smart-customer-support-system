import { Modal, Paper, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "../../redux/hook";
import { ticketSchema, type TicketFormData } from "../../schema/ticket";
import { createTicket } from "../../redux/ticket/ticketSlice";


export default function CreateTicketModal({ open, setOpen }: any) {
  const dispatch = useAppDispatch();
  const [fileName, setFileName] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema)
  });

  const onSubmit = (data: TicketFormData) => {
    const formData = new FormData();
    debugger;
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("description", data.description);

    if (data.image) {
      formData.append("image", data.image);
    }
    dispatch(createTicket(formData));
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Paper
        sx={{
          width: 400,
          margin: "100px auto",
          padding: 3,
          borderRadius: 3
        }}
      >
        {/* Title */}
        <Typography variant="h6" textAlign="center" mb={2}>
          Create Ticket
        </Typography>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Name */}
          <Typography variant="body2">Name</Typography>
          <TextField
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          {/* Email */}
          <Typography variant="body2">Email address</Typography>
          <TextField
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Description */}
          <Typography variant="body2">Description</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            sx={{ mb: 1 }}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          {/* Upload */}
          <Typography variant="body2">Upload an image</Typography>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 1 }}
          >
            Choose File
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setFileName(file.name);
                  setValue("image", file);
                }
              }}
            />
          </Button>

          {fileName && (
            <Typography variant="caption" display="block" mb={2}>
              Selected: {fileName}
            </Typography>
          )}

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#ff9800",
              "&:hover": { backgroundColor: "#fb8c00" }
            }}
          >
            Submit
          </Button>

        </form>
      </Paper>
    </Modal>
  );
}