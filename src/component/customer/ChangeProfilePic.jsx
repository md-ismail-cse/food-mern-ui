import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageHeader from "../common/header/title/PageHeader";
import Profile from "./Profile";
import "./customer.css";

const ProfilePicChange = () => {
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
    };
    fatchCustomer();
  }, [currentThumb, id]);

  const submitHandler = (e) => {
    e.preventDefault();
    let updateData = {
      thumb: document.querySelector("#thumb").files[0],
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
        Swal.fire({
          icon: "success",
          text: response.data.message,
          showConfirmButton: false,
          timer: 1000,
        }).then(() => (window.location.href = "/customer/dashboard"));
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Update field!",
        });
      });
  };

  // SHOWING UPLOADED IMAGE
  const [file, setFile] = useState();
  function handleThumbChange(e) {
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  if (!localStorage.getItem("cToken")) {
    window.location.href = "/login";
  } else {
    return (
      <>
        <PageHeader title="Change Profile Picture" />
        <section className="dashboard">
          <div className="container padding">
            <Profile />
            <div className="dashboard-content change-profile-pic-form">
              <form encType="multipart/form-data" onSubmit={submitHandler}>
                {file ? (
                  <img src={file} alt="" />
                ) : (
                  <img
                    src={
                      process.env.REACT_APP_SERVER +
                      "/customers/" +
                      currentThumb
                    }
                    alt=""
                  />
                )}
                <input
                  type="file"
                  onChange={handleThumbChange}
                  id="thumb"
                  className="form-control"
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

export default ProfilePicChange;
