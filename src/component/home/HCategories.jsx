import axios from "axios";
import React, { useEffect, useState } from "react";
import Title from "../common/header/title/Title";
import { Link } from "react-router-dom";
import Loader from "../common/loader/Loader";

const HCategories = () => {
  // GET CATEGORIES
  const [categories, setCategories] = useState([]);

  const [laoding, setLoading] = useState(false);
  useEffect(() => {
    const fatchCategories = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/admin/categories`
      );
      const featuredCategories = data.filter((curData) => {
        return curData.featured.toLowerCase() === "on";
      });
      setCategories(featuredCategories);
      setLoading(true);
    };
    fatchCategories();
  }, [categories]);

  return (
    <>
      <section className="categories padding">
        <div className="container">
          <Title subtitle="Our Categories" title="Explore Foods Categories" />
        </div>
        {laoding ? (
          <div className="container grid-4">
            {categories.length === 0 ? (
              <h3 className="text-center">No items found!</h3>
            ) : (
              categories.slice(0, 4).map((item, index) => (
                <div key={index} className="items shadow">
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
        ) : (
          <Loader />
        )}
      </section>
    </>
  );
};

export default HCategories;
