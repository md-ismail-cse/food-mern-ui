import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../common/loader/Loader";

const Profile = () => {
  // GET CUSTOMER DETAILS
  const id = localStorage.getItem("cID");
  const [customer, setCustomer] = useState({});
  const [laoding, setLoading] = useState(false);

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
      setCustomer(data);
      setLoading(true);
    };
    fatchCustomer();
  }, [customer, id]);

  // CUSTOMER LOGOUT
  const customerLogout = () => {
    localStorage.removeItem("cID");
    localStorage.removeItem("cName");
    localStorage.removeItem("cToken");
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
                  process.env.REACT_APP_SERVER + "/customers/" + customer.thumb
                }
                alt={customer.name}
              />
            </div>
            <div className="profile-text">
              <h4>
                <i className="fa fa-user"></i> {customer.name}
              </h4>
              <p>
                <i className="fa fa-user-plus"></i>
                {""}
                {customer.date && moment(customer.date).format("ll")}
              </p>
              <p>
                <i className="fa fa-envelope"></i> {customer.email}
              </p>
              <p>
                <i className="fa fa-phone"></i> {customer.phone}
              </p>
              <p>
                <i className="fa fa-location-dot"></i> {customer.address}
              </p>
            </div>
          </div>
        ) : (
          <Loader />
        )}

        <div>
          <ul>
            <li>
              <Link to="/customer/dashboard" className="btn-primary">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/customer/change-details" className="btn-primary">
                Change Details
              </Link>
            </li>
            <li>
              <Link
                to="/customer/change-profile-picture"
                className="btn-primary"
              >
                Change Profile Picture
              </Link>
            </li>
            <li>
              <Link to="/customer/change-password" className="btn-primary">
                Change Password
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  customerLogout();
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
