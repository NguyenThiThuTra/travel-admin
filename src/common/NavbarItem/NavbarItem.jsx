import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarItem.css'
const NavbarItem = (props) => {
  return (
    <li
      className={`navbar_item ${
        props.isActive === props.item.id ? 'active' : ''
      }`}
      key={props.item.id}
    >
      <Link to={props.item.route || '/'}>{props.item.text}</Link>
    </li>
  );
};

export default NavbarItem;
