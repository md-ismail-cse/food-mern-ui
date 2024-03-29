import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import PageHeader from "../common/header/title/PageHeader";
import Loader from "../common/loader/Loader";
import "../customer/customer.css";
import Profile from "./Profile";

const Dashboard = () => {
  // GET ORDERS
  const [orders, setOrders] = useState([]);
  const delivery_man_id = localStorage.getItem("rID");
  const [laoding, setLoading] = useState(false);
  useEffect(() => {
    const fatchOrders = async () => {
      const { data } = await axios.get(
        process.env.REACT_APP_SERVER + `/api/admin/orders`,
        {
          headers: {
            Authorization: localStorage.getItem("rToken"),
          },
        }
      );
      const fatchDeliveryManOrders = data.filter((curData) => {
        return curData.delivery_man_id === delivery_man_id;
      });
      setOrders(fatchDeliveryManOrders);
      setLoading(true);
    };
    fatchOrders();
  }, [orders, delivery_man_id]);

  // PAGINATION
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 15;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = orders.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(orders.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % orders.length;
    setItemOffset(newOffset);
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  if (!localStorage.getItem("rToken")) {
    window.location.href = "/delivery-man";
  } else {
    return (
      <>
        <PageHeader title="Dashboard" />
        <section className="dashboard">
          <div className="container padding">
            <Profile />
            <div className="dashboard-content">
              <div className="order">
                <div className="order-items">
                  <table>
                    <tr>
                      <th>Order ID</th>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Total_price</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Order_Date</th>
                      <th>Accept_Time</th>
                      <th>Expected_Time</th>
                    </tr>
                    {laoding ? (
                      <>
                        {currentItems.length === 0 ? (
                          <tr>
                            <td className="text-center" colSpan="10">
                              No items found!
                            </td>
                          </tr>
                        ) : (
                          currentItems.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <Link
                                  to={"/delivery-man/dashboard/" + item._id}
                                >
                                  {item.orderID}
                                </Link>
                              </td>
                              <td>{item.total_foods}</td>
                              <td>{item.total_quantity}</td>
                              <td>৳ {item.total_price}</td>
                              <td>{item.payment}</td>
                              <td>
                                <span
                                  className={
                                    (item.status === "Ordered" &&
                                      "btn-order") ||
                                    (item.status === "OnDelivery" &&
                                      "btn-on-delv") ||
                                    (item.status === "Cancelled" &&
                                      "btn-cncl") ||
                                    (item.status === "Delivered" && "btn-delv")
                                  }
                                >
                                  {item.status}
                                </span>
                              </td>
                              <td>{moment(item.order_date).format("lll")}</td>
                              <td>
                                {item.accept_time &&
                                  moment(item.accept_time).format("lll")}
                              </td>
                              <td>
                                {item.exp_time === 0 ? "NaN" : item.exp_time}
                              </td>
                            </tr>
                          ))
                        )}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={9}>
                          <Loader />
                        </td>
                      </tr>
                    )}
                  </table>
                  {orders.length >= 16 && (
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=">>"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
                      pageCount={pageCount}
                      previousLabel="<<"
                      renderOnZeroPageCount={null}
                      containerClassName="pagination"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
};

export default Dashboard;
