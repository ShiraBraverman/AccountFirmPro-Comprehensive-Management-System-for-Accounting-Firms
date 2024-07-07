import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import {
  Chat,
  Channel,
  ChannelHeader,
  Thread,
  Window,
  useChannelStateContext,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import ChannelListContainer from "../components/ChanelList";
import ChannelMessages from "../components/Messages";
import "../css/chat.css";
import MyImage from "../pictures/loading-bar.png";

const ChatApp = () => {
  const { chatClient, clientReady } = useContext(AuthContext);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!clientReady)
    return <img className="loading" src={MyImage} alt="Loading..." />;

  const CustomChannelHeader = () => {
    const { channel } = useChannelStateContext();

    return (
      <div className="channel-header__container">
        <div 
          className="channel-header__name"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* {channel?.data?.name} */}
        </div>
        {showTooltip && (
          <div className="channel-header__description tooltip">
            {channel?.data?.description}
          </div>
        )}
      </div>
    );
  };


  
    

  return (
    <Chat client={chatClient} theme="messaging light">
      <div className="chat-container">
        <div className="channel-list-container">
          <ChannelListContainer />
        </div>
        <div className="channel-container">
          <Channel>
            <div className="window-container">
              <Window>
                <CustomChannelHeader  showChannelName={true} showDescription={true} />
                <ChannelHeader showChannelName={true} showDescription={true} />
                <ChannelMessages />
              </Window>
            </div>
            <Thread />
          </Channel>
        </div>
      </div>
    </Chat>
  );
};

export default ChatApp;
