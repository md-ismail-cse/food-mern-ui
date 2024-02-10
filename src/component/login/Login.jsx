import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import PageHeader from "../common/header/title/PageHeader";
import Loader from "../common/loader/Loader";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [laoding, setLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let data = {
      email,
      password,
    };
    axios
      .post(process.env.REACT_APP_SERVER + `/api/admin/customerlogin`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setLoading(false);
        if (response.data.message === "Email doesn't exist.") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email doesn't exist.",
          });
        } else if (response.data.message === "Password doesn't match.") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Password doesn't match.",
          });
        } else {
          // Set Token
          localStorage.setItem("cID", response.data.id);
          localStorage.setItem("cName", response.data.name);
          localStorage.setItem("cToken", response.data.token);
          Swal.fire({
            icon: "success",
            text: response.data.message,
            showConfirmButton: false,
            timer: 1000,
          }).then(() => (window.location.href = "/customer/dashboard/"));
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something wrong.",
        });
      });
  };
  return (
    <>
      <PageHeader title="Login" />
      <section className="login">
        <div className="container">
          <div className="login-form text-center">
            {localStorage.getItem("cToken") ? (
              <h3>You are already logged in.</h3>
            ) : (
              <div>
                <form onSubmit={submitHandler}>
                  <img src={"/img/placeholder.png"} alt="" />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email..."
                    required
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password..."
                    required
                  />
                  {!laoding ? (
                    <input
                      type="submit"
                      name="submit"
                      value="Login"
                      className="btn-primary"
                    />
                  ) : (
                    <Loader />
                  )}
                </form>
                <Link to="/registration">Create Account</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
