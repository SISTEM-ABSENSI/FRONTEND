import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { useToken } from "../../hooks/token";
import { blue, grey } from "@mui/material/colors";

interface IUserProfile {
  userId: string;
  userName: string;
  userEmail: string;
  userContact: string;
  userRole: string;
  createdAt: string;
}

export default function ProfileView() {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const { handleGetRequest } = useHttp();
  const { removeToken } = useToken();
  const navigate = useNavigate();
  const theme = useTheme();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const getMyProfile = async () => {
    try {
      const result = await handleGetRequest({ path: "/my-profile" });
      setProfile(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    removeToken();
    navigate("/");
    window.location.reload();
  };

  const profileDetails = [
    {
      icon: <PersonIcon />,
      label: "Username",
      value: profile?.userName || "-",
    },
    {
      icon: <EmailIcon />,
      label: "Email",
      value: profile?.userEmail || "-",
    },
    {
      icon: <PhoneIcon />,
      label: "Contact",
      value: profile?.userContact || "-",
    },
    {
      icon: <WorkIcon />,
      label: "Role",
      value: profile?.userRole || "-",
    },
    {
      icon: <CalendarIcon />,
      label: "Joined",
      value: profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "-",
    },
  ];

  return (
    <Box sx={{ p: 2, maxWidth: "md", margin: "0 auto" }}>
      {/* Profile Header */}
      <Card sx={{ mb: 3, bgcolor: blue[50], position: "relative" }}>
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
          onClick={() => navigate("/profiles/edit")}
        >
          <EditIcon />
        </IconButton>
        <CardContent>
          <Stack
            direction="column"
            spacing={2}
            alignItems="center"
            textAlign="center"
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                border: `4px solid ${theme.palette.background.paper}`,
              }}
              src="https://vasundharaodisha.org/upload/84552no-user.jpg"
            />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {profile?.userName || "Loading..."}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: grey[600], textTransform: "capitalize" }}
              >
                {profile?.userRole?.toLowerCase() || "Loading..."}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Profile Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {profileDetails.map((detail, index) => (
              <ListItem
                key={index}
                sx={{
                  px: 0,
                  py: 1,
                }}
              >
                <ListItemIcon sx={{ color: blue[500] }}>
                  {detail.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="textSecondary">
                      {detail.label}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1">{detail.value}</Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Actions */}
      <Stack spacing={2}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate("/profiles/edit")}
          fullWidth
          sx={{ py: 1.5 }}
        >
          Edit Profile
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogoutClick}
          fullWidth
          sx={{ py: 1.5 }}
        >
          Logout
        </Button>
      </Stack>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleLogoutConfirm}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
