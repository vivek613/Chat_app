import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import ChatBox from "../Common/ChatBox";
import Mychat from "../Common/Mychat";
import SideDrawer from "../Common/SideDrawer";
// import Chatbox from "../components/Chatbox";
// import MyChats from "../components/MyChats";
// import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../context/chatContext";

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        d="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        {user && <Mychat fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;
