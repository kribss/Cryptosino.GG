import React from "react";
import { Link } from "react-router-dom";

function CasinoCardItem(props) {
  return (
    <>
      <li className="casinocards__item">
        <Link className="casinocards__item__link" to={props.path}>
          <figure
            className="casinocards__item__pic-wrap"
            data-category={props.label}
          >
            <img
              className="casinocards__item__img"
              alt="Game Image"
              src={props.src}
            />
          </figure>
          <div className="casinocards__item__info">
            <h5 className="casinocards__item__text">{props.text}</h5>
          </div>
        </Link>
      </li>
    </>
  );
}

export default CasinoCardItem;
