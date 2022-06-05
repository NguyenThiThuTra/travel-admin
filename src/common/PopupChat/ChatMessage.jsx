import { Avatar } from 'antd';
import classNames from 'classnames';
import React from 'react';

export function ChatMessage({ message, currentUser }) {
  return (
    <div
      style={{
        justifyContent:
          message?.sender_id === currentUser?.data?._id && 'flex-end',
      }}
      className={classNames('chat-box__content__item')}
    >
      <div
        style={{
          backgroundColor:
            message?.sender_id === currentUser?.data?._id
              ? '#3578E5'
              : '#f5f6f8',
        }}
        className="chat-box__content__line"
      >
        <div className="chat-box__content__avatar">
       
        </div>
        <div
          style={{
            color: message?.sender_id === currentUser?.data?._id && 'white',
          }}
          className="chat-box__content__message"
        >
          {message.text}{' '}
        </div>
      </div>
    </div>
  );
}
