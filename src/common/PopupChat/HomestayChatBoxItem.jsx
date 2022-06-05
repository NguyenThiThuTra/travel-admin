import { Avatar, List, Typography } from 'antd';
import userApi from 'api/userApi';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import {
  setReceiver,
  useReceiverChatBoxSelector,
} from 'features/ChatBox/ChatBoxSlice';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function HomestayChatBox({
  onChangeCurrentConversation,
  conversation,
  currentConversation,
}) {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const currentUser = useSelector(useCurrentUserSelector);
  const receiver = useSelector(useReceiverChatBoxSelector);
  useEffect(() => {
    const friendId = conversation.members.find(
      (member) => member !== currentUser?.data?._id
    );
    userApi.getUser(friendId).then((res) => {
      setUser(res.data);
    });
  }, [conversation, currentUser]);

  const onClick = (conversation_id) => {
    onChangeCurrentConversation(conversation_id);
    dispatch(setReceiver({ user_id: user?._id, name: user?.name }));
  };

  return (
    <li
      style={{
        backgroundColor:
          currentConversation?.id === conversation?.id ? '#f5f6f8' : '',
      }}
      onClick={() => onClick(conversation.id)}
    >
      <Avatar src="https://joeschmoe.io/api/v1/random" />
      <p>{user?.name}</p>
    </li>
  );
}
