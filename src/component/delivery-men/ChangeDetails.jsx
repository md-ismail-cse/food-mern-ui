import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageHeader from "../common/header/title/PageHeader";
import "../customer/customer.css";
import Profile from "./Profile";

const ChangeDetails = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currentThumb, setThumb] = useState("");

  // GET DELIVERY MAN DETAILS
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
      setName(data.name);
      setPhone(data.phone);
      setAddress(data.address);
      setThumb(data.thumb);
    };
    fatchDeliveryMan();
  }, [id]);

  const submitHandler = (e) => {
    e.preventDefault();
    let updateData = {
      name,
      phone,
      address,
      thumb: currentThumb,
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

  if (!localStorage.getItem("rToken")) {
    window.location.href = "/delivery-man";
  } else {
    return (
      <>
        <PageHeader title="Change Details" />
        <section className="dashboard">
          <div className="container padding">
            <Profile />
            <div className="dashboard-content">
              <form encType="multipart/form-data" onSubmit={submitHandler}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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

export default ChangeDetails;
