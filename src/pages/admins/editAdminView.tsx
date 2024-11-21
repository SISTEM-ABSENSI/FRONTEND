import { useEffect, useState } from "react";
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
import { useParams, useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import {  IUserUpdateRequestModel } from "../../models/userModel";
import { IconMenus } from "../../components/icon";
import BreadCrumberStyle from "../../components/breadcrumb/Index";

export default function EditAdminView() {
  const { handleUpdateRequest, handleGetRequest } = useHttp();
  const { adminId } = useParams();
  const navigate = useNavigate();

  const [userContact, setUserContact] = useState("");
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("admin");

  const handleSubmit = async () => {
    try {
      const payload: IUserUpdateRequestModel = {
        userId: adminId!,
        userName,
        userContact,
        userPassword,
        userRole,
      };

      await handleUpdateRequest({
        path: "/users",
        body: payload,
      });

      navigate("/admins");
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const getDetailUser = async () => {
    const result = await handleGetRequest({
      path: "/users/detail/" + adminId,
    });

    if (result) {
      setUserContact(result?.data?.userContact || "");
      setUserName(result?.data?.userName);
      setUserRole(result?.data?.userRole);
    }
  };

  useEffect(() => {
    getDetailUser();
  }, []);

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
            label: "Edit",
            link: "/admins/edit/" + adminId,
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
          Edit Admin
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
                onChange={(e) => setUserName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Kontak"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                value={userContact}
                fullWidth
                onChange={(e) => setUserContact(e.target.value)}
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
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-multiple-name-label">Pilih Role</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={userRole}
                  fullWidth
                  sx={{ m: 1 }}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="superAdmin">Super Admin</MenuItem>
                  <MenuItem value="supplier">Supplier</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              sx={{
                m: 1,
                width: "25ch",
                backgroundColor: "dodgerblue",
                color: "#FFF",
                fontWeight: "bold",
              }}
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </Card>
    </>
  );
}
