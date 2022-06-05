import React from 'react';

export function ErrorMessage({ message }) {
  return (
    <div className="ant-form-item-explain ant-form-item-explain-error">
      <div role="alert" style={{color:'#FA383E'}}>{message || 'This is required.'}</div>
    </div>
  );
}
