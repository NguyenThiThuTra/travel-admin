import React from 'react';
import { Link } from 'react-router-dom';
const ButtonUI = (props) => {
  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  };
  return (
    <div
      onClick={handleClick}
      style={{
        padding: props.p || '0',
        margin: props.m || '0',
        color: props.color || '#14b9d5',
      }}
      className="btn"
    >
      <Link className="btn" to={props.href || '#'}>
        <span
          style={{
            textTransform: props.textTransform || 'uppercase',
            backgroundColor: props.bg || '#fff',
            color: props.color || '#14b9d5',
            padding: props.paddingButton || ' 0.5rem 2rem',
            margin: props.marginButton || '0',
            borderRadius: props.borderRadius || '25px',
            letterSpacing: '2px',
          }}
        >
          {props.text || 'VIEW DESTINATION'}
        </span>
      </Link>
      <style jsx="true">
        {`
          .btn {
            padding: 0;
          }
          .btn:hover .btn {
            transform: scale(1.01);
            transition: all 0.24s;
          }
        `}
      </style>
    </div>
  );
};

export default ButtonUI;
