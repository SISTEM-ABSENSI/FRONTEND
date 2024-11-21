import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http";
import { Button, Stack, TextField } from "@mui/material";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { ISpgModel } from "../../models/spgModel";

export default function ListAttendanceView() {
  const [tableData, setTableData] = useState<ISpgModel[]>([]);
  const { handleGetTableDataRequest } = useHttp();

  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 1,
  });

  const getTableData = async ({ search }: { search: string }) => {
    try {
      setLoading(true);
      const result = await handleGetTableDataRequest({
        path: "/attendances", // Path API disesuaikan untuk mengambil data SPG
        page: paginationModel.page + 1,
        size: paginationModel.pageSize,
        filter: { search },
      });

      if (result && result.data) {
        setTableData(result.data?.items);
        setRowCount(result.totalItems);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTableData({ search: "" });
  }, [paginationModel]);

  const columns: GridColDef[] = [
    {
      field: "userName",
      flex: 1,
      renderHeader: () => <strong>{"NAMA"}</strong>,
      valueGetter: (params) => params.row.user?.userName || "", // Access nested user.name
      editable: true,
    },
    {
      field: "storeName",
      flex: 1,
      renderHeader: () => <strong>{"Store"}</strong>,
      valueGetter: (params) => params.row.store?.storeName || "", // Access nested user.name
      editable: true,
    },
    {
      field: "storeAddress",
      flex: 1,
      renderHeader: () => <strong>{"Address"}</strong>,
      valueGetter: (params) => params.row.store?.storeAddress || "", // Access nested user.name
      editable: true,
    },
    {
      field: "scheduleStatus",
      renderHeader: () => <strong>{"STATUS"}</strong>,
      flex: 1,
      editable: true,
    },
    {
      field: "scheduleStartDate",
      renderHeader: () => <strong>{"START"}</strong>,
      flex: 1,
      editable: true,
    },
    {
      field: "scheduleEndDate",
      renderHeader: () => <strong>{"END"}</strong>,
      flex: 1,
      editable: true,
    },
  ];

  function CustomToolbar() {
    const [search, setSearch] = useState<string>("");
    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between", mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <GridToolbarExport />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outlined" onClick={() => getTableData({ search })}>
            Cari
          </Button>
        </Stack>
      </GridToolbarContainer>
    );
  }

  return (
    <Box>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Attendance",
            link: "/attendances",
            icon: <IconMenus.attendance fontSize="small" />,
          },
        ]}
      />
      <Box sx={{ width: "100%", "& .actions": { color: "text.secondary" } }}>
        <DataGrid
          rows={tableData}
          columns={columns}
          getRowId={(row: any) => row.scheduleId}
          editMode="row"
          autoHeight
          pageSizeOptions={[2, 5, 10, 25]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{ toolbar: CustomToolbar }}
          rowCount={rowCount}
          paginationMode="server"
          loading={loading}
        />
      </Box>
    </Box>
  );
}
