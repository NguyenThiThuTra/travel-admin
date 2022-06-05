import React from 'react';
export default function CustomFooterTable(props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>{props.title}</div>
    </div>
  );
}
