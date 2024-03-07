import {
  AppBar,
  Box,
  Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

function App() {
  const [dist, setDist] = useState<number | string>();
  const checkIfInt = (target: string | number | unknown) => {
    let regex = /^[0-9\b]+\s?/;
    return (target as string) === "" || regex.test(target as string);
  };
  const handleSpeedChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    console.log(e.currentTarget.value);
    if (checkIfInt(e.currentTarget.value)) {
      var dist = parseInt(e.currentTarget.value as string) * 1.65;
      setDist(Math.round(dist));
    }
  };

  return (
    <>
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
        ></Grid>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="fixed" sx={{ backgroundColor: "#1e692b" }}>
            <Toolbar>
              <IconButton size="large" edge="start" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Golf Distance Calculator
              </Typography>
            </Toolbar>
          </AppBar>
          <Grid
            container
            spacing={2}
            sx={{ paddingTop: "50px", paddingBottom: "100px" }}
            justifyContent={"center"}
          >
            <Grid
              item
              xs={8}
              justifyContent={"center"}
              alignItems={"center"}
              alignContent={"center"}
            >
              <Typography variant="h3" sx={{ paddingBottom: 2 }}>
                Distance Calculator
              </Typography>

              <TextField
                sx={{ my: 1 }}
                name="ballSpeed"
                label="Ball Speed in MPH"
                variant="outlined"
                type="number"
                defaultValue={140}
                onChange={handleSpeedChange}
              ></TextField>

              <Typography
                variant="h4"
                sx={{ paddingTop: "50px", paddingBottom: "50px" }}
              >
                Total Projected Carry Distance: {dist ? dist + "yds*" : ""}
              </Typography>

              <Typography
                variant="body1"
                sx={{ paddingTop: "50px", paddingBottom: "50px" }}
              >
                *This distance may vary based on elevation, temperature, launch
                angle, spin, and air moisture. This uses a baseline coefficient
                of 1:1.65 from ballspeed to distance as a benchmark with a
                driver.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  );
}

export default App;
