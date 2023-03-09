import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../../services/auth";
import { USER_KEY } from "../../../utils/constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email?.trim()?.length || !password?.trim()?.length) {
        return toast.error("Email hoặc mật khẩu không thể bỏ trống");
      }
      const loginResult = await userLogin(email, password);
      if (loginResult?.data?.success) {
        const { payload } = loginResult?.data;
        localStorage.setItem(
          USER_KEY,
          JSON.stringify({
            email: payload?.email,
            role: payload?.role,
            name: payload?.name,
            _id: payload?._id,
            rank: payload?.rank
          })
        );
        toast.success(
          "Đăng nhập tài khoản thành công, bạn sẽ chuyển sang trang chủ trong 2s"
        );
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        return toast.error(loginResult?.data?.error || "Đăng nhập thất bại");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Đăng nhập thất bại");
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
          <h2>Đăng nhập</h2>
        </div>
      </section>

      <section className="login-area section-padding-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="login-content">
                <h3>Xin chào quay trở lại</h3>
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
                      <label htmlFor="exampleInputPassword1">Mật khẩu</label>
                      <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Nhập vào mật khẩu"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <a href="/forgot-password">Quên mật khẩu</a>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      Bạn chưa có tài khoản? <a href="/sign-up">Đăng ký</a>
                    </div>
                    <button
                      className="btn oneMusic-btn mt-30"
                      onClick={() => handleLogin()}
                    >
                      Đăng nhập
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
