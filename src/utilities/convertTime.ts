import moment from "moment";

export const convertTime = (time: string) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};

export const formatISOToString = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
  });
};

// Fungsi untuk mengonversi waktu lokal ke UTC
export const convertLocalToUTC = (localDateTime: string): string => {
  const [date, time] = localDateTime.split("T");
  return moment(`${date} ${time}`, "YYYY-MM-DD HH:mm")
    .utc()
    .format("YYYY-MM-DD HH:mm");
};

// Fungsi untuk mengonversi waktu UTC (ISO 8601) ke lokal
export const convertUTCToLocal = (utcDateTime: string): string => {
  return moment.utc(utcDateTime).local().format("YYYY-MM-DDTHH:mm");
};
