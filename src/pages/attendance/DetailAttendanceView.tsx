import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { useAppContext } from "../../context/app.context";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
L.Icon.Default.prototype.options.iconUrl = undefined;
L.Icon.Default.prototype.options.iconRetinaUrl = undefined;
L.Icon.Default.prototype.options.shadowUrl = undefined;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface IStore {
  storeId: number;
  storeName: string;
  storeLatitude: string;
  storeLongitude: string;
  storeAddress: string;
}

interface ILocation {
  latitude: number;
  longitude: number;
}

export default function DetailAttendanceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetRequest, handleUpdateRequest } = useHttp();
  const { setAppAlert, setIsLoading } = useAppContext();
  const [currentLocation, setCurrentLocation] = useState<ILocation | null>(
    null
  );
  const [withinRange, setWithinRange] = useState(false);
  const [store, setStore] = useState<IStore | null>(null);
  const MAX_DISTANCE = 100; // meters

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);
    const deltaLat = toRad(lat2 - lat1);
    const deltaLon = toRad(lon2 - lon1);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });

          if (store) {
            const distance = calculateDistance(
              latitude,
              longitude,
              Number(store.storeLatitude),
              Number(store.storeLongitude)
            );
            setWithinRange(distance <= MAX_DISTANCE);
          }
        },
        (error) => {
          console.error(error);
          setAppAlert({
            isDisplayAlert: true,
            message: "Error getting location. Please enable location services.",
            alertType: "error",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setAppAlert({
        isDisplayAlert: true,
        message: "Geolocation is not supported by this browser.",
        alertType: "error",
      });
    }
  };

  const getStoreDetails = async () => {
    try {
      setIsLoading(true);
      const result = await handleGetRequest({
        path: `/stores/detail/${id}`,
      });
      if (result) {
        setStore(result);
      }
    } catch (error) {
      console.error(error);
      setAppAlert({
        isDisplayAlert: true,
        message: "Failed to fetch store details",
        alertType: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setIsLoading(true);
      await handleUpdateRequest({
        path: "/attendances",
        body: { attendanceId: id },
      });
      setAppAlert({
        isDisplayAlert: true,
        message: "Successfully checked in",
        alertType: "success",
      });
      navigate("/attendance");
    } catch (error) {
      console.error(error);
      setAppAlert({
        isDisplayAlert: true,
        message: "Failed to check in",
        alertType: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStoreDetails();
  }, [id]);

  useEffect(() => {
    if (store) {
      getLocation();
      const interval = setInterval(getLocation, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [store]);

  if (!currentLocation || !store) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const storeIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Attendance Check-In
          </Typography>
          <Stack spacing={1}>
            <Typography variant="subtitle1">
              Store: {store.storeName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: {store.storeAddress}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Paper
        elevation={3}
        sx={{
          height: "60vh",
          mb: 2,
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[currentLocation.latitude, currentLocation.longitude]}
          zoom={17}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[currentLocation.latitude, currentLocation.longitude]}
          >
            <Popup>Your Location</Popup>
          </Marker>
          <Marker
            position={[
              Number(store.storeLatitude),
              Number(store.storeLongitude),
            ]}
            icon={storeIcon}
          >
            <Popup>{store.storeName}</Popup>
          </Marker>
        </MapContainer>
      </Paper>

      <Stack spacing={2}>
        {!withinRange && (
          <Alert severity="error">
            You must be within 100 meters of the store location to check in
          </Alert>
        )}
        <Button
          variant="contained"
          disabled={!withinRange}
          onClick={handleCheckIn}
          size="large"
        >
          Check In
        </Button>
      </Stack>
    </Box>
  );
}
