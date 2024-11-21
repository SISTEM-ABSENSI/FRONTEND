import { useState } from "react";
import {
  Button,
  Card,
  Typography,
  Box,
  TextField,
  Stack,
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { IStoreCreateRequestModel } from "../../models/storeModel";

export default function CreateStoreView() {
  const { handlePostRequest } = useHttp();
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState("");
  const [storeLongitude, setStoreLongitude] = useState("");
  const [storeLatitude, setStoreLatitude] = useState("");
  const [storeAddress, setStoreAddress] = useState("");


  const handleSubmit = async () => {
    try {
      const payload: IStoreCreateRequestModel = {
        storeName,
        storeLongitude,
        storeLatitude,
        storeAddress
      };

      await handlePostRequest({
        path: "/stores",
        body: payload,
      });

      navigate("/stores");
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Store",
            link: "/stores",
            icon: <IconMenus.store fontSize="small" />,
          },
          {
            label: "Create",
            link: "/stores/create",
          },
        ]}
      />
      <Card
        sx={{
          mt: 5,
          p: { xs: 3, md: 5 },
        }}
      >
        <Typography
          variant="h4"
          marginBottom={5}
          color="primary"
          fontWeight={"bold"}
        >
          Create Store
        </Typography>
        <Box
          component="form"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                value={storeName}
                fullWidth
                onChange={(e) => {
                  setStoreName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Alamat"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                value={storeAddress}
                fullWidth
                minRows={4}
                onChange={(e) => {
                  setStoreAddress(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Longitude"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                value={storeLongitude}
                type="text"
                fullWidth
                onChange={(e) => {
                  setStoreLongitude(e.target.value);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Latitude"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                value={storeLatitude}
                fullWidth
                onChange={(e) => {
                  setStoreLatitude(e.target.value);
                }}
              />
            </Grid>
          </Grid>
          <Stack direction={"row"} justifyContent="flex-end">
            <Button variant={"contained"} onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Card>
    </>
  );
}
