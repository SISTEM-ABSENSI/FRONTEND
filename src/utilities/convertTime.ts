import moment from "moment";

export const convertTime = (time: string) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};

export const formatISOToString = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace("T", " ");
};
