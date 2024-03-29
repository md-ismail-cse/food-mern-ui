import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import Loader from "../common/loader/Loader";

const CategoriesItem = () => {
  // GET CATEGORIES
  const [categories, setCategories] = useState([]);
  const [laoding, setLoading] = useState(false);
  useEffect(() => {
    const fatchCategories = async () => {
      const { data } = await axios.get(
        process.env.REACT_APP_SERVER + `/api/admin/categories`
      );
      setCategories(data);
      setLoading(true);
    };
    fatchCategories();
  }, [categories]);

  // Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 12;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = categories.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(categories.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % categories.length;
    setItemOffset(newOffset);
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {laoding ? (
        <>
          <div className="grid-4">
            {currentItems.length === 0 ? (
              <h3 className="text-center">No items found!</h3>
            ) : (
              currentItems.map((item) => (
                <div className="items shadow" key={item._id}>
                  <Link to={"/category-food/" + item.title}>
                    <div className="box-3 float-container">
                      <div className="category-thumb text-center">
                        <img
                          src={
                            process.env.REACT_APP_SERVER +
                            "/categories/" +
                            item.thumb
                          }
                          alt={item.title}
                          className="img-responsive img-curve"
                        />
                      </div>

                      <div className="category-title text-center">
                        <h4 className="float-text text-white">{item.title}</h4>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <Loader />
      )}
      {categories.length >= 13 && (
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
    </>
  );
};

export default CategoriesItem;
