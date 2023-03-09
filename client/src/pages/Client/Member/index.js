import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUserAccount } from "../../../services/user";
import {
  createUserFollow,
  deleteUserFollow,
  getUserFollow,
} from "../../../services/user-follow";
import { USER_KEY } from "../../../utils/constants";
import { parseJSON } from "../../../utils/utils";
import "./style.scss";
import { toast } from "react-hot-toast";
import CustomModal from "../../../components/CustomModal";
import LoadingButton from "@mui/lab/LoadingButton";

const PAGE_LIMIT = 30;
const COLOR_LIST = ["#03001C", "#301E67", "#1C82AD", "#5B8FB9"];

const checkUserIdInList = (userId, list) => {
  const findIndex = list?.find(
    (item) => Number(item?.followed) === Number(userId)
  );
  return findIndex?.user_id ? true : false;
};

export default function Member() {
  const [accountList, setAccountList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [userFollower, setUsetFollower] = useState([]);
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [follower, setFollower] = useState(-1);
  const navigate = useNavigate();
  const userData = parseJSON(localStorage.getItem(USER_KEY), {});

  const getUserFollower = async () => {
    try {
      if (userData?._id) {
        const result = await getUserFollow(undefined, undefined, userData?._id);
        if (result?.data?.success) {
          setUsetFollower(result?.data?.payload?.follower);
        }
      }
    } catch (error) {
      console.log("get user follower error >>> ", error);
    }
  };

  useEffect(() => {
    getUserFollower();
  }, []);

  const getAccountList = async () => {
    try {
      const result = await getAllUserAccount(PAGE_LIMIT, page, userData?._id);
      if (result?.data?.success) {
        setAccountList(result?.data?.payload?.user);
        setTotalPage(Math.ceil(result?.data?.payload?.totalItem / PAGE_LIMIT));
      }
    } catch (error) {
      console.log("get album error >>> ", error);
    }
  };

  useEffect(() => {
    getAccountList();
  }, [page]);

  const handleUserFollower = async () => {
    try {
      const check = checkUserIdInList(follower, userFollower);
      let result = false;
      if (check) {
        result = await deleteUserFollow(userData?._id, follower);
      } else {
        result = await createUserFollow(userData?._id, follower);
      }

      if (result?.data?.success) {
        setVisibleConfirmModal(false);
        getUserFollower();
        return toast.success("Xử lí tác vụ thành công");
      }
      return toast.error("Xử lí tác vụ thất bại");
    } catch (error) {
      return toast.error("Xử lí yêu cầu thất bại");
    }
  };

  return (
    <div style={{ marginBottom: "100px" }}>
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
                handleUserFollower();
              }}
            >
              {"Xác nhận"}
            </LoadingButton>
          }
        />
      )}

      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(img/bg-img/breadcumb3.jpg)" }}
      >
        <div className="bradcumbContent">
          <h2>Trang thành viên</h2>
        </div>
      </section>

      <div className="account-list">
        <div className="account-title">Thành viên mới</div>
        <div className="user-list">
          {accountList?.map((item, index) => {
            return (
              <div key={`member-item-${index}`} className="user-item">
                <div
                  className="user-image"
                  style={{ background: COLOR_LIST[index % 4] }}
                  onClick={() => navigate(`/member/${item?._id}`)}
                >
                  {item?.email?.[0]}
                </div>
                <div
                  className="user-name"
                  onClick={() => navigate(`/member/${item?._id}`)}
                >
                  {item?.email}
                </div>
                <div className="follow-btn">
                  <button
                    onClick={() => {
                      if (userData?._id) {
                        setFollower(item?._id);
                        setVisibleConfirmModal(true);
                      } else {
                        return toast.error(
                          "Bạn cần đăng nhập để thực hiện chức năng này"
                        );
                      }
                    }}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {checkUserIdInList(item?._id, userFollower)
                      ? "Huỷ theo dõi"
                      : " Theo dõi"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {totalPage > 1 ? (
        <div className="container" style={{ marginTop: "40px" }}>
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
                  <a className="btn oneMusic-btn">Sau</a>
                </div>
                <div className="load-more-btn text-center">
                  <a
                    className="btn oneMusic-btn"
                    style={{ padding: 0, minWidth: "100px", width: "100px" }}
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
                  <a className="btn oneMusic-btn">Trước</a>
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
