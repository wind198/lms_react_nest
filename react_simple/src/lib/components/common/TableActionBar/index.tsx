import { NotificationContext } from "@/App";
import FillSpace from "@/lib/components/common/FillSpace/index";
import useApiHttpClient from "@/lib/hooks/useHttpClient";
import useConfirmDialogStore from "@/lib/store/useConfirmDialogStore";
import { IHasResource, IStringOrNumber } from "@/lib/types/common.type";
import { deleteManyUrl } from "@/lib/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, notification } from "antd";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";

type IProps = IHasResource & {
  selectKeys: IStringOrNumber[];
};
export default function TableActionBar(props: IProps) {
  const { resource, selectKeys, resourcePlural = resource + "s" } = props;

  const { $delete } = useApiHttpClient();

  const sendDeleteRequest = useCallback(async () => {
    const { data } = await $delete(deleteManyUrl(resourcePlural), {
      params: { ids: selectKeys.join(",") },
    });
    return data;
  }, [$delete, resourcePlural, selectKeys]);

  const queryClient = useQueryClient();

  const { api } = useContext(NotificationContext);

  const { t } = useTranslation();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: sendDeleteRequest,
    async onSettled(data, error, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [resourcePlural] });
      if (!error) {
        api?.success({ message: t("message.success.delete") });
      }
    },
  });

  const { open } = useConfirmDialogStore();

  const handleDelete = useCallback(() => {
    open({
      message: (
        <>
          Are you sure to delete{" "}
          <strong>
            {selectKeys.length} {resourcePlural}
          </strong>
        </>
      ),
      title: `Delete ${resourcePlural}`,
      onConfirm: mutateAsync,
    });
  }, [mutateAsync, open, resourcePlural, selectKeys.length]);

  if (!selectKeys.length) {
    return null;
  }
  return (
    <Flex>
      <span>
        {selectKeys.length} {resourcePlural} selected
      </span>
      <FillSpace />
      {/* <Button type="primary" onClick={() => handleExport()}>
            Export
          </Button> */}
      <Button type="primary" loading={isPending} onClick={() => handleDelete()}>
        {t("actions.delete")}
      </Button>
    </Flex>
  );
}
