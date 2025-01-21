import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { useAppContext } from "../../context/app.context";
import { PhotoCamera as PhotoCameraIcon } from "@mui/icons-material";

interface IProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  photo?: string;
}

export default function EditProfileView() {
  const navigate = useNavigate();
  const { handleUpdateRequest } = useHttp();
  const { setAppAlert, setIsLoading } = useAppContext();
  const [profile, setProfile] = useState<IProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await handleUpdateRequest({
        path: "/users/profile",
        body: profile,
      });
      setAppAlert({
        isDisplayAlert: true,
        message: "Profile updated successfully",
        alertType: "success",
      });
      navigate("/profiles");
    } catch (error) {
      console.error(error);
      setAppAlert({
        isDisplayAlert: true,
        message: "Failed to update profile",
        alertType: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6">Edit Profile</Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3} alignItems="center">
                <Box position="relative">
                  <Avatar
                    src={profile.photo}
                    sx={{ width: 100, height: 100 }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "background.paper",
                    }}
                    size="small"
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  required
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  required
                />

                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                />

                <Stack direction="row" spacing={2} width="100%">
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/profiles")}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" fullWidth>
                    Save Changes
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
