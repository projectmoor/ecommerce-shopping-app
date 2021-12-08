import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsBySlug } from "../../../actions";
import { generatePublicUrl } from '../../../urlConfig';
import { Link } from 'react-router-dom';
import Card from '../../../components/UI/Card';
import Price from '../../../components/UI/Price';
import Rating from '../../../components/UI/Rating';

const ProductStore = (props) => {
  const product = useSelector((state) => state.product);
  // const priceRange = {
  //   under3h: 300,
  //   under5h: 500,
  // };
  const priceRange = product.priceRange;
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(props)
    const { match } = props;
    dispatch(getProductsBySlug(match.params.slug));
  }, []);

  return (
    <>
      {Object.keys(product.productsByPrice).map((key, index) => {
        return (
          <Card 
            key={index} 
            className="card"
            headerleft={<div>{props.match.params.slug} under {priceRange[key]}</div>} 
            headerright={<button>View all</button>} 
            style={{
              width: 'calc(100% - 40px)',
              margin: '20px'
            }}
          >
            <div style={{ display: "flex" }}>
              {product.productsByPrice[key].map((product, index) => (
                <Link 
                  to={`/${product.slug}/${product._id}/p`}
                  style={{display: 'block'}} 
                  key={index} 
                  className="productContainer"
                >
                  <div className="productImgContainer">
                    <img
                      src={generatePublicUrl(product.productPictures[0].img)}
                      alt=""
                    />
                  </div>
                  <div className="productInfo">
                    <div style={{ margin: "5px 0" }}>{product.name}</div>
                    <div>
                      <Rating value="4.3" />&nbsp;
                      <span
                        style={{
                          color: "#777",
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >(3533)</span>
                    </div>
                    <Price value={product.price} />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        );
      })}
    </>
  );
};

export default ProductStore;
