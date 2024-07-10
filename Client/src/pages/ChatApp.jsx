// export default ChatApp;
import React, { useState, useContext } from "react";
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

const CustomChannelHeader = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { channel } = useChannelStateContext();

  return (
    <div 
      className="custom-channel-header"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <ChannelHeader showChannelName={true} />
      {showTooltip && channel?.data?.description && (
        <div className="channel-description-tooltip">
          {channel.data.description}
        </div>
      )}
    </div>
  );
};

const ChatApp = () => {
  const { chatClient, clientReady } = useContext(AuthContext);

  if (!clientReady)
    return <img className="loading" src={MyImage} alt="Loading..." />;

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
                <CustomChannelHeader />
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