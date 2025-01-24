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
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { PhotoCamera as PhotoCameraIcon } from "@mui/icons-material";
import { IUserUpdateRequestModel } from "../../models/userModel";

export default function EditProfileView() {
  const navigate = useNavigate();
  const { handleUpdateRequest } = useHttp();

  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<IUserUpdateRequestModel>({
    userId: "",
    userName: "",
    userContact: "",
    userPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await handleUpdateRequest({
        path: "/my-profile",
        body: profile,
      });

      navigate("/profiles");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
        open={loading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6">Edit Profile</Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3} alignItems="center">
                <Box position="relative">
                  <Avatar sx={{ width: 100, height: 100 }} />
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
                  value={profile.userName}
                  onChange={(e) =>
                    setProfile({ ...profile, userName: e.target.value })
                  }
                  required
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profile.userContact}
                  onChange={(e) =>
                    setProfile({ ...profile, userContact: e.target.value })
                  }
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  value={profile.userPassword}
                  onChange={(e) =>
                    setProfile({ ...profile, userPassword: e.target.value })
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
