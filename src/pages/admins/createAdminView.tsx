import { useState } from "react";
import {
  Button,
  Card,
  Typography,
  Box,
  TextField,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { IUserCreateRequestModel } from "../../models/userModel";

export default function CreateAdminView() {
  const { handlePostRequest } = useHttp();
  const navigate = useNavigate();

  const [userContact, setUserContact] = useState("");
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState<
    "admin" | "superAdmin" | "supplier" | string
  >("admin");

  const handleSubmit = async () => {
    try {
      const payload: IUserCreateRequestModel = {
        userName,
        userContact,
        userPassword,
        userRole,
      };

      await handlePostRequest({
        path: "/users/register",
        body: payload,
      });

      navigate("/admins");
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Admin",
            link: "/admins",
            icon: <IconMenus.admin fontSize="small" />,
          },
          {
            label: "Create",
            link: "/admins/create",
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
          Tambah Admin
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
                label="Nama"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                value={userName}
                type="text"
                fullWidth
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Kontak"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                value={userContact}
                fullWidth
                onChange={(e) => {
                  setUserContact(e.target.value);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                value={userPassword}
                type="password"
                fullWidth
                onChange={(e) => {
                  setUserPassword(e.target.value);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-multiple-name-label">
                  Pilih Role
                </InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={userRole}
                  fullWidth
                  sx={{ m: 1 }}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <MenuItem selected value={"admin"}>
                    Admin
                  </MenuItem>
                  <MenuItem value={"superAdmin"}>Super Admin</MenuItem>
                  <MenuItem value={"supplier"}>Supplier</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Stack direction={"row"} justifyContent="flex-end">
            <Button variant={"contained"} onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Card>
    </>
  );
}
