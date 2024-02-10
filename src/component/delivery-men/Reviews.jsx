import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import PageHeader from "../common/header/title/PageHeader";
import Loader from "../common/loader/Loader";
import Rating from "../common/rating/Rating";
import "../customer/customer.css";
import Profile from "./Profile";

const Reviews = () => {
  // GET DELIVERY MAN DETAILS
  const id = localStorage.getItem("rID");
  const [deliveryMan, setDeliveryMan] = useState({});
  const [deliveryManReviews, setDeliveryManReviews] = useState([]);
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
      setDeliveryManReviews(data.reviews);
      setLoading(true);
    };
    fatchDeliveryMan();
  }, [deliveryMan, id]);

  // PAGINATION
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 20;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = deliveryManReviews.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(deliveryManReviews.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % deliveryManReviews.length;
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
        <PageHeader title="Reviews" />
        <section className="dashboard">
          <div className="container padding">
            <Profile />
            <div className="dashboard-content">
              {laoding ? (
                <div className="grid-4">
                  {currentItems.length === 0 ? (
                    <div className="review-item">
                      <p>No feedback has been given yet.</p>
                    </div>
                  ) : (
                    currentItems.reverse().map((item, index) => (
                      <div key={index} className="review-item">
                        <div className="grid-2">
                          <p className="name bold">{item.name}</p>
                          <Rating rating={item.rating} />
                        </div>
                        <p className="date">
                          {item.date && moment(item.date).format("lll")}
                        </p>
                        <p className="content">
                          {item.comment ? item.comment : "No comment given..."}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <Loader />
              )}

              {deliveryManReviews.length >= 21 && (
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
        </section>
      </>
    );
  }
};

export default Reviews;
