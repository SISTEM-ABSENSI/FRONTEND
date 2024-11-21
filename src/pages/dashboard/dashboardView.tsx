import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { useHttp } from "../../hooks/http";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet CSS untuk map
import { IStoreModel } from "../../models/storeModel";

// DashboardView dengan Statistik dan Peta Toko
const DashboardView = () => {
  const { handleGetRequest } = useHttp();
  const navigation = useNavigate();

  // State untuk Statistik
  const [statistic, setStatistic] = useState({
    totalUsers: 0,
    totalSpg: 0,
    totalStores: 0,
    totalSuppliers: 0,
  });

  // State untuk Koordinat Peta
  const [coordinates, setCoordinates] = useState<IStoreModel[]>([]);

  // Fungsi untuk mengambil Statistik Dashboard
  const handleGetStatistic = async () => {
    try {
      const result = await handleGetRequest({
        path: "/statistic",
      });
      if (result?.data) {
        setStatistic(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fungsi untuk mengambil Koordinat Toko untuk Peta
  const handleGetStores = async () => {
    try {
      const result = await handleGetRequest({
        path: "/stores",
      });
      if (result?.data) {
        setCoordinates(result?.data?.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetStatistic();
    handleGetStores();
  }, []);

  return (
    <Box>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Dashboard",
            link: "/",
            icon: <IconMenus.dashboard fontSize="small" />,
          },
        ]}
      />

      <Grid container spacing={2} mb={2}>
        {/* Card Statistik */}
        <Grid item md={3} sm={4} xs={12}>
          <Card
            sx={{ p: 3, minWidth: 200, cursor: "pointer" }}
            onClick={() => navigation("/spg")}
          >
            <Stack direction="row" spacing={2}>
              <IconMenus.spg fontSize="large" color={"inherit"} />
              <Stack justifyContent="center">
                <Typography>SPG</Typography>
                <Typography fontSize="large" fontWeight="bold">
                  {statistic.totalSpg}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* Card Statistik Lainnya */}
        <Grid item md={3} sm={4} xs={12}>
          <Card
            sx={{ p: 3, minWidth: 200, cursor: "pointer" }}
            onClick={() => navigation("/admins")}
          >
            <Stack direction="row" spacing={2}>
              <IconMenus.admin fontSize="large" color={"inherit"} />
              <Stack justifyContent="center">
                <Typography>User</Typography>
                <Typography fontSize="large" fontWeight="bold">
                  {statistic.totalUsers}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item md={3} sm={4} xs={12}>
          <Card
            sx={{ p: 3, minWidth: 200, cursor: "pointer" }}
            onClick={() => navigation("/stores")}
          >
            <Stack direction="row" spacing={2}>
              <IconMenus.store fontSize="large" color={"inherit"} />
              <Stack justifyContent="center">
                <Typography>Stores</Typography>
                <Typography fontSize="large" fontWeight="bold">
                  {statistic.totalStores}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item md={3} sm={4} xs={12}>
          <Card
            sx={{ p: 3, minWidth: 200, cursor: "pointer" }}
            onClick={() => navigation("/suppliers")}
          >
            <Stack direction="row" spacing={2}>
              <IconMenus.admin fontSize="large" color={"inherit"} />
              <Stack justifyContent="center">
                <Typography>Supplier</Typography>
                <Typography fontSize="large" fontWeight="bold">
                  {statistic.totalSuppliers}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* Seksi Peta */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, minWidth: 200 }}>
            <Typography variant="h6" mb={2}>
              Store Locations
            </Typography>
            <MapContainer
              center={[-6.1754, 106.8272]} // Center di sekitar Jakarta
              zoom={5}
              maxZoom={20}
              style={{
                height: "75vh",
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />

              {coordinates.map((item) => (
                <Marker
                  key={item.storeId}
                  position={[+item.storeLatitude, +item.storeLongitude]}
                >
                  <Popup>
                    <h1>{item.storeName}</h1>
                    <small>Latitude: {item.storeLatitude}</small><br />
                    <small>Longitude: {item.storeLongitude}</small>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardView;
