import { NotificationContext } from "@/App";
import FillSpace from "@/lib/components/common/FillSpace/index";
import useConfirmDialogStore from "@/lib/store/useConfirmDialogStore";
import useLongTextDialogStore from "@/lib/store/useLongTextStore";
import { Button, Flex, Modal, Space, Typography } from "antd";
import { useContext } from "react";

export default function AppLongTextDialog() {
  const s = useLongTextDialogStore();

  const { api } = useContext(NotificationContext);

  if (!s.isShown) {
    return null;
  }
  return (
    <Modal
      title={s.title}
      open={s.isShown}
      onCancel={() => {
        s.close();
      }}
      footer={
        <Flex justify="space-between">
          <Button
            key="back"
            onClick={async () => {
              if (navigator.clipboard) {
                await navigator.clipboard.writeText(s.text);
                api?.info({ message: "Copied" });
              }
            }}
          >
            Copy
          </Button>
          <Button key="submit" type="primary" onClick={() => s.close()}>
            Close
          </Button>
        </Flex>
      }
    >
      <Typography>
        <Typography.Paragraph>{s.text}</Typography.Paragraph>
      </Typography>
    </Modal>
  );
}
