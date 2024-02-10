import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageHeader from "../common/header/title/PageHeader";
import "../customer/customer.css";
import Profile from "./Profile";

const ProfilePicChange = () => {
  const [currentThumb, setThumb] = useState("");

  // GET CUSTOMER DETAILS
  const id = localStorage.getItem("rID");
  useEffect(() => {
    const fatchDeliveryMan = async () => {
      const { data } = await axios.get(
        process.env.REACT_APP_SERVER + `/api/admin/delivery-men/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("rToken"),
          },
        }
      );
      setThumb(data.thumb);
    };
    fatchDeliveryMan();
  }, [id]);

  const submitHandler = (e) => {
    e.preventDefault();
    let updateData = {
      thumb: document.querySelector("#thumb").files[0],
    };
    axios
      .put(
        process.env.REACT_APP_SERVER +
          `/api/admin/delivery-men/${id}?cthumb=${currentThumb}`,
        updateData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("rToken"),
          },
        }
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          text: response.data.message,
          showConfirmButton: false,
          timer: 1000,
        }).then(() => (window.location.href = "/delivery-man/dashboard"));
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

  if (!localStorage.getItem("rToken")) {
    window.location.href = "/delivery-man";
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
                      "/delivery-men/" +
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
