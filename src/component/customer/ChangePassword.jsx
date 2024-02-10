import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageHeader from "../common/header/title/PageHeader";
import Profile from "./Profile";
import "./customer.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [email, setEmail] = useState("");
  const [currentThumb, setThumb] = useState("");

  // GET CUSTOMER DETAILS
  const id = localStorage.getItem("cID");
  useEffect(() => {
    const fatchCustomer = async () => {
      const { data } = await axios.get(
        process.env.REACT_APP_SERVER + `/api/admin/customers/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("cToken"),
          },
        }
      );
      setThumb(data.thumb);
      setEmail(data.email);
    };
    fatchCustomer();
  }, [id]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (newPassword === conPassword) {
      let updateData = {
        oldPassword,
        newPassword,
        email,
        thumb: currentThumb,
      };
      axios
        .put(
          process.env.REACT_APP_SERVER +
            `/api/admin/customers/${id}?cthumb=${currentThumb}`,
          updateData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: localStorage.getItem("cToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.message === "Something wrong.") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: response.data.message,
            });
          } else if (response.data.message === "Old password doesn't match.") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: response.data.message,
            });
          } else {
            Swal.fire({
              icon: "success",
              text: response.data.message,
              showConfirmButton: false,
              timer: 1000,
            }).then(() => (window.location.href = "/customer/dashboard"));
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Update field!",
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        text: "Confirm password doesn't match.",
      });
    }
  };

  if (!localStorage.getItem("cToken")) {
    window.location.href = "/login";
  } else {
    return (
      <>
        <PageHeader title="Change Password" />
        <section className="dashboard">
          <div className="container padding">
            <Profile />
            <div className="dashboard-content">
              <form encType="multipart/form-data" onSubmit={submitHandler}>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Old password..."
                  required
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password..."
                  required
                />
                <input
                  type="password"
                  value={conPassword}
                  onChange={(e) => setConPassword(e.target.value)}
                  placeholder="Confirm password..."
                  required
                />
                <button className="btn-primary">Update</button>
              </form>
            </div>
          </div>
        </section>
      </>
    );
  }
};

export default ChangePassword;
