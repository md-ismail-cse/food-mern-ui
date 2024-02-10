import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../common/loader/Loader";
import Rating from "../common/rating/Rating";

const Profile = () => {
  // GET DELIVERY MAN DETAILS
  const id = localStorage.getItem("rID");
  const [deliveryMan, setDeliveryMan] = useState({});
  const [laoding, setLoading] = useState(false);
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
      setDeliveryMan(data);
      setLoading(true);
    };
    fatchDeliveryMan();
  }, [deliveryMan, id]);

  // CUSTOMER LOGOUT
  const deliveryManLogout = () => {
    localStorage.removeItem("rID");
    localStorage.removeItem("rToken");
    window.location.href = "/";
  };

  return (
    <>
      <div className="dashboard-content-inner grid-2">
        {laoding ? (
          <div className="grid-2">
            <div className="img">
              <img
                src={
                  process.env.REACT_APP_SERVER +
                  "/delivery-men/" +
                  deliveryMan.thumb
                }
                alt={deliveryMan.name}
              />
            </div>
            <div className="profile-text">
              <h4>
                <i className="fa fa-user"></i> {deliveryMan.name}
              </h4>
              <p>
                <i className="fas fa-star"></i>{" "}
                <Rating rating={deliveryMan.rating} />(
                {deliveryMan.totalReviews})
              </p>
              <p>
                <i className="fa fa-user-plus"></i>
                {""}
                {deliveryMan.date && moment(deliveryMan.date).format("ll")}
              </p>
              <p>
                <i className="fa fa-envelope"></i> {deliveryMan.email}
              </p>
              <p>
                <i className="fa fa-phone"></i> {deliveryMan.phone}
              </p>
              <p>
                <i className="fa fa-location-dot"></i> {deliveryMan.address}
              </p>
            </div>
          </div>
        ) : (
          <Loader />
        )}

        <div>
          <ul>
            <li>
              <Link to="/delivery-man/dashboard" className="btn-primary">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/delivery-man/reviews" className="btn-primary">
                Reviews
              </Link>
            </li>
            <li>
              <Link to="/delivery-man/change-details" className="btn-primary">
                Change Details
              </Link>
            </li>
            <li>
              <Link
                to="/delivery-man/change-profile-picture"
                className="btn-primary"
              >
                Change Profile Picture
              </Link>
            </li>
            <li>
              <Link to="/delivery-man/change-password" className="btn-primary">
                Change Password
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  deliveryManLogout();
                }}
                className="btn-primary"
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
export default Profile;
