import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Typography,
  Box,
  TextField,
  Stack,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { IStoreUpdateRequestModel } from "../../models/storeModel";
import { IconMenus } from "../../components/icon";
import BreadCrumberStyle from "../../components/breadcrumb/Index";

export default function EditStoreView() {
  const { handleUpdateRequest, handleGetRequest } = useHttp();
  const { storeId } = useParams();

  // State untuk menyimpan data toko
  const [storeName, setStoreName] = useState("");
  const [storeLongitude, setStoreLongitude] = useState("");
  const [storeLatitude, setStoreLatitude] = useState("");
  const [storeAddress, setStoreAddress] = useState("");


  const handleSubmit = async () => {
    try {
      const payload: IStoreUpdateRequestModel = {
        storeId: storeId!,
        storeName,
        storeLongitude,
        storeLatitude,
        storeAddress
      };

      await handleUpdateRequest({
        path: "/stores/",
        body: payload,
      });

      window.history.back();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const getDetailStore = async () => {
    const result = await handleGetRequest({
      path: "/stores/detail/" + storeId,
    });

    if (result) {
      setStoreName(result?.data?.storeName);
      setStoreLongitude(result?.data?.storeLongitude);
      setStoreLatitude(result?.data?.storeLatitude);
      setStoreAddress(result?.data?.storeAddress);
    }
  };

  useEffect(() => {
    getDetailStore();
  }, []);

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
            label: "Edit",
            link: "/stores/edit/" + storeId,
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
          Edit Store
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
                label="Nama Toko"
                value={storeName}
                type="text"
                fullWidth
                onChange={(e) => {
                  setStoreName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Alamat"
                value={storeAddress}
                type="text"
                fullWidth
                onChange={(e) => {
                  setStoreAddress(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Longitude"
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
                value={storeLatitude}
                type="text"
                fullWidth
                onChange={(e) => {
                  setStoreLatitude(e.target.value);
                }}
              />
            </Grid>
          </Grid>
          <Stack direction={"row"} justifyContent="flex-end">
            <Button
              sx={{
                m: 1,
                width: "25ch",
                backgroundColor: "dodgerblue",
                color: "#FFF",
                fontWeight: "bold",
              }}
              variant={"contained"}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </Card>
    </>
  );
}
