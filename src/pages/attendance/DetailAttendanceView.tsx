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
import { useLocation, useParams } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { useAppContext } from "../../context/app.context";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { IStoreModel } from "../../models/storeModel";
import { PhotoCamera as PhotoCameraIcon } from "@mui/icons-material";
import { IAttendanceModel } from "../../models/attendanceModel";
import { handleUploadImageToFirebase } from "../../utilities/uploadImageToFirebase";
import moment from "moment";
import { convertTime } from "../../utilities/convertTime";

// Fix the Leaflet marker icon paths
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
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

interface IState extends IAttendanceModel {
  store: IStoreModel;
}

export default function DetailAttendanceView() {
  const { id } = useParams();
  const location = useLocation();
  const attendance = location.state.attendance as IState;

  const { handleUpdateRequest } = useHttp();
  const { setAppAlert } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<ILocation | null>(
    null
  );
  const [withinRange, setWithinRange] = useState(false);
  const MAX_DISTANCE = 50000000; // meters
  const [photo, setPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);

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

          if (attendance?.store) {
            const distance = calculateDistance(
              latitude,
              longitude,
              Number(attendance?.store?.storeLatitude),
              Number(attendance?.store?.storeLongitude)
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
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Store the blob temporarily instead of uploading
          const imageUrl = URL.createObjectURL(blob);
          setPhoto(imageUrl);
          // Store the blob for later upload
          setPhotoBlob(blob);
        }
      }, "image/jpeg");

      stopCamera();
    }
  };

  const handleCheckIn = async () => {
    if (!photo || !photoBlob) {
      setAppAlert({
        isDisplayAlert: true,
        message: "Please take a photo first",
        alertType: "warning",
      });
      return;
    }

    const currentTime = moment();
    const startDate = moment(attendance.scheduleStartDate);
    // const endDate = moment(attendance.scheduleEndDate);

    // Check if attendance is being done on the same day

    if (attendance?.scheduleStatus === "waiting") {
      if (!currentTime.isSame(startDate, "day")) {
        setAppAlert({
          isDisplayAlert: true,
          message: `Cannot record attendance. Schedule is for ${startDate.format(
            "YYYY-MM-DD"
          )} but current date is ${currentTime.format("YYYY-MM-DD")}`,
          alertType: "error",
        });
        return;
      }
    }

    if (attendance?.scheduleStatus === "waiting") {
      if (currentTime.isAfter(startDate)) {
        const timeSinceEnd = moment.duration(currentTime.diff(startDate));
        const hoursLate = Math.floor(timeSinceEnd.asHours());
        const minutesLate = timeSinceEnd.minutes();

        const confirmLate = window.confirm(
          `You are ${hoursLate}h ${minutesLate}m late. Schedule started at ${startDate.format(
            "YYYY-MM-DD HH:mm:ss"
          )}. Do you want to continue?`
        );

        if (!confirmLate) {
          return;
        }

        setAppAlert({
          isDisplayAlert: true,
          message: `Late attendance recorded. You are ${hoursLate}h ${minutesLate}m late.`,
          alertType: "warning",
        });
      }
    }

    try {
      setIsLoading(true);

      // Create a File object from the blob
      const imageFile = new File(
        [photoBlob],
        `attendance-photo-${Date.now()}.jpg`,
        {
          type: "image/jpeg",
        }
      );

      // Upload to Firebase and get URL
      let uploadedImageUrl = "";

      // Wait for the image upload to complete and URL to be returned
      await new Promise((resolve, reject) => {
        handleUploadImageToFirebase({
          selectedFile: imageFile,
          getImageUrl: (imageUrl: string) => {
            uploadedImageUrl = imageUrl;
            resolve(imageUrl);
          },
        }).catch(reject);
      });

      // Verify we have the image URL before proceeding
      if (!uploadedImageUrl) {
        alert("Failed to upload image");
        throw new Error("Failed to upload image");
      }

      const payload = {
        attendanceId: id,
        attendancePhoto: uploadedImageUrl,
        attendanceTime: currentTime.format("YYYY-MM-DD HH:mm:ss"),
      };

      await handleUpdateRequest({
        path: "/attendances",
        body: payload,
      });

      setAppAlert({
        isDisplayAlert: true,
        message: `Successfully ${
          attendance?.scheduleStatus === "checkin"
            ? "checked out"
            : "checked in"
        } at ${currentTime.format("YYYY-MM-DD HH:mm:ss")}`,
        alertType: "success",
      });
      window.history.back();
    } catch (error: unknown) {
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

  const openCamera = () => {
    setShowCamera(true);
    startCamera();
  };

  useEffect(() => {
    if (attendance?.store) {
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

  if (!currentLocation || !attendance?.store) {
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
              Store: {attendance?.store?.storeName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: {attendance?.store?.storeAddress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start: {convertTime(attendance?.scheduleStartDate)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              End:
              {convertTime(attendance?.scheduleEndDate)}
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
            icon={defaultIcon}
            position={[currentLocation.latitude, currentLocation.longitude]}
          >
            <Popup>Your Location</Popup>
          </Marker>
          <Marker
            position={[
              Number(attendance?.store?.storeLatitude),
              Number(attendance?.store?.storeLongitude),
            ]}
            icon={defaultIcon}
          >
            <Popup>{attendance?.store?.storeName}</Popup>
          </Marker>
        </MapContainer>
      </Paper>

      <Stack spacing={2}>
        {!withinRange && (
          <Alert severity="error">
            You must be within 50 meters of the Clinic location to check in
          </Alert>
        )}

        {photo && (
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
        )}

        <Button
          variant="outlined"
          color="primary"
          startIcon={<PhotoCameraIcon />}
          onClick={openCamera}
          disabled={!withinRange || isLoading}
          fullWidth
        >
          Open Camera
        </Button>

        <Button
          variant="contained"
          disabled={!withinRange || !photo || isLoading}
          onClick={handleCheckIn}
          size="large"
          fullWidth
        >
          {attendance?.scheduleStatus === "checkin" ? "Check Out" : "Check In"}
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
    </Box>
  );
}
