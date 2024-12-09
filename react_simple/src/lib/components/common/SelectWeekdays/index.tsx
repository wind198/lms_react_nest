import { IMultiple } from "@/lib/types/common.type";
import { DefaultOptionType } from "antd/es/select/index";
import { Select, SelectProps } from "antd";

const daysOfWeek = [
  { value: [1, 5].join(","), label: "Monday → Friday" },
  { value: [1, 6].join(","), label: "Monday → Saturday" },
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
] as DefaultOptionType[];

export type ISelectWeekdaysProps = SelectProps;

export default function SelectWeekdays(props: ISelectWeekdaysProps) {
  const { style, ...o } = props;

  return (
    <Select
      options={daysOfWeek}
      placeholder="Select weekdays"
      style={{ width: "100%", ...style }}
      {...o}
    />
  );
}
