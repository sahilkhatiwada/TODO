import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import $axios from "../lib/axios.instance";
import { FaEdit } from "react-icons/fa";

const Home = () => {
  const [todoId, setTodoId] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["todo-list"],
    queryFn: async () => {
      return $axios.post("/todo/list", {
        page: 1,
        limit: 25,
      });
    },
  });

  const {
    isLoading: deleteLoading,
    isError: deleteIsError,
    error: deleteError,
    data: deleteData,
    mutate: deleteTodo,
  } = useMutation({
    mutationKey: ["delete-todo"],
    mutationFn: async () => {
      return $axios.delete(`/todo/delete/${todoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todo-list");
    },
  });
  const todoList = data?.data;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (isLoading || deleteLoading) {
    return <CircularProgress color="secondary" />;
  }

  if (isError) {
    return (
      <Typography variant="h5">{error || "Something went wrong."}</Typography>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "3rem",
      }}
    >
      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>
          Are you sure you want to delete this task?
        </Typography>
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          mb="0.5rem"
          mr="0.5rem"
        >
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteTodo();
              handleClose();
            }}
          >
            Yes
          </Button>
          <Button variant="contained" color="success" onClick={handleClose}>
            No
          </Button>
        </Stack>
      </Popover>
      <Button
        variant="contained"
        color="success"
        onClick={() => {
          navigate("/add-todo");
        }}
      >
        Add Todo
      </Button>
      <Grid
        container
        sx={{
          mt: "2rem",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {todoList.map((item) => {
          return (
            <Grid
              xs={8}
              sm={6}
              lg={4}
              item
              key={item._id}
              sx={{
                borderRadius: "10px",
                minWidth: "300px",
                minHeight: "150px",
                mb: "2rem",
                padding: "2rem",
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
              }}
            >
              <Typography variant="h5" sx={{ color: "green" }}>
                {item?.title}
              </Typography>
              <Typography>{item?.description}</Typography>

              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={(event) => {
                    openPopover(event);
                    setTodoId(item._id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    navigate(`/edit-todo/${item._id}`);
                  }}
                >
                  <FaEdit />
                </IconButton>
              </ButtonGroup>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Home;
