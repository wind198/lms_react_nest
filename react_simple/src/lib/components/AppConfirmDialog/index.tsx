import useConfirmDialogStore from "@/lib/store/useConfirmDialogStore";
import { Modal, Typography } from "antd";

export default function AppConfirmDialog() {
  const s = useConfirmDialogStore();

  if (!s.isShown) {
    return null;
  }
  return (
    <Modal
      title={s.title}
      open={s.isShown}
      onOk={async () => {
        await s.onConfirm();
        s.close();
      }}
      onCancel={() => {
        s.close();
      }}
    >
      <Typography>
        <Typography.Paragraph>{s.message}</Typography.Paragraph>
      </Typography>
    </Modal>
  );
}
