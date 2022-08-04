import { Empty, Input } from 'antd';
import ChatIcon from 'assets/images/chat.png';
import { firestore } from 'configs/firebase/config';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import {
  setOpenPopupChatBox,
  toggleOpenPopupChatBox,
  useOpenPopupChatBoxSelector,
  useReceiverChatBoxSelector
} from 'features/ChatBox/ChatBoxSlice';
import { useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AiOutlineCloseCircle, AiOutlineSend } from 'react-icons/ai';
import { BsChatFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './ChatMessage';
import ListHomestayChatBox from './ListHomestayChatBox';
import './PopupChat.css';

export default function PopupChat() {
  const dispatch = useDispatch();
  // popup chat with admin
  const dummy = useRef();
  const chatBoxRef = useRef(null);
  const inputMessageRef = useRef(null);

  const [openPopupChat, setOpenPopupChat] = useState(false);

  const openPopupChatBox = useSelector(useOpenPopupChatBoxSelector);

  const receiver = useSelector(useReceiverChatBoxSelector);

  const currentUser = useSelector(useCurrentUserSelector);

  const conversationsRef = firestore.collection('conversations');
  const queryConversations = conversationsRef.where(
    'members',
    'array-contains',
    currentUser?.data?._id
  );

  const [conversations, loadingConversations] = useCollectionData(
    queryConversations,
    { idField: 'id' }
  );

  const [currentConversation, setCurrentConversation] = useState(null);

  const onChangeCurrentConversation = (conversation_id) => {
    setCurrentConversation(
      conversations?.find((conversation) =>
        conversation.id.includes(conversation_id)
      )
    );
  };

  useEffect(() => {
    if (conversations && receiver) {
      setCurrentConversation(
        conversations?.find((conversation) =>
          conversation.members.includes(receiver?.user_id)
        )
      );
    }
  }, [conversations, receiver]);

  const [dataMessages, setDataMessages] = useState([]);

  const messageRef = firestore.collection('messages');

  const queryMessage = messageRef
    .where('conversation_id', '==', currentConversation?.id || null)
    .orderBy('createdAt', 'desc');
  const [messages] = useCollectionData(queryMessage);
  useEffect(() => {
    setDataMessages(messages);
  }, [messages]);

  const [formValue, setFormValue] = useState();

  const handleSwitchPopupChat = () => {
    setOpenPopupChat(!openPopupChat);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!formValue) {
      return;
    }
    setOnScroll(true);

    const conversation_id = uuidv4();
    if (!currentConversation) {
      const conversation = {
        members: [currentUser?.data?._id, receiver?.user_id],
        id: conversation_id,
      };
      conversationsRef.add(conversation);
    }

    const message = {
      conversation_id: currentConversation?.id || conversation_id,
      user_id: currentUser?.data?._id,
      sender_id: currentUser?.data?._id,
      text: formValue,
      // createdAt: new Date(),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
    messageRef.add(message);
    setFormValue('');
  };

  // animation
  const [onScroll, setOnScroll] = useState(false);
  useEffect(() => {
    if (conversationsRef || receiver || currentConversation) {
      dummy?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationsRef, onScroll, messages, receiver, currentConversation]);

  useEffect(() => {
    if (receiver) {
      inputMessageRef?.current?.focus();
    }
  }, [receiver]);

  // openChatBox
  const openChatBox = () => {
    dispatch(setOpenPopupChatBox(true));
  };
  return (
    <div className="popup-chat">
      <div
        onClick={() => dispatch(toggleOpenPopupChatBox())}
        className="icon-open-message"
      >
        <img
          width="40px"
          height="40px"
          src={ChatIcon}
          alt="icon-open-message"
        />
      </div>
      {openPopupChatBox && (
        <div
          ref={chatBoxRef}
          onMouseEnter={() => chatBoxRef?.current?.focus()}
          className="chat-box"
        >
          {/* <div onClick={() => moreMessage()}> MORE MORE </div> */}
          <div className="chat-box__header">
            <BsChatFill color="#ff4d4f" fontSize={20} />
            <span className="chat-box__title">
              <strong>Chat</strong>
            </span>
            <span
              onClick={() => dispatch(toggleOpenPopupChatBox())}
              className="chat-box__close"
            >
              <AiOutlineCloseCircle color="#ff4d4f" fontSize={25} />
            </span>
          </div>
          <div className="chat-box__main">
            <div className="chat-box__listHomestay">
              <ListHomestayChatBox
                data={conversations}
                currentConversation={currentConversation}
                onChangeCurrentConversation={onChangeCurrentConversation}
              />
            </div>
            {(receiver || currentConversation) && (
              <div className="chat-box__receiver">
                <div className="chat-box__receiver__name" mark>
                  {receiver?.name}
                </div>
                <div className="chat-box__content">
                  <span ref={dummy}></span>
                  {dataMessages?.map((message, index) => (
                    <ChatMessage
                      currentUser={currentUser}
                      message={message}
                      key={message.updatedAt}
                    />
                  ))}
                </div>

                <form onSubmit={sendMessage}>
                  <div className="chat-box__input-wrap">
                    <Input
                      ref={inputMessageRef}
                      value={formValue}
                      onChange={(e) => setFormValue(e.target.value)}
                      type="text"
                      placeholder="Gửi tin nhắn"
                    />
                    <button type="submit" className="chat-box__btn-send">
                      <AiOutlineSend />
                    </button>
                  </div>
                </form>
              </div>
            )}
            {!receiver && !currentConversation && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
