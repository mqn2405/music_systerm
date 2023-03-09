import React, { useState, useEffect } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { dateTimeConverter } from "../../../../utils/utils";
import { toast } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import { USER_KEY } from "../../../../utils/constants";
import {
  createChildrenReview,
  createUserReview,
  deleteReviewChildren,
  deleteReviewData,
  getReviewBySong,
  updateUserReview,
} from "../../../../services/review";

const REVIEW_IN_PAGE = 12;

export default function SongReview({ songId }) {
  const [addReviewData, setAddReviewData] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [reviewEditContent, setReviewEditContent] = useState("");
  const [reviewEditId, setReviewEditId] = useState(0);
  const [replyReviewId, setReplyReviewId] = useState(0);
  const [replyContent, setReplyContent] = useState("");

  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_KEY))
      : {};

  const createNewReview = async () => {
    try {
      if (!addReviewData?.trim()?.length) {
        return toast.error("Nội dung bình luận không được bỏ trống");
      }

      if (userData?._id) {
        const createReviewRes = await createUserReview({
          user_id: Number(userData?._id),
          review: addReviewData?.trim(),
          song_id: songId,
        });

        if (createReviewRes.data && createReviewRes.data.success) {
          toast.success("Gửi bình luận thành công");
          getAllReview(currentPage);
          setAddReviewData("");
        } else {
          toast.error("Gửi bình luận thất bại");
        }
      } else {
        toast.error("Đăng nhập để thực hiện chức năng này");
      }
    } catch (error) {
      console.log("create review error: ", error);
      toast.error("Gửi bình luận thất bại");
    }
  };

  const getAllReview = async (page) => {
    try {
      const reviewRes = await getReviewBySong({
        songId: songId,
        limit: REVIEW_IN_PAGE,
        page: page - 1,
      });

      if (reviewRes.data && reviewRes.data.success) {
        setReviewData(reviewRes.data.payload.review);
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

  const deleteProductReview = async (reviewId) => {
    const deleteRes = await deleteReviewData(reviewId);
    if (deleteRes?.data?.success) {
      getAllReview(currentPage);
      return toast.success("Xoá bình luận thành công");
    }
    return toast.error("Xoá bình luận thất bại");
  };

  const createReviewChildren = async () => {
    if (!userData?._id) {
      return toast?.error("Vui lòng đăng nhập để phản hồi bình luận");
    }

    if (!replyContent?.trim()?.length) {
      return toast.error("Nội dung bình luận không thể bỏ trống");
    }

    const createRes = await createChildrenReview({
      review_id: replyReviewId,
      user_id: userData?._id,
      review: replyContent,
    });

    if (createRes?.data?.success) {
      setReplyContent("");
      getAllReview(currentPage);
      return toast.success("Trả lời bình luân thành công");
    }
    return toast.error("Trả lời bình luận thất bại");
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h6
        style={{
          textAlign: "center",
          fontSize: "1.5em",
          fontWeight: 600,
        }}
      >
        Bình luận người dùng
      </h6>
      <div
        className="row"
        style={{
          paddingLeft: "20px",
          paddingRight: "20px",
          boxSizing: "border-box",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <div className="col-sm-2 col-md-3"></div>
        <div className="col-sm-8 col-md-6">
          <FormControl fullWidth>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={4}
              placeholder="Nhập đánh giá"
              value={addReviewData}
              onChange={(event) => setAddReviewData(event.target.value)}
              style={{ padding: "5px 10px" }}
            />

            <Stack
              sx={{ marginTop: "10px" }}
              justifyContent={"center"}
              flexDirection={"row"}
            >
              <Box>
                <Button
                  variant="contained"
                  onClick={() => createNewReview()}
                  sx={{ color: "white !important", background: "#252525" }}
                >
                  Gửi đánh giá
                </Button>
              </Box>
            </Stack>
          </FormControl>
        </div>
        <div className="col-sm-2 col-md-3"></div>
      </div>

      {reviewData.map((reviewItem, reviewIndex) => {
        return (
          <div key={`product-review-item-${reviewIndex}`}>
            {reviewItem?.status === 1 && (
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
                <div className="col-sm-8 col-md-6">
                  <Stack
                    justifyContent={"start"}
                    flexDirection={"row"}
                    alignItems={"center"}
                  >
                    <div>
                      <h6
                        style={{
                          padding: "5px 10px",
                          margin: 0,
                          background: "#252525",
                          color: "white",
                          fontWeight: "800",
                        }}
                      >
                        {reviewItem?.user_email?.charAt(0)?.toUpperCase()}
                      </h6>
                    </div>
                    <div>
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
                    </div>
                  </Stack>
                  <p
                    style={{ marginBottom: 0, fontSize: "16px", marginTop: 0 }}
                  >
                    Ngày review:{" "}
                    {reviewItem.created_day &&
                      dateTimeConverter(reviewItem?.created_day)}
                  </p>
                  <FormControl fullWidth>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={3}
                      value={
                        reviewItem?._id === reviewEditId
                          ? reviewEditContent
                          : (reviewItem?.review && reviewItem?.review) || ""
                      }
                      disabled={reviewItem?._id === reviewEditId ? false : true}
                      style={{ resize: "none", padding: "5px" }}
                      onChange={(event) => {
                        setReviewEditContent(event?.target?.value);
                      }}
                    />
                  </FormControl>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "5px",
                    }}
                  >
                    {Number(reviewItem?.user_id) === Number(userData?._id) ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <div
                          style={{
                            color: "red",

                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                          onClick={() => deleteProductReview(reviewItem?._id)}
                        >
                          Xoá
                        </div>
                        <div
                          style={{
                            color: "green",
                            cursor: "pointer",
                            fontSize: "14px",
                            marginLeft: "20px",
                          }}
                          onClick={async () => {
                            if (reviewItem?._id !== reviewEditId) {
                              setReviewEditContent(reviewItem?.review);
                              setReviewEditId(reviewItem?._id);
                            } else {
                              if (!reviewEditContent?.trim()?.length) {
                                return toast.error(
                                  "Nội dung bình luận không được bỏ trống"
                                );
                              }

                              const updateRes = await updateUserReview(
                                reviewEditId,
                                reviewEditContent
                              );
                              if (updateRes?.data?.success) {
                                const listReview = [...reviewData]?.map(
                                  (item) => {
                                    if (item?._id === reviewEditId) {
                                      return {
                                        ...item,
                                        review: reviewEditContent,
                                      };
                                    }
                                    return { ...item };
                                  }
                                );
                                setReviewData(listReview);
                                setReviewEditContent("");
                                setReviewEditId(0);
                                return toast.success(
                                  "Chỉnh sửa nội dung bình luận thành công"
                                );
                              }
                              return toast.error(
                                "Chỉnh sửa nội dung bình luận thất bại"
                              );
                            }
                          }}
                        >
                          {reviewItem?._id === reviewEditId
                            ? "Lưu thay đổi"
                            : "Chỉnh sửa"}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        fontSize: "14px",
                        marginLeft: "20px",
                      }}
                      onClick={() => {
                        if (userData?._id) {
                          if (replyReviewId !== reviewItem?._id) {
                            setReplyContent("");
                            setReplyReviewId(reviewItem?._id);
                          }
                        } else {
                          toast.error(
                            "Vui lòng đăng nhập để phản hồi bình luận"
                          );
                        }
                      }}
                    >
                      Phản hồi
                    </div>
                  </div>
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
                                      background: "#252525",
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
                                      color: "#252525",
                                    }}
                                  >
                                    {childrenReviewItem?.user_email}
                                  </h6>
                                  {childrenReviewItem?.user_id ===
                                  userData?._id ? (
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
                                  ) : (
                                    <></>
                                  )}
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
                              <div>
                                <span
                                  style={{
                                    position: "absolute",
                                    marginLeft: "5px",
                                    padding: "1px 4px",
                                    color: "white",
                                    background: "black",
                                    fontSize: "11px",
                                    marginTop: "5px",
                                    width: "120px",
                                    textAlign: "center",
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {reviewItem?.user_email}
                                </span>
                                <TextareaAutosize
                                  aria-label="minimum height"
                                  minRows={2}
                                  style={{
                                    resize: "none",
                                    width: "100%",
                                    padding: "5px",
                                  }}
                                  disabled={true}
                                >
                                  {" "?.repeat(
                                    33
                                  ) + childrenReviewItem?.review}
                                </TextareaAutosize>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <></>
                  )}

                  {replyReviewId === reviewItem?._id ? (
                    <div style={{ marginTop: "10px" }}>
                      <div
                        style={{
                          textAlign: "left",
                          marginLeft: "10%",
                        }}
                      >
                        Phản hồi
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={2}
                          value={replyContent}
                          style={{
                            resize: "none",
                            width: "90%",
                            padding: "5px",
                          }}
                          onChange={(event) =>
                            setReplyContent(event?.target?.value)
                          }
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          border: "1px solid rgb(218,218,218)",
                          width: "90%",
                          marginLeft: "10%",
                          padding: "5px",
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            padding: "2px",
                            color: "#252525",
                            borderColor: "#252525",
                          }}
                          onClick={() => {
                            createReviewChildren();
                          }}
                        >
                          Gửi
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-sm-2 col-md-3"></div>
              </div>
            )}
          </div>
        );
      })}

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
                    if (currentPage > 0) {
                      getAllReview(currentPage - 1);
                      setCurrentPage(currentPage - 1);
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
                    {currentPage + 1} / {totalPage}
                  </a>
                </div>

                <div
                  className="load-more-btn text-center"
                  onClick={() => {
                    if (currentPage + 1 < totalPage) {
                      getAllReview(currentPage + 1);
                      setCurrentPage(currentPage + 1);
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
