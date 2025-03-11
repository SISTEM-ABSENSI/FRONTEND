import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { useAppContext } from "../../context/app.context";
import moment from "moment";

interface IStore {
  storeId: number;
  storeName: string;
}

interface IScheduleCreate {
  scheduleName: string;
  scheduleDescription: string;
  scheduleStoreId: number;
  scheduleStartDate: string;
  scheduleEndDate: string;
  scheduleStatus: string;
}

export default function CreateScheduleView() {
  const navigate = useNavigate();
  const { handleGetRequest, handlePostRequest } = useHttp();
  const { setAppAlert } = useAppContext();
  const [stores, setStores] = useState<IStore[]>([]);
  const [schedule, setSchedule] = useState<IScheduleCreate>({
    scheduleName: "",
    scheduleDescription: "",
    scheduleStoreId: 0,
    scheduleStartDate: "",
    scheduleEndDate: "",
    scheduleStatus: "waiting",
  });
  const [errors, setErrors] = useState({
    scheduleName: "",
    scheduleStoreId: "",
    scheduleStartDate: "",
    scheduleEndDate: "",
  });
  const [pageLoading, setPageLoading] = useState(true);

  const getStores = async () => {
    try {
      setPageLoading(true);
      const result = await handleGetRequest({
        path: "/stores",
      });
      if (result && Array.isArray(result?.items)) {
        setStores(result.items);
      }
    } catch (error) {
      console.error(error);
      setAppAlert({
        isDisplayAlert: true,
        message: "Failed to fetch stores",
        alertType: "error",
      });
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getStores();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      scheduleName: "",
      scheduleStoreId: "",
      scheduleStartDate: "",
      scheduleEndDate: "",
    };

    if (!schedule.scheduleName.trim()) {
      newErrors.scheduleName = "Schedule name is required";
      isValid = false;
    }

    if (!schedule.scheduleStoreId) {
      newErrors.scheduleStoreId = "Store selection is required";
      isValid = false;
    }

    if (!schedule.scheduleStartDate) {
      newErrors.scheduleStartDate = "Start date and time are required";
      isValid = false;
    }

    if (!schedule.scheduleEndDate) {
      newErrors.scheduleEndDate = "End date and time are required";
      isValid = false;
    }

    if (moment(schedule.scheduleStartDate).isAfter(schedule.scheduleEndDate)) {
      newErrors.scheduleStartDate = "Start date cannot be after end date";
      isValid = false;
    }

    if (moment(schedule.scheduleEndDate).isBefore(moment())) {
      newErrors.scheduleEndDate = "End date must be in the future";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleDateTimeChange = (type: "start" | "end", value: string) => {
    const [date, time] = value.split("T");
    if (type === "start") {
      setSchedule({
        ...schedule,
        scheduleStartDate: moment(`${date} ${time}`).format("YYYY-MM-DD HH:mm"),
      });
    } else {
      setSchedule({
        ...schedule,
        scheduleEndDate: moment(`${date} ${time}`).format("YYYY-MM-DD HH:mm"),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await handlePostRequest({
        path: "/schedules",
        body: schedule,
      });
      setAppAlert({
        isDisplayAlert: true,
        message: "Schedule created successfully",
        alertType: "success",
      });
      navigate("/schedules");
    } catch (error) {
      console.error(error);
      setAppAlert({
        isDisplayAlert: true,
        message: "Failed to create schedule",
        alertType: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: "md", margin: "0 auto" }}>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
        open={pageLoading}
      >
        <CircularProgress color="primary" />
      </Backdrop>

      <Box>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h6">Create New Schedule</Typography>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Schedule Name"
                    value={schedule.scheduleName}
                    onChange={(e) =>
                      setSchedule({ ...schedule, scheduleName: e.target.value })
                    }
                    error={!!errors.scheduleName}
                    helperText={errors.scheduleName}
                  />

                  <FormControl error={!!errors.scheduleStoreId}>
                    <InputLabel>Stores</InputLabel>
                    <Select
                      value={schedule.scheduleStoreId || ""}
                      label="Stores"
                      onChange={(e) =>
                        setSchedule({
                          ...schedule,
                          scheduleStoreId: Number(e.target.value),
                        })
                      }
                    >
                      {stores.map((store) => (
                        <MenuItem key={store.storeId} value={store.storeId}>
                          {store.storeName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.scheduleStoreId && (
                      <FormHelperText>{errors.scheduleStoreId}</FormHelperText>
                    )}
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={schedule.scheduleDescription}
                    onChange={(e) =>
                      setSchedule({
                        ...schedule,
                        scheduleDescription: e.target.value,
                      })
                    }
                  />

                  <TextField
                    fullWidth
                    label="Start Date & Time"
                    type="datetime-local"
                    value={
                      schedule.scheduleStartDate
                        ? moment(schedule.scheduleStartDate).format(
                            "YYYY-MM-DDTHH:mm"
                          )
                        : ""
                    }
                    onChange={(e) =>
                      handleDateTimeChange("start", e.target.value)
                    }
                    error={!!errors.scheduleStartDate}
                    helperText={errors.scheduleStartDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="End Date & Time"
                    type="datetime-local"
                    value={
                      schedule.scheduleEndDate
                        ? moment(schedule.scheduleEndDate).format(
                            "YYYY-MM-DDTHH:mm"
                          )
                        : ""
                    }
                    onChange={(e) =>
                      handleDateTimeChange("end", e.target.value)
                    }
                    error={!!errors.scheduleEndDate}
                    helperText={errors.scheduleEndDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/schedules")}
                      fullWidth
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" fullWidth>
                      Create Schedule
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
