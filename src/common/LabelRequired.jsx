import React from 'react';

export function LabelRequired({ title }) {
  return (
    <div style={{ fontSize: '14px', display: 'inline-flex' }}>
      <span style={{ color: '#ff4d4f' }}>*</span> {title}
    </div>
  );
}
