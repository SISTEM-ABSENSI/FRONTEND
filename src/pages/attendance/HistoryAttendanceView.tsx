import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Store as StoreIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useHttp } from "../../hooks/http";
import { green, grey, blue } from "@mui/material/colors";

interface IAttendance {
  scheduleId: number;
  scheduleName: string;
  scheduleEndDate: string;
  scheduleStatus: string;
  store: {
    storeName: string;
    storeAddress: string;
  };
}

export default function HistoryAttendanceView() {
  const [attendances, setAttendances] = useState<IAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { handleGetTableDataRequest } = useHttp();

  const getAttendances = async () => {
    setLoading(true);
    try {
      const result = await handleGetTableDataRequest({
        path: "/schedules",
        page: 0,
        size: 50,
        filter: {
          search: search || "",
          scheduleStatus: "checkout", // Only show completed attendances
        },
      });

      if (result && Array.isArray(result?.items)) {
        setAttendances(result.items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendances();
  }, []);

  const handleSearch = () => {
    getAttendances();
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header with Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Attendance History</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search clinic or schedule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSearch}
                      sx={{ minWidth: 100 }}
                    >
                      Search
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Attendance History List */}
      <Card>
        <List>
          {loading ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <CircularProgress />
            </Box>
          ) : attendances.length > 0 ? (
            attendances.map((attendance, index) => (
              <Box key={attendance.scheduleId}>
                <ListItem
                  sx={{
                    py: 2,
                    "&:hover": {
                      bgcolor: grey[50],
                    },
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: blue[50] }}>
                      <StoreIcon sx={{ color: blue[500] }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {attendance.store.storeName}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={1} mt={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {attendance.scheduleName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(
                            attendance.scheduleEndDate
                          ).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {attendance.store.storeAddress}
                        </Typography>
                      </Stack>
                    }
                  />
                  <Stack alignItems="center" spacing={1}>
                    <CheckCircleIcon sx={{ color: green[500] }} />
                    <Chip
                      label="COMPLETED"
                      size="small"
                      sx={{
                        color: green[500],
                        bgcolor: green[50],
                      }}
                    />
                  </Stack>
                </ListItem>
                {index < attendances.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                No attendance history found
              </Typography>
            </Box>
          )}
        </List>
      </Card>
    </Box>
  );
}
