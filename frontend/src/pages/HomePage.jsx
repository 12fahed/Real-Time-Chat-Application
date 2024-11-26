import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center w-full h-full">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-full pt-16 h-[calc(100vh)]">
          <div className="flex w-full h-full rounded-lg overflow-hidden">
            <Sidebar className="w-[250px] min-w-[250px] max-w-[250px]" /> {/* Sidebar width fixed */}
            
            {/* Main chat area */}
            {/* <div className="flex-1 overflow-auto"> */}
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>

  );
};
export default HomePage;