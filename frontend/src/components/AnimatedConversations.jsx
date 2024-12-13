import { useEffect, useState } from "react";

const AnimatedConversations = ({ title, subtitle }) => {
  const CONVERSATIONS = [
    {
      user: "Mr. Sharma",
      message: "Rohan, did you complete your homework?",
      time: "08:30",
      avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      position: "start",
      status: "Delivered",
    },
    {
      user: "Rohan",
      message: "Yes, Sir. I finished it last night.",
      time: "08:31",
      avatar: "https://img.freepik.com/premium-photo/indian-male-university-student_599862-9599.jpg?w=900",
      position: "end",
      status: "Seen at 08:31",
    },
    {
      user: "Mr. Sharma",
      message: "Good. Make sure to submit it before the first period.",
      time: "08:32",
      avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      position: "start",
      status: "Delivered",
    },
    {
      user: "Rohan",
      message: "Understood, Sir. Thank you.",
      time: "08:33",
      avatar: "https://img.freepik.com/premium-photo/indian-male-university-student_599862-9599.jpg?w=900",
      position: "end",
      status: "Seen at 08:33",
    }
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Move to the next message
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % CONVERSATIONS.length);
    }, 3000); // Wait 3 seconds before showing the next message

    return () => clearTimeout(timeout); // Clean up timeout on component unmount or state change
  }, [currentMessageIndex]);

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-lg text-center">
        <div className="flex flex-col gap-4 mb-8">
          {CONVERSATIONS.map((conv, i) => (
            <div key={i} className={`chat chat-${conv.position}`}>
              {/* Show avatar, time, and message only if the message is visible */}
              {i <= currentMessageIndex && (
                <>
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img alt={conv.user} src={conv.avatar} />
                    </div>
                  </div>
                  <div className="chat-header">
                    {conv.user}
                    <time className="text-xs opacity-50"> {conv.time}</time>
                  </div>
                  <div className="chat-bubble">
                  {/* Show the message if it's visible */}
                  {i <= currentMessageIndex ? (
                    <div className="chat-message">{conv.message}</div>
                  ) : null}
                </div>
                </>
              )}
              
              <div className="chat-footer opacity-50">
                {i <= currentMessageIndex ? conv.status : ""}
              </div>
            </div>
          ))}
        </div>

        {/* Title and Subtitle */}
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/70">{subtitle}</p>
      </div>
    </div>
  );
};

export default AnimatedConversations;
