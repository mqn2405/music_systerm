import LoadingButton from "@mui/lab/LoadingButton";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../../../components/CustomModal";
import RTextField from "../../../../components/RedditTextField";
import {
  deleteUserFollow,
  getUserFollow,
} from "../../../../services/user-follow";
import { createNewReportUser } from "../../../../services/userReport";
import { USER_KEY } from "../../../../utils/constants";
import { parseJSON } from "../../../../utils/utils";

const PAGE_LIMIT = 20;

export default function FlowList() {
  const [followerList, setFollowerList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const userData = parseJSON(localStorage.getItem(USER_KEY));
  const navigate = useNavigate();
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleReportModal, setVisibleReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [handleUser, setHandleUser] = useState(-1);

  const getUserFollower = async () => {
    try {
      if (userData?._id) {
        const result = await getUserFollow(PAGE_LIMIT, page, userData?._id);
        if (result?.data?.success) {
          setFollowerList(result?.data?.payload?.follower);
          setTotalPage(
            Math.ceil(result?.data?.payload?.totalItem / PAGE_LIMIT)
          );
        }
      }
    } catch (error) {
      console.log("get user follower error >>> ", error);
    }
  };

  useEffect(() => {
    getUserFollower();
  }, [page]);

  const handleDeleteUserFollower = async () => {
    try {
      const result = await deleteUserFollow(userData?._id, handleUser);
      if (result?.data?.success) {
        getUserFollower();
        setVisibleConfirmModal(false);
        return toast.success("Xử lí tác vụ thành công");
      }
      return toast.error("Xử lí tác vụ thất bại");
    } catch (error) {
      return toast.error("Xử lí yêu cầu thất bại");
    }
  };

  const handleCreateUserReport = async () => {
    try {
      if (!reportReason?.trim()?.length) {
        return toast.error("Lí do báo cáo không thể bỏ trống");
      }

      const result = await createNewReportUser(
        userData?._id,
        handleUser,
        reportReason
      );
      if (result?.data?.success) {
        toast.success(
          "Báo cáo tài khoản thành công, đang đợi quản trị viên duyệt"
        );
        setVisibleReportModal(false);
        return setReportReason("");
      }
      toast.error("Báo cáo tài khoản thất bại");
    } catch (error) {
      toast.error("Báo cáo tài khoản thất bại");
    }
  };

  return (
    <div className="follow-tab">
      {visibleConfirmModal && (
        <CustomModal
          visible={visibleConfirmModal}
          onClose={() => {
            setVisibleConfirmModal(false);
          }}
          title={"Xác nhận"}
          content={
            <div style={{ minWidth: "400px", textAlign: "center" }}>
              Xác nhận thực hiện tác vụ
            </div>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={() => {
                handleDeleteUserFollower();
              }}
            >
              {"Xác nhận"}
            </LoadingButton>
          }
        />
      )}

      {visibleReportModal && (
        <CustomModal
          visible={visibleReportModal}
          onClose={() => {
            setReportReason("");
            setVisibleReportModal(false);
          }}
          title={"Báo cáo tài khoản"}
          content={
            <div>
              <RTextField
                label="Lí do"
                value={reportReason || ""}
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) => setReportReason(event?.target?.value)}
              />
            </div>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={() => {
                handleCreateUserReport();
              }}
            >
              {"Báo cáo"}
            </LoadingButton>
          }
        />
      )}

      <div className="personal-follow">
        {followerList?.map((item, index) => {
          return (
            <div
              key={`personal-follow-item-${index}`}
              className="personal-follow-item"
            >
              <div className="member-info">
                <div
                  className="member-avatar"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/member/${item?.followed}`)}
                >
                  {item?.follower_email?.[0]}
                </div>
                <div
                  className="member-email"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/member/${item?.followed}`)}
                >
                  {item?.follower_email}
                </div>
              </div>
              <div className="member-control">
                <div>
                  <button
                    onClick={() => {
                      setHandleUser(item?.followed);
                      setVisibleConfirmModal(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Huỷ theo dõi
                  </button>
                </div>
                <div>
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setHandleUser(item?.followed);
                      setVisibleReportModal(true);
                    }}
                  >
                    Báo cáo
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPage > 1 ? (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  className="load-more-btn text-center"
                  onClick={() => {
                    if (page > 0) {
                      setPage(page - 1);
                    }
                  }}
                >
                  <a className="btn oneMusic-btn">Trước</a>
                </div>
                <div className="load-more-btn text-center">
                  <a
                    className="btn oneMusic-btn"
                    style={{
                      padding: 0,
                      minWidth: "100px",
                      width: "100px",
                    }}
                  >
                    {page + 1} / {totalPage}
                  </a>
                </div>

                <div
                  className="load-more-btn text-center"
                  onClick={() => {
                    if (page + 1 < totalPage) {
                      setPage(page + 1);
                    }
                  }}
                >
                  <a className="btn oneMusic-btn">Sau</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
