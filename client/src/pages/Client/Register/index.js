import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userSignup } from "../../../services/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!email?.trim()?.length || !password?.trim()?.length) {
        return toast.error("Email hoặc mật khẩu không thể bỏ trống");
      }

      if (password?.trim()?.length < 6) {
        return toast.error("Mật khẩu cần có ít nhất 6 kí tự");
      }

      if (password !== confirmPassword) {
        return toast.error("Mật khẩu nhập lại không hợp lệ");
      }

      const registerResult = await userSignup(email, password);

      if (registerResult?.data?.success) {
        toast.success(
          "Đăng ký thành công, bạn sẽ chuyển trang đăng nhập sau 2s"
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        return toast.error(registerResult?.data?.error || "Đăng kí thất bại");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Đăng kí thất bại");
    }
  };

  return (
    <div>
      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(img/bg-img/breadcumb3.jpg)" }}
      >
        <div className="bradcumbContent">
          <p>Điều gì mới</p>
          <h2>Đăng ký</h2>
        </div>
      </section>
      <section className="login-area section-padding-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="login-content">
                <h3>Đăng ký tài khoản</h3>
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
                    <div className="form-group">
                      <label htmlFor="exampleInputPassword1">Mật khẩu: </label>
                      <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Nhập vào mật khẩu"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      <small id="emailHelp" className="form-text text-muted">
                        Mật khẩu cần ít nhất 6 kí tự
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="exampleInputPassword2">
                        Nhập lại mật khẩu
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword2"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                      />
                    </div>

                    <div style={{ textAlign: "right" }}>
                      Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
                    </div>
                    <button
                      type="submit"
                      className="btn oneMusic-btn mt-30"
                      onClick={() => handleRegister()}
                    >
                      Đăng ký
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
