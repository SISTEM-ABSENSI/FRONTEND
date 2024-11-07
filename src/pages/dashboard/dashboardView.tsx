import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { useHttp } from "../../hooks/http";
import { useEffect, useState } from "react";
import { IStatisticModel } from "../../models/statisticModel";
import { useNavigate } from "react-router-dom";

const DashboardView = () => {
  const { handleGetRequest } = useHttp();

  const navigation = useNavigate();

  const [statistic, setStatistic] = useState<IStatisticModel>({
    totalUsers: 0,
    totalSpg: 0,
    totalStores: 0,
    totalSuppliers: 0,
  });

  const handleGetStatistic = async () => {
    const result = await handleGetRequest({
      path: "/statistic",
    });

    if (result?.data) {
      setStatistic(result.data);
    }
  };

  useEffect(() => {
    handleGetStatistic();
  }, []);

  return (
    <Box>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Dashboard",
            link: "/",
            icon: <IconMenus.dashboard fontSize="small" />,
          },
        ]}
      />

      <Grid container spacing={2} mb={2}>
        <Grid item md={3} sm={4} xs={12}>
          <Card
            sx={{ p: 3, minWidth: 200, cursor: "pointer" }}
            onClick={() => navigation("/spg")}
          >
            <Stack direction="row" spacing={2}>
              <IconMenus.spg fontSize="large" color={"inherit"} />
              <Stack justifyContent="center">
                <Typography>SPG</Typography>
                <Typography fontSize="large" fontWeight="bold">
                  {statistic?.totalSpg}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid item md={3} sm={4} xs={12}>
          <Card
            sx={{ p: 3, minWidth: 200, cursor: "pointer" }}
            onClick={() => navigation("/admins")}
          >
            <Stack direction="row" spacing={2}>
              <IconMenus.admin fontSize="large" color={"inherit"} />
              <Stack justifyContent="center">
                <Typography>User</Typography>
                <Typography fontSize="large" fontWeight="bold">
                  {statistic?.totalUsers}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item md={3} sm={4} xs={12}>
          <Card
            sx={{ p: 3, minWidth: 200, cursor: "pointer" }}
            onClick={() => navigation("/stores")}
          >
            <Stack direction="row" spacing={2}>
              <IconMenus.store fontSize="large" color={"inherit"} />
              <Stack justifyContent="center">
                <Typography>Stores</Typography>
                <Typography fontSize="large" fontWeight="bold">
                  {statistic?.totalStores}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item md={3} sm={4} xs={12}>
          <Card
            sx={{ p: 3, minWidth: 200, cursor: "pointer" }}
            onClick={() => navigation("/suppliers")}
          >
            <Stack direction="row" spacing={2}>
              <IconMenus.admin fontSize="large" color={"inherit"} />
              <Stack justifyContent="center">
                <Typography>Supplier</Typography>
                <Typography fontSize="large" fontWeight="bold">
                  {statistic?.totalSuppliers}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardView;
