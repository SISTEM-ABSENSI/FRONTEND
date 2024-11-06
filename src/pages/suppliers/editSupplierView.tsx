import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Typography,
  Box,
  TextField,
  Stack,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { ISupplierUpdateRequestModel } from "../../models/supplierModel";
import { IconMenus } from "../../components/icon";
import BreadCrumberStyle from "../../components/breadcrumb/Index";

export default function EditSupplierView() {
  const { handleUpdateRequest, handleGetRequest } = useHttp();
  const { supplierId } = useParams();

  const [supplierName, setSupplierName] = useState("");
  const [supplierContact, setSupplierContact] = useState("");

  const handleSubmit = async () => {
    try {
      const payload: ISupplierUpdateRequestModel = {
        supplierId: supplierId ?? "",
        supplierName,
        supplierContact
      };

      await handleUpdateRequest({
        path: "/suppliers/" + supplierId,
        body: payload,
      });

      window.history.back();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const getDetailSupplier = async () => {
    const result = await handleGetRequest({
      path: "/suppliers/" + supplierId,
    });

    if (result) {
      setSupplierName(result?.data?.supplierName || "");
      setSupplierContact(result?.data?.supplierContact || "");
    }
  };

  useEffect(() => {
    getDetailSupplier();
  }, []);

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
            label: "Edit",
            link: "/suppliers/edit/" + supplierId,
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
          Edit Supplier
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
            <Button
              sx={{
                m: 1,
                width: "25ch",
                backgroundColor: "dodgerblue",
                color: "#FFF",
                fontWeight: "bold",
              }}
              variant={"contained"}
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
