import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory } from '../../actions'; 
import "./style.css";

const MenuHeader = () => {

  // get category data from store.state
  const category = useSelector(state => state.category)
  const dispatch = useDispatch() // tool to dispatch action

  useEffect(() => {
      dispatch(getAllCategory()) // get category data and keep it in store when component loaded
  }, []);

  // render category list (nested list)
  const renderCategories = (categories) => {
    let myCategories = [];
    for (let category of categories) {
      myCategories.push(
        <li key={category.name}>
            {
                category.parentId ? <a 
                  href={`/${category.slug}?cid=${category._id}&type=${category.type}`}>
                    {category.name}
                  </a>
                : <span>{category.name}</span>
            }
          {category.children.length > 0 ? (
            <ul>{renderCategories(category.children)}</ul>
          ) : null}
        </li>
      );
    }

    return myCategories;
  };

  return (
    <div className="menuHeader">
        <ul>
            {
                category.categories.length > 0 ? renderCategories(category.categories) : null
            }
        </ul>
    </div>
  )
};

export default MenuHeader;
