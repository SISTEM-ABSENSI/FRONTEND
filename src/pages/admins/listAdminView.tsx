/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  GridRowsProp,
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
import { IUserModel } from "../../models/userModel";

export default function ListAdminView() {
  const [tableData, setTableData] = useState<GridRowsProp[]>([]);
  const { handleGetTableDataRequest, handleRemoveRequest } = useHttp();
  const navigation = useNavigate();

  const [modalDeleteData, setModalDeleteData] = useState<IUserModel>();
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 1,
  });

  const getTableData = async ({ search }: { search: string }) => {
    console.log(paginationModel);
    try {
      setLoading(true);
      const result = await handleGetTableDataRequest({
        path: "/users",
        page: paginationModel.page + 1,
        size: paginationModel.pageSize,
        filter: { search },
      });

      console.log(result);
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

  const handleDeleteAdmin = async (userId: string) => {
    await handleRemoveRequest({
      path: `/users/${userId}`,
    });
    window.location.reload();
  };

  const handleOpenModalDelete = (data: IUserModel) => {
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
      field: "userRole",
      renderHeader: () => <strong>{"Role"}</strong>,
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: ["admin", "superAdmin"],
    },
    {
      field: "userEmail",
      renderHeader: () => <strong>{"Email"}</strong>,
      flex: 1,
      editable: true,
      type: "singleSelect",
    },
    {
      field: "created_at",
      renderHeader: () => <strong>{"DIBUAT PADA"}</strong>,
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
            onClick={() => navigation("/admins/edit/" + row.id)}
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
          <Button
            startIcon={<Add />}
            variant="outlined"
            onClick={() => navigation("/admins/create")}
          >
            Tambah Admin
          </Button>
        </Stack>
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <TextField
            size="small"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outlined" onClick={() => getTableData({ search })}>
            Search
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
            label: "Admin",
            link: "/admins",
            icon: <IconMenus.admin fontSize="small" />,
          },
        ]}
      />
      <Box
        sx={{
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={tableData}
          columns={columns}
          editMode="row"
          sx={{ padding: 2 }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 1 } },
          }}
          autoHeight
          pageSizeOptions={[2, 5, 10, 25]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{
            toolbar: CustomToolbar,
          }}
          rowCount={rowCount}
          paginationMode="server"
          loading={loading}
        />
      </Box>

      <ModalStyle
        openModal={openModalDelete}
        handleModalOnCancel={() => setOpenModalDelete(false)}
        message={
          "Apakah anda yakin ingin menghapus " + modalDeleteData?.userName
        }
        handleModal={() => {
          handleDeleteAdmin(modalDeleteData?.id + "" ?? "");
          setOpenModalDelete(!openModalDelete);
        }}
      />
    </Box>
  );
}
