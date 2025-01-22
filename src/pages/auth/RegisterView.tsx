import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Typography,
  Container,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { blue } from "@mui/material/colors";

interface IRegisterPayload {
  userName: string;
  userPassword: string;
  userContact: string;
  userDeviceId: string;
  userRole: string;
}

const getDeviceId = () => {
  const screen = `${window.screen.width}x${window.screen.height}`;
  const agent = navigator.userAgent;
  return btoa(`${agent}-${screen}`);
};

export default function RegisterView() {
  const navigate = useNavigate();
  const { handlePostRequest } = useHttp();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceId] = useState<string>(getDeviceId());

  const [formData, setFormData] = useState({
    userName: "",
    userContact: "",
    userPassword: "",
  });

  const [errors, setErrors] = useState({
    userName: "",
    userContact: "",
    userPassword: "",
    general: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (formData.userName.length < 5 || formData.userName.length > 15) {
      newErrors.userName = "Name must be between 5 and 15 characters";
      isValid = false;
    }

    if (!formData.userContact) {
      newErrors.userContact = "Phone number is required";
      isValid = false;
    }

    if (formData.userPassword.length < 6) {
      newErrors.userPassword = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload: IRegisterPayload = {
        userName: formData.userName,
        userPassword: formData.userPassword,
        userContact: formData.userContact,
        userDeviceId: deviceId,
        userRole: "user",
      };

      await handlePostRequest({
        path: "/auth/register",
        body: payload,
      });

      navigate("/login");
    } catch (error: any) {
      setErrors({
        ...errors,
        general: error.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: `linear-gradient(45deg, ${blue[700]} 0%, ${blue[500]} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Card
          elevation={8}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              color="primary"
              fontWeight="bold"
              gutterBottom
            >
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please fill in the details to register
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                fullWidth
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                error={!!errors.userName}
                helperText={errors.userName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ bgcolor: "background.paper" }}
              />

              <TextField
                label="Phone Number"
                type="tel"
                fullWidth
                value={formData.userContact}
                onChange={(e) =>
                  setFormData({ ...formData, userContact: e.target.value })
                }
                error={!!errors.userContact}
                helperText={errors.userContact}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ bgcolor: "background.paper" }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={formData.userPassword}
                onChange={(e) =>
                  setFormData({ ...formData, userPassword: e.target.value })
                }
                error={!!errors.userPassword}
                helperText={errors.userPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ bgcolor: "background.paper" }}
              />

              {errors.general && (
                <Typography color="error" variant="body2" textAlign="center">
                  {errors.general}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mt: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  boxShadow: 2,
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Sign Up"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: blue[500],
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </form>
        </Card>
      </Container>
    </Box>
  );
}
