import React, { useEffect, useState } from "react";
import PageHeader from "../common/header/title/PageHeader";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Loader from "../common/loader/Loader";

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [laoding, setLoading] = useState(false);
  useEffect(() => {
    const fatchBlog = async () => {
      const { data } = await axios.get(
        process.env.REACT_APP_SERVER + `/api/admin/blogs/${id}`
      );
      setBlog(data);
      setLoading(true);
    };
    fatchBlog();
  }, [id]);

  return (
    <>
      <PageHeader title={blog.title} />
      <section className="singleBlog padding">
        {laoding ? (
          <div className="container">
            <div className="blog-content">
              <div className="blog-title">
                <h3>{blog.title}</h3>
                <div className="admin flex">
                  <span>
                    <i className="fa fa-user"></i>{" "}
                    <label htmlFor="">{blog.post_by}</label>
                  </span>
                  <span>
                    <i className="fa fa-calendar-alt"></i>{" "}
                    <label htmlFor="">{moment(blog.date).format("lll")}</label>
                  </span>
                </div>
              </div>
              <div className="blog-text">
                <img
                  src={process.env.REACT_APP_SERVER + "/blogs/" + blog.thumb}
                  alt=""
                />
                {blog.description}
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </section>
    </>
  );
};

export default SingleBlog;
