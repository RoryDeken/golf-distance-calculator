import { style } from "./App.css.ts";
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  Modal,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridComparatorFn } from "@mui/x-data-grid";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import React, { useState, useEffect } from "react";

function App() {
  interface Club {
    id?: number;
    name?: string;
    dist?: string;
  }
  interface NewClub {
    name?: string;
    dist?: string;
  }

  const [recommended, setRecommended] = useState<String>();
  const [dist, setDist] = useState<String>();
  const [clubs, setClubs] = useState<Club[]>();
  const [addedClub, setAddedClub] = useState<NewClub>();
  const [editedClub, setEditedClub] = useState<Club>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [refreshClubs, setRefreshClubs] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  setRefreshClubs;

  const checkIfInt = (target: string | number | unknown) => {
    let regex = /^[0-9\b]+\s?/;
    return (target as string) === "" || regex.test(target as string);
  };

  const onEditButtonClick = (editedClub?: Club) => {
    axios
      .put(`http://localhost:8080/clubs/${editedClub?.id}`, editedClub)
      .then(() => {
        setIsLoading(false);
        setOpenEdit(false);
        setRefreshClubs(!refreshClubs);
      });
  };
  const onAddButtonClick = (newClub?: NewClub) => {
    setIsLoading(true);
    axios.post("http://localhost:8080/clubs", newClub).then(() => {
      setIsLoading(false);
      setRefreshClubs(!refreshClubs);
      setOpenAdd(false);
      setAddedClub({});
    });
  };
  const onDeleteButtonClick = (e: any, row: any) => {
    e.stopPropagation();
    axios.delete(row.links[0].href).then(() => {
      setIsLoading(false);
      setRefreshClubs(!refreshClubs);
    });
  };
  const handleDistChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    if (checkIfInt(e.currentTarget.value)) {
      setDist(e.currentTarget.value as string);
    } else {
      setDist("");
    }
  };
  useEffect(() => {
    axios.get(`http://localhost:8080/clubs`).then((res) => {
      setClubs(res.data);
    });
  }, [refreshClubs]);
  useEffect(() => {
    dist
      ? axios.get(`http://localhost:8080/suggest/${dist}`).then((res) => {
          setRecommended(res.data);
        })
      : null;
  }, [dist]);

  const stringIntComparator: GridComparatorFn<string> = (s1, s2) =>
    parseInt(s1) - parseInt(s2);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Club name", width: 300 },
    {
      field: "dist",
      headerName: "Club Avg Yardage",
      width: 300,
      sortComparator: stringIntComparator,
    },
    {
      field: "actions",
      headerName: "",
      disableReorder: true,
      width: 300,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() => {
                setEditedClub(params.row);
                handleOpenEdit();
              }}
              variant="contained"
              sx={{ marginRight: 2 }}
            >
              Edit
            </Button>
            <Button
              onClick={(e) => onDeleteButtonClick(e, params.row)}
              variant="contained"
              color="error"
              sx={{ marginRight: 2 }}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ backgroundColor: "#1e692b" }}>
          <Toolbar>
            <IconButton size="large" edge="start" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Club Calculator
            </Typography>
          </Toolbar>
        </AppBar>

        <Grid
          container
          spacing={2}
          sx={{ paddingTop: "100px" }}
          justifyContent={"center"}
        >
          <Grid
            item
            xs={8}
            justifyContent={"center"}
            alignItems={"center"}
            alignContent={"center"}
          >
            <Typography variant="h1">Club Calculator</Typography>
            <Typography variant="subtitle1" sx={{ my: 1 }}>
              {recommended
                ? recommended
                : "Enter a distance into the field to get a suggested club"}
            </Typography>

            <TextField
              sx={{ my: 1 }}
              name="remainingDist"
              label="Distance to hole"
              variant="outlined"
              type="number"
              value={dist}
              onChange={handleDistChange}
            ></TextField>

            <Typography variant="h3" sx={{ my: 5 }}>
              Clubs in bag{" "}
              <Button
                onClick={handleOpenAdd}
                variant="contained"
                color="success"
                sx={{ marginRight: 2 }}
              >
                Add
              </Button>
            </Typography>

            {isLoading ? <LinearProgress /> : null}
            <Box sx={{ width: "100%" }}>
              <DataGrid
                disableRowSelectionOnClick
                disableColumnMenu
                rows={clubs ? clubs : []}
                columns={columns}
                initialState={{
                  sorting: {
                    sortModel: [{ field: "dist", sort: "desc" }],
                  },
                  pagination: { paginationModel: { page: 1, pageSize: 20 } },
                }}
              />

              <Modal
                open={openAdd}
                onClose={handleCloseAdd}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  {isLoading ? <LinearProgress /> : null}
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Add club
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <TextField
                      placeholder="Club name"
                      onChange={(e) => {
                        let added: NewClub = {
                          dist: addedClub?.dist,
                          name: e.target.value,
                        };
                        setAddedClub(added);
                      }}
                      value={addedClub?.name}
                      sx={{ my: 1 }}
                    ></TextField>
                    <TextField
                      placeholder="Club distance in yds"
                      type="number"
                      sx={{ my: 1 }}
                      value={addedClub?.dist}
                      onChange={(e) => {
                        let added: NewClub = {
                          dist: checkIfInt(e.target.value)
                            ? e.target.value
                            : "",
                          name: addedClub?.name,
                        };
                        setAddedClub(added);
                      }}
                    ></TextField>

                    <Grid container my={3}>
                      <Button
                        variant="outlined"
                        onClick={() => onAddButtonClick(addedClub)}
                      >
                        Add
                      </Button>
                    </Grid>
                  </Typography>
                </Box>
              </Modal>
              <Modal
                open={openEdit}
                onClose={handleCloseEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  {isLoading ? <LinearProgress /> : null}
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Edit club
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <TextField
                      sx={{ my: 1 }}
                      placeholder="Club name"
                      onChange={(e) => {
                        let edits: Club = {
                          id: editedClub?.id,
                          dist: editedClub?.dist,
                          name: e.target.value,
                        };
                        setEditedClub(edits);
                      }}
                      value={editedClub?.name}
                    ></TextField>
                    <TextField
                      type="number"
                      sx={{ my: 1 }}
                      placeholder="Club distance in yds"
                      value={editedClub?.dist}
                      onChange={(e) => {
                        let edits: Club = {
                          id: editedClub?.id,
                          dist: checkIfInt(e.target.value)
                            ? e.target.value
                            : "",
                          name: editedClub?.name,
                        };
                        setEditedClub(edits);
                      }}
                    ></TextField>
                    <Grid container my={3}>
                      <Button
                        variant="outlined"
                        onClick={() => onEditButtonClick(editedClub)}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Typography>
                </Box>
              </Modal>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default App;
