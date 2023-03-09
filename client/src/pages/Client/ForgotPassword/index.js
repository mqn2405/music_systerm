import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  changeForgotPassword,
  checkEmailExist,
  confirmOtp,
  sendOtp,
} from "../../../services/user";
import OtpInput from "react-otp-input";
import { CircularProgress } from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(0);
  const [timeCountDown, setTimeCountDown] = useState(0);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    setLoading(true);
    const handle = async () => {
      if (step === 0) {
        if (!email?.trim()?.length) {
          return toast.error("Email không được bỏ trống");
        }

        const checkEmail = await checkEmailExist(email);
        if (!checkEmail?.data?.success) {
          return toast.error("Email không tồn tại");
        }

        const sendResult = await sendOtp(email);

        if (sendResult?.data?.success) {
          setTimeCountDown(61);
          setStep(1);
          return toast.success("Đã gửi OTP đến email, vui lòng kiểm tra email");
        } else {
          return toast.error("Đã xảy ra lỗi trong quá trình gửi OTP");
        }
      }

      if (step === 1) {
        if (!otp.toString()?.length) {
          return toast.error("Vui lòng nhập vào OTP");
        }

        const result = await confirmOtp(email, otp);

        if (result?.data?.success) {
          setStep(2);
          return toast.success("Xác thực OTP thành công");
        } else {
          return toast.error("Xác thực OTP thất bại");
        }
      }

      if (step === 2) {
        if (newPassword?.trim()?.length < 6) {
          return toast.error("Mật khẩu cần có ít nhất 6 kí tự");
        }

        if (newPassword !== confirmPassword) {
          return toast.error("Mật khẩu nhập lại không hợp lệ");
        }

        const result = await changeForgotPassword(email, newPassword);

        if (result?.data?.success) {
          toast.success("Đổi mật khẩu thành công");
          return navigate("/login");
        } else {
          toast.error("Đổi mật khẩu thất bại");
        }
      }
    };

    await handle();
    setLoading(false);
  };

  const resendOtp = async () => {
    try {
      const sendResult = await sendOtp(email);

      if (sendResult?.data?.success) {
        setTimeCountDown(61);
        return toast.success("Đã gửi OTP đến email, vui lòng kiểm tra email");
      } else {
        return toast.error("Đã xảy ra lỗi trong quá trình gửi OTP");
      }

    } catch (error) {
      toast.error("Gửi OTP thất bại");
    }
  };

  useEffect(() => {
    let timerId;
    if (timeCountDown > 0 && step === 1) {
      timerId = setInterval(() => {
        if (timeCountDown > 0) {
          setTimeCountDown((prev) => prev - 1);
        } else {
          clearInterval(timerId);
        }
      }, 1000);
      console.log(timerId);
    }

    return function cleanup() {
      console.log(`Clearing ${timerId}`);
      clearInterval(timerId);
    };
  }, [timeCountDown]);

  return (
    <div>
      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(img/bg-img/breadcumb3.jpg)" }}
      >
        <div className="bradcumbContent">
          <p>Điều gì mới</p>
          <h2>Quên mật khẩu</h2>
        </div>
      </section>
      <section className="login-area section-padding-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="login-content">
                <h3>Quên mật khẩu</h3>
                <div className="login-form">
                  <form onSubmit={(event) => event.preventDefault()}>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Email: </label>
                      <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Nhập vào địa chỉ email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                      <small id="emailHelp" className="form-text text-muted">
                        <i className="fa fa-lock mr-2" />
                        Chúng tôi sẽ không bao giờ chia sẻ email của bạn với bất
                        kỳ ai khác.
                      </small>
                    </div>
                    {step === 1 ? (
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">OTP: </label>
                        <OtpInput
                          value={otp}
                          onChange={(event) => {
                            setOtp(event)
                          }}
                          numInputs={6}
                          separator={<span style={{ width: "20px" }}></span>}
                          inputStyle={{ width: "45px", height: "45px" }}
                        />
                        <div style={{ color: "red", marginTop: "5px" }}>
                          Thời gian: 00:{timeCountDown?.toString().length === 1 ? '0' : '' + timeCountDown}{" "}
                          <span
                            style={{
                              marginLeft: "20px",
                              color: "blue",
                              cursor: "pointer",
                            }}
                            onClick={() => resendOtp()}
                          >
                            Gửi lại OTP
                          </span>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}

                    {step === 2 ? (
                      <div className="form-group">
                        <label htmlFor="exampleInputPassword1">
                          Mật khẩu:{" "}
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="exampleInputPassword1"
                          placeholder="Nhập vào mật khẩu"
                          value={newPassword}
                          onChange={(event) =>
                            setNewPassword(event.target.value)
                          }
                        />
                        <small id="emailHelp" className="form-text text-muted">
                          Mật khẩu cần ít nhất 6 kí tự
                        </small>
                      </div>
                    ) : (
                      <></>
                    )}

                    {step === 2 ? (
                      <div className="form-group">
                        <label htmlFor="exampleInputPassword1">
                          Nhập lại mật khẩu:{" "}
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="exampleInputPassword1"
                          placeholder="Nhập vào mật khẩu nhập lại"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                        />
                        <small id="emailHelp" className="form-text text-muted">
                          Mật khẩu cần ít nhất 6 kí tự
                        </small>
                      </div>
                    ) : (
                      <></>
                    )}

                    <button
                      type="submit"
                      className="btn oneMusic-btn mt-30"
                      onClick={() => {
                        if (!loading) {
                          handleForgotPassword();
                        }
                      }}
                    >
                      {!loading ? (
                        step === 0 ? (
                          "Gửi OTP"
                        ) : step === 1 ? (
                          "Xác nhận"
                        ) : (
                          "Đổi mật khẩu"
                        )
                      ) : (
                        <CircularProgress
                          size={"20px"}
                          sx={{ color: "gray" }}
                        />
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
