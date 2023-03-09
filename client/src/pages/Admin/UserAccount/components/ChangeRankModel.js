import { Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomModal from "../../../../components/CustomModal";
import LoadingButton from "@mui/lab/LoadingButton";
import { COPPER_RANK, RANK_ENUM, RANK_LIST } from "../../../../utils/constants";
import { toast } from "react-hot-toast";
import { changeUserRank } from "../../../../services/user";

export default function ChangeRankModal(props) {
  const [currentRank, setCurrentRank] = useState(() => {
    if (!props?.user?.rank) return COPPER_RANK;
    return props?.user?.rank;
  });

  useEffect(() => {
    if (!props?.user?.rank) setCurrentRank(COPPER_RANK);
    else {
      setCurrentRank(props?.user?.rank);
    }
  }, [props?.user]);

  const handleChangeRank = async () => {
    try {
      const changeRes = await changeUserRank(props?.user?._id, currentRank);
      if (changeRes?.data?.success) {
        toast.success("Thay đổi hạng thành công");
        props.onClose();
        return props.handleChangeRank(props?.user?._id, currentRank);
      }
      return toast.error(changeRes?.data?.error || "Thay đổi hạng thất bại");
    } catch (error) {
      toast.error(error?.data?.error || "Thay đổi hạng thất bại");
    }
  };

  return (
    <CustomModal
      onClose={props.onClose}
      visible={props.visible}
      title={"Thay đổi hạng thất bại"}
      content={
        <div style={{minWidth: '300px'}}>
          <div style={{textAlign: 'center'}}>Chi tiết hạng thành viên</div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              gap: "15px",
            }}
          >
            {RANK_LIST?.map((item) => {
              return (
                <div
                  key={item}
                  onClick={() => {
                    if (item !== currentRank) setCurrentRank(item);
                  }}
                >
                  <Chip
                    sx={{ cursor: "pointer" }}
                    label={RANK_ENUM[item]}
                    color="primary"
                    variant={currentRank === item ? "filled" : "outlined"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      }
      action={
        <div>
          <LoadingButton
            autoFocus
            variant="text"
            color="error"
            onClick={() => props.onClose()}
          >
            Huỷ
          </LoadingButton>
          <LoadingButton
            autoFocus
            variant="text"
            onClick={() => handleChangeRank()}
          >
            Xác nhận
          </LoadingButton>
        </div>
      }
    />
  );
}
