import useLongTextDialogStore from "@/lib/store/useLongTextStore";
import { Button } from "antd";
import React, { useMemo } from "react";

type IProps = {
  text: string;
  limit?: number;
  title: string;
};
export default function LongTextWithElipsis(props: IProps) {
  const { open } = useLongTextDialogStore();

  const { text, title, limit = 50 } = props;

  const textToRender = useMemo(
    () => text?.slice(0, limit ?? 50),
    [limit, text]
  );

  const showButton = text?.length > limit;

  return (
    <div className="long-text-with-elipsis">
      {textToRender}
      {showButton && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            open({ title, text });
          }}
          type="text"
          size="small"
        >
          ...
        </Button>
      )}
    </div>
  );
}
