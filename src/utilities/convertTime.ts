import moment from "moment";

export const convertTime = (time: string) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};
