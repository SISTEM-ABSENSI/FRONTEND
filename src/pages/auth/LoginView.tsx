import { useState } from "react";
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
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { useToken } from "../../hooks/token";
import { IUserLoginRequestModel } from "../../models/userModel";
import { blue } from "@mui/material/colors";

export default function LoginView() {
  const { handlePostRequest } = useHttp();
  const { setToken } = useToken();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [userPayload, setUserPayload] = useState<IUserLoginRequestModel>({
    userName: "",
    userPassword: "",
  });

  const handleSubmit = async () => {
    try {
      const result = await handlePostRequest({
        path: "/auth/login",
        body: userPayload,
      });

      if (result && result?.token) {
        setToken(result?.token);
        window.location.reload();
        navigate("/");
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: `linear-gradient(45deg, ${blue[700]} 0%, ${blue[500]} 100%)`,
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
          <Box
            sx={{
              mb: 4,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              color="primary"
              fontWeight="bold"
              gutterBottom
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Please sign in to continue
            </Typography>
          </Box>

          <Stack spacing={3} width="100%">
            <TextField
              label="Username"
              fullWidth
              value={userPayload.userName}
              onChange={(e) => {
                setUserPayload({ ...userPayload, userName: e.target.value });
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={userPayload.userPassword}
              onChange={(e) => {
                setUserPayload({
                  ...userPayload,
                  userPassword: e.target.value,
                });
              }}
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
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              sx={{
                py: 1.5,
                mt: 2,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1.1rem",
              }}
            >
              Sign In
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: blue[500],
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
