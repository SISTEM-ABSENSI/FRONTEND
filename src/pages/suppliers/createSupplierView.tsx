import { useState } from "react";
import {
  Button,
  Card,
  Typography,
  Box,
  TextField,
  Stack,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { ISupplierCreateRequestModel } from "../../models/supplierModel";

export default function CreateSupplierView() {
  const { handlePostRequest } = useHttp();
  const navigate = useNavigate();

  const [supplierName, setSupplierName] = useState("");
  const [supplierContact, setSupplierContact] = useState("");

  const handleSubmit = async () => {
    try {
      const payload: ISupplierCreateRequestModel = {
        supplierName,
        supplierContact,
      };

      await handlePostRequest({
        path: "/suppliers",
        body: payload,
      });

      navigate("/suppliers");
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Supplier",
            link: "/suppliers",
            icon: <IconMenus.supplier fontSize="small" />,
          },
          {
            label: "Create",
            link: "/suppliers/create",
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
          Create Supplier
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
                label="Nama Supplier"
                id="outlined-supplier-name"
                sx={{ m: 1 }}
                value={supplierName}
                type="text"
                fullWidth
                onChange={(e) => setSupplierName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Kontak Supplier"
                id="outlined-supplier-contact"
                sx={{ m: 1 }}
                value={supplierContact}
                type="text"
                fullWidth
                onChange={(e) => setSupplierContact(e.target.value)}
              />
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
