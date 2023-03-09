import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  FormControl,
  Pagination,
  Stack,
  TextareaAutosize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { dateTimeConverter } from "../../../../utils/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-hot-toast";
import {
  deleteReviewChildren,
  deleteReviewData,
  getReviewBySong,
  updateReviewStatus,
} from "../../../../services/review";

const REVIEW_IN_PAGE = 12;

export default function SongReviewDrawer(props) {
  const [productReview, setProductReview] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const { visible, initData, onClose } = props;

  const getAllReview = async (page) => {
    try {
      const reviewRes = await getReviewBySong({
        songId: initData?._id,
        limit: REVIEW_IN_PAGE,
        page: page - 1,
      });

      if (reviewRes.data && reviewRes.data.success) {
        setProductReview(reviewRes.data.payload.review);
        const allItem = reviewRes.data.payload.totalItem;
        const total_page = Math.ceil(Number(allItem) / REVIEW_IN_PAGE);
        setTotalPage(total_page);
        setCurrentPage(page);
      }
    } catch (error) {
      console.log("get review Error: ", error);
    }
  };

  useEffect(() => {
    getAllReview(1);
  }, []);

  return (
    <React.Fragment key="right">
      <Drawer anchor="right" open={visible} onClose={() => onClose()}>
        <Box sx={{ width: "70vw", minWidth: "300px", paddingTop: "80px" }}>
          <Stack justifyContent={"end"}>
            <Box>
              <Button onClick={() => onClose()}>
                <CloseIcon />
              </Button>
            </Box>
          </Stack>
          <Divider />
          {
            <div>
              {productReview?.length ? (
                productReview?.map((reviewItem, reviewIndex) => {
                  return (
                    <div key={`product-review-item-${reviewIndex}`}>
                      <div
                        className="row"
                        style={{
                          paddingLeft: "20px",
                          paddingRight: "20px",
                          boxSizing: "border-box",
                          marginTop: "50px",
                          marginLeft: 0,
                          marginRight: 0,
                        }}
                      >
                        <div className="col-sm-8 col-md-8">
                          <Stack
                            justifyContent={"start"}
                            flexDirection={"row"}
                            alignItems={"center"}
                            sx={{ marginBottom: "10px" }}
                          >
                            <div>
                              <h6
                                style={{
                                  padding: "10px",
                                  margin: 0,
                                  background: "gray",
                                  color: "white",
                                  fontWeight: "800",
                                }}
                              >
                                {reviewItem?.user_email?.charAt(0)?.toUpperCase()}
                              </h6>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <h6
                                style={{
                                  marginLeft: "10px",
                                  fontSize: "1.2em",
                                  fontWeight: "800",
                                  marginBottom: 0,
                                }}
                              >
                                {reviewItem?.user_email}
                              </h6>
                              <div style={{ marginLeft: "15px" }}>
                                <div
                                  onClick={async () => {
                                    const deleteRes = await deleteReviewData(
                                      reviewItem?._id
                                    );
                                    if (deleteRes?.data?.success) {
                                      getAllReview(currentPage);
                                      return toast.success(
                                        "Xoá bình luận thành công"
                                      );
                                    }
                                    return toast.error(
                                      "Xoá bình luận thất bại"
                                    );
                                  }}
                                >
                                  <DeleteIcon
                                    sx={{ color: "red", cursor: "pointer" }}
                                  />
                                </div>
                              </div>
                              <div
                                style={{ marginLeft: "15px" }}
                                onClick={async () => {
                                  const updateRes = await updateReviewStatus(
                                    reviewItem?._id,
                                    reviewItem?.status === 0 ? 1 : 0
                                  );
                                  if (updateRes?.data?.success) {
                                    getAllReview(currentPage);
                                    return toast.success(
                                      "Cập nhật trạng thái bình luận thành công"
                                    );
                                  }
                                  return toast.error(
                                    "Cập nhật trạng thái bình luận thất bại"
                                  );
                                }}
                              >
                                {reviewItem?.status === 1 ? (
                                  <VisibilityIcon
                                    sx={{ color: "green", cursor: "pointer" }}
                                  />
                                ) : (
                                  <VisibilityOffIcon
                                    sx={{ color: "green", cursor: "pointer" }}
                                  />
                                )}
                              </div>
                            </div>
                          </Stack>
                          <p style={{ marginBottom: 0, fontSize: "0.8em" }}>
                            Ngày review:{" "}
                            {reviewItem.created_day &&
                              dateTimeConverter(reviewItem?.created_day)}
                          </p>
                          <FormControl fullWidth>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={3}
                              value={reviewItem?.review && reviewItem?.review}
                              disabled={true}
                              style={{ resize: "none", padding: '5px' }}
                            />
                          </FormControl>

                          {reviewItem?.children_review?.length ? (
                            reviewItem?.children_review?.map(
                              (childrenReviewItem, childrenReviewIndex) => {
                                return (
                                  <div
                                    key={`children-review-item-${childrenReviewIndex}`}
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      marginTop: "12px",
                                      width: "100%",
                                    }}
                                  >
                                    <div style={{ width: "90%" }}>
                                      <Stack
                                        justifyContent={"start"}
                                        flexDirection={"row"}
                                        alignItems={"center"}
                                        sx={{ marginBottom: "10px" }}
                                      >
                                        <div>
                                          <h6
                                            style={{
                                              padding: "2px 5px",
                                              margin: 0,
                                              background: "gray",
                                              color: "white",
                                              fontWeight: "600",
                                              fontSize: "14px",
                                            }}
                                          >
                                            {childrenReviewItem?.user_email
                                                  ?.charAt(0)
                                                  ?.toUpperCase()}
                                          </h6>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                          }}
                                        >
                                          <h6
                                            style={{
                                              marginLeft: "10px",
                                              fontSize: "14px",
                                              fontWeight: "600",
                                              marginBottom: 0,
                                            }}
                                          >
                                            {childrenReviewItem?.user_email}
                                          </h6>
                                          <div style={{ marginLeft: "15px" }}>
                                            <div
                                              onClick={async () => {
                                                const deleteRes =
                                                  await deleteReviewChildren(
                                                    childrenReviewItem?._id
                                                  );

                                                if (deleteRes?.data?.success) {
                                                  getAllReview(currentPage);
                                                  return toast.success(
                                                    "Xoá phản hồi bình luận thành công"
                                                  );
                                                }
                                                return toast.error(
                                                  "Xoá phản hồi bình luận thất bại"
                                                );
                                              }}
                                            >
                                              <DeleteIcon
                                                sx={{
                                                  color: "red",
                                                  cursor: "pointer",
                                                  fontSize: "16px",
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </Stack>
                                      <p
                                        style={{
                                          marginBottom: 0,
                                          fontSize: "0.8em",
                                        }}
                                      >
                                        Ngày review:{" "}
                                        {childrenReviewItem.created_day &&
                                          dateTimeConverter(
                                            childrenReviewItem?.created_day
                                          )}
                                      </p>
                                      <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={2}
                                        value={childrenReviewItem?.review}
                                        style={{
                                          resize: "none",
                                          width: "100%",
                                          padding: '5px'
                                        }}
                                        disabled={true}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", marginTop: "100px" }}>
                  Hiện chưa có đánh giá sản phẩm
                </div>
              )}
              {productReview?.length ? (
                <div
                  className="row"
                  style={{
                    marginTop: "50px",
                    marginLeft: 0,
                    marginRight: 0,
                    justifyContent: "end",
                  }}
                >
                  <div className="col-sm-2 col-md-1"></div>
                  <div className="col-sm-8 col-md-6">
                    <div
                      className="row"
                      style={{
                        justifyContent: "center",
                        marginLeft: 0,
                        marginRight: 0,
                        marginBottom: '30px'
                      }}
                    >
                      <Stack
                        spacing={2}
                        flexDirection={"row"}
                        justifyContent={"center"}
                      >
                        <Pagination
                          count={totalPage}
                          color="secondary"
                          defaultPage={1}
                          page={currentPage}
                          onChange={(event, value) => {
                            getAllReview(value);
                          }}
                        />
                      </Stack>
                    </div>
                  </div>
                  <div className="col-sm-2 col-md-3"></div>
                </div>
              ) : (
                <></>
              )}
            </div>
          }
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
