import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../common/header/title/PageHeader";
import Loader from "../common/loader/Loader";
import "../customer/customer.css";
import Profile from "./Profile";

const Order = () => {
  const { id } = useParams();
  // GET SINGLE ORDER
  const [order, setOrder] = useState({});
  const [items, setitems] = useState([]);
  const [laoding, setLoading] = useState(false);
  useEffect(() => {
    const fatchOrder = async () => {
      const { data } = await axios.get(
        process.env.REACT_APP_SERVER + `/api/admin/orders/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("rToken"),
          },
        }
      );
      setOrder(data);
      setitems(data.items);
      setLoading(true);
    };
    fatchOrder();
  }, [order, id]);

  if (!localStorage.getItem("rToken")) {
    window.location.href = "/delivery-man";
  } else {
    return (
      <>
        <PageHeader title="Dashboard" />
        <section className="dashboard">
          <div className="container padding">
            <Profile />
            {laoding ? (
              <div className="dashboard-content">
                <div className="order order-details">
                  <h3 className="text-center">Order Details</h3>
                  <div className="heading-border"></div>
                  <div className="order-items">
                    <table>
                      <tr>
                        <th>Thumb</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total_price</th>
                      </tr>
                      {items.length === 0 ? (
                        <tr>
                          <td className="text-center" colSpan="13">
                            No items found!
                          </td>
                        </tr>
                      ) : (
                        items.map((val, index) => (
                          <tr key={index}>
                            <td>
                              <img
                                src={
                                  process.env.REACT_APP_SERVER +
                                  "/foods/" +
                                  val.thumb
                                }
                                alt={val.title}
                              />
                            </td>
                            <td>{val.title}</td>
                            <td>৳ {val.price}</td>
                            <td>{val.quantity}</td>
                            <td>{val.itemTotal}</td>
                          </tr>
                        ))
                      )}
                      <tr className="bold">
                        <td colSpan="2">Total Items: {order.total_foods}</td>
                        <td colSpan="2">Total Qty: {order.total_quantity}</td>
                        <td>
                          Sub-Total: ৳ {order.total_price - order.deliveryCost}
                        </td>
                      </tr>
                      <tr>
                        <th colSpan="3">
                          Delivery Cost: ৳ {order.deliveryCost}
                        </th>
                        <th colSpan="2">Total Cost: ৳ {order.total_price}</th>
                      </tr>
                    </table>
                    <div className="grid-2">
                      <div className="order-summury">
                        <h5>Order Status</h5>
                        <ul>
                          <li>
                            <b>Order ID: </b> {order.orderID}
                          </li>
                          <li>
                            <b>Status: </b>
                            <span
                              className={
                                (order.status === "Ordered" && "btn-order") ||
                                (order.status === "OnDelivery" &&
                                  "btn-on-delv") ||
                                (order.status === "Cancelled" && "btn-cncl") ||
                                (order.status === "Delivered" && "btn-delv")
                              }
                            >
                              {order.status}
                            </span>
                          </li>
                          <li>
                            <b>Payment: </b> {order.payment}
                          </li>
                          <li>
                            <b>Order Date: </b>
                            {order.order_date
                              ? moment(order.order_date).format("lll")
                              : "NaN"}
                          </li>
                          <li>
                            <b>Accept Time: </b>
                            {order.accept_time
                              ? moment(order.accept_time).format("lll")
                              : "NaN"}
                          </li>
                          <li>
                            <b>Expected Time:</b>{" "}
                            {order.exp_time === 0 ? "NaN" : order.exp_time}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Loader />
            )}
          </div>
        </section>
      </>
    );
  }
};

export default Order;
