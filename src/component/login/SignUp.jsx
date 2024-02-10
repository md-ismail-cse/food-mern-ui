import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import PageHeader from "../common/header/title/PageHeader";
import Loader from "../common/loader/Loader";
import "./login.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [laoding, setLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password === conPassword) {
      setLoading(true);
      let data = {
        name,
        email,
        password,
        phone,
        address,
      };
      axios
        .post(process.env.REACT_APP_SERVER + `/api/admin/customers`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setLoading(false);
          if (response.data.message === "Registration successfull.") {
            // Set Token
            localStorage.setItem("cID", response.data.id);
            localStorage.setItem("cName", response.data.name);
            localStorage.setItem("cToken", response.data.token);
            Swal.fire({
              icon: "success",
              text: response.data.message,
              showConfirmButton: false,
              timer: 1000,
            }).then(() => (window.location.href = "/customer/dashboard"));
          } else if (response.data.message === "Already registered.") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: response.data.message,
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something wrong.",
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        text: "Confirm password doesn't match.",
      });
    }
  };

  return (
    <>
      <PageHeader title="Registration" />
      <section className="login">
        <div className="container">
          <div className="login-form text-center">
            <form onSubmit={submitHandler}>
              <img src={"/img/placeholder.png"} alt="" />
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name..."
                required
              />
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
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password..."
                required
              />
              <input
                type="password"
                name="con-password"
                value={conPassword}
                onChange={(e) => setConPassword(e.target.value)}
                placeholder="Confirm password..."
                required
              />
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone..."
                required
              />
              <input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address..."
                required
              />

              {!laoding ? (
                <input
                  type="submit"
                  name="submit"
                  value="Registration"
                  class="btn-primary"
                />
              ) : (
                <Loader />
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
