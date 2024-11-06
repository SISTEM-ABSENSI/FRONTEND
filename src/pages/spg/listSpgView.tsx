import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http";
import { Button, Stack, TextField } from "@mui/material";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { useNavigate } from "react-router-dom";
import ModalStyle from "../../components/modal";
import { ISpgModel } from "../../models/spgModel";

export default function ListSpgView() {
  const [tableData, setTableData] = useState<ISpgModel[]>([]);
  const { handleGetTableDataRequest, handleRemoveRequest } = useHttp();
  const navigation = useNavigate();

  const [modalDeleteData, setModalDeleteData] = useState<ISpgModel>();
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

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
        path: "/users", // Path API disesuaikan untuk mengambil data SPG
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

  const handleDeleteSpg = async (userId: string) => {
    await handleRemoveRequest({
      path: `/users/${userId}`, // Pastikan endpoint disesuaikan
    });
    window.location.reload();
  };

  const handleOpenModalDelete = (data: ISpgModel) => {
    setModalDeleteData(data);
    setOpenModalDelete(!openModalDelete);
  };

  useEffect(() => {
    getTableData({ search: "" });
  }, [paginationModel]);

  const columns: GridColDef[] = [
    {
      field: "userName",
      flex: 1,
      renderHeader: () => <strong>{"NAMA"}</strong>,
      editable: true,
    },
    {
      field: "userEmail",
      renderHeader: () => <strong>{"EMAIL"}</strong>,
      flex: 1,
      editable: true,
    },
    {
      field: "userDeviceId",
      renderHeader: () => <strong>{"DEVICE ID"}</strong>,
      flex: 1,
      editable: true,
    },
    {
      field: "userContact",
      renderHeader: () => <strong>{"CONTACT"}</strong>,
      flex: 1,
      editable: true,
    },
    {
      field: "createdAt",
      renderHeader: () => <strong>{"CREATED AT"}</strong>,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      renderHeader: () => <strong>{"ACTION"}</strong>,
      flex: 1,
      cellClassName: "actions",
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => navigation("/spg/edit/" + row.spgId)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon color="error" />}
            label="Delete"
            onClick={() => handleOpenModalDelete(row)}
            color="inherit"
          />,
          // <GridActionsCellItem
          //   icon={<MoreOutlined color="info" />}
          //   label="Detail"
          //   onClick={() => navigation("/admins/detail/" + row.id)}
          //   color="inherit"
          // />,
        ];
      },
    },
  ];

  function CustomToolbar() {
    const [search, setSearch] = useState<string>("");
    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between", mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <GridToolbarExport />
          {/* <Button
            startIcon={<Add />}
            variant="outlined"
            onClick={() => navigation("/spg/create")}
          >
            Tambah SPG
          </Button> */}
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
            label: "SPG",
            link: "/spg",
            icon: <IconMenus.admin fontSize="small" />,
          },
        ]}
      />
      <Box sx={{ width: "100%", "& .actions": { color: "text.secondary" } }}>
        <DataGrid
          rows={tableData}
          columns={columns}
          getRowId={(row: any) => row.spgId} 
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

      <ModalStyle
        openModal={openModalDelete}
        handleModalOnCancel={() => setOpenModalDelete(false)}
        message={
          "Apakah Anda yakin ingin menghapus " + modalDeleteData?.userName + "?"
        }
        handleModal={() => {
          if (modalDeleteData?.userId) handleDeleteSpg(modalDeleteData.userId);
          setOpenModalDelete(!openModalDelete);
        }}
      />
    </Box>
  );
}
