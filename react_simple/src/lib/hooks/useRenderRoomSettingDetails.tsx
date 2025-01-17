import { IRoomSetting } from "@/lib/types/entities/room-setting.entity";
import { formatOpenTimes } from "@/lib/utils/helpers";
import { ClockCircleTwoTone } from "@ant-design/icons";
import { Descriptions, Flex, Typography } from "antd";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";

export type IShowDetailRoomSettingProps = {
  roomSetting?: IRoomSetting;
  hideDescriptiveFields?: boolean;
};
export default function useRenderRoomSettingDetails(
  props: IShowDetailRoomSettingProps
) {
  const { hideDescriptiveFields, roomSetting } = props;

  const roomSettingDetails = useMemo(() => {
    if (!roomSetting) {
      return [];
    }
    return [
      ...(!hideDescriptiveFields
        ? [
            <Descriptions.Item label="Title">
              {roomSetting.title}
            </Descriptions.Item>,
            <Descriptions.Item label="Description">
              {roomSetting.description}
            </Descriptions.Item>,
          ]
        : []),
      <Descriptions.Item label="Capacity">
        {roomSetting.capacity}
      </Descriptions.Item>,
      <Descriptions.Item label="Off dates">
        <Flex vertical>
          {roomSetting.dates_off?.map((date, index) => (
            <Typography.Text>
              {dayjs(date).format("DD-MMM")} (repeat)
            </Typography.Text>
          ))}
          {roomSetting.dates_off_once?.map((date, index) => (
            <Typography.Text>
              {dayjs(date).format("DD-MMM-YYYY")}
            </Typography.Text>
          ))}
        </Flex>
      </Descriptions.Item>,
      <Descriptions.Item label="Open times">
        <Flex vertical>
          {formatOpenTimes(roomSetting.room_open_times ?? [])?.map(
            ({ time, week_days_label }) => (
              <Typography.Text>
                {week_days_label}
                <ClockCircleTwoTone style={{ margin: "0 6px" }} />{" "}
                {time.join(", ")}
              </Typography.Text>
            )
          )}
        </Flex>
      </Descriptions.Item>,
    ];
  }, [hideDescriptiveFields, roomSetting]);

  return { roomSettingDetails };
}
