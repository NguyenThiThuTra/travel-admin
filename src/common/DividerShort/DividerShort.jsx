import React from 'react';

const DividerShort = (props) => {
  return (
    <div
      style={{
        textAlign: 'center',
        margin: props.m || '0',
        padding: props.p || '0',
      }}
    >
      <span
        style={{
          height: '4px',
          width: '80px',
          backgroundColor: '#f1f1f1',
          display: 'inline-block',
        }}
      ></span>
    </div>
  );
};

export default DividerShort;
