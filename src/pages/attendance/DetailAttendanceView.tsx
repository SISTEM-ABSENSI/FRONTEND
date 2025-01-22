import { useEffect, useState, useRef } from "react";
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
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { useAppContext } from "../../context/app.context";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { IStoreModel } from "../../models/storeModel";
import { PhotoCamera as PhotoCameraIcon } from "@mui/icons-material";

// Fix the Leaflet marker icon paths
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const storeIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface ILocation {
  latitude: number;
  longitude: number;
}

export default function DetailAttendanceView() {
  const { id } = useParams();
  console.log("___id___", id);
  const navigate = useNavigate();
  const location = useLocation();
  const store = location.state.store as IStoreModel;
  const { handleUpdateRequest } = useHttp();
  const { setAppAlert } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<ILocation | null>(
    null
  );
  const [withinRange, setWithinRange] = useState(false);
  const MAX_DISTANCE = 50; // meters
  const [photo, setPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error(error);
      setAppAlert({
        isDisplayAlert: true,
        message: "Failed to access camera. Please allow camera access.",
        alertType: "error",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      const photoData = canvas.toDataURL("image/jpeg");
      setPhoto(photoData);
      stopCamera();
    }
  };

  const handleCheckIn = async () => {
    if (!photo) {
      setAppAlert({
        isDisplayAlert: true,
        message: "Please take a photo first",
        alertType: "warning",
      });
      return;
    }

    try {
      setIsLoading(true);
      await handleUpdateRequest({
        path: "/attendances",
        body: {
          attendanceId: id,
          attendancePhoto: photo,
        },
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
    if (store) {
      getLocation();
      const interval = setInterval(getLocation, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, []);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
          center={
            [currentLocation.latitude, currentLocation.longitude] as [
              number,
              number
            ]
          }
          zoom={17}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
            You must be within 50 meters of the store location to check in
          </Alert>
        )}

        <Button
          variant="outlined"
          color="primary"
          startIcon={<PhotoCameraIcon />}
          onClick={startCamera}
          disabled={!withinRange || isLoading}
          fullWidth
        >
          Take Photo
        </Button>

        <Button
          variant="contained"
          disabled={!withinRange || !photo || isLoading}
          onClick={handleCheckIn}
          size="large"
          fullWidth
        >
          Check In
        </Button>
      </Stack>

      {/* Camera Dialog */}
      <Dialog open={showCamera} onClose={stopCamera} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 1 }}>
          <Box sx={{ position: "relative", width: "100%" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={stopCamera}>Cancel</Button>
          <Button
            onClick={capturePhoto}
            variant="contained"
            startIcon={<PhotoCameraIcon />}
          >
            Capture
          </Button>
        </DialogActions>
      </Dialog>

      {/* Photo Preview Dialog */}
      {photo && (
        <Dialog
          open={!!photo && !showCamera}
          onClose={() => setPhoto(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent>
            <Box
              component="img"
              src={photo}
              alt="Verification photo"
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 1,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setPhoto(null);
                startCamera();
              }}
            >
              Retake
            </Button>
            <Button onClick={() => setPhoto(null)} variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
