import { IRootModel } from "./rootModel";

export interface IAttendanceModel extends IRootModel {
  scheduleId: number;
  scheduleName: string;
  scheduleDescription: string;
  scheduleStoreId: number;
  scheduleUserId: number;
  scheduleStartDate: string;
  scheduleEndDate: string;
  scheduleStatus: "waiting" | "checkin" | "checkout";
}
