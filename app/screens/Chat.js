import { Feather } from "@expo/vector-icons";
import { Box, Icon, Input, Pressable, ScrollView, VStack } from "native-base";
import React, { useState } from "react";
import { Keyboard } from "react-native";
import EventSource from "react-native-sse";
import ChatMessage from "../components/ChatMessage";

const introduction = {
  role: "assistant",
  content: "Hello! How can I assist you with your medical questions today?",
};

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([introduction]);
  const [loading, setLoading] = React.useState(false);
  let scrollRef = React.useRef(null);

  function sendMessage() {
    // method to handle new messages

    // update states
    setLoading(true);
    setMessage("");
    const newMessages = [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ];
    setMessages(newMessages);

    // hide keyboard
    Keyboard.dismiss();

    // EventSource for SSE
    const options = {
      method: "POST",
      timeout: 5000, // Time after which the connection will expire without any activity: Default: 0 (no timeout)
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messeges: newMessages.slice(0, -1) }),
    };
    const es = new EventSource("http://10.0.2.2:3000/chat", options);

    // handle open
    es.addEventListener("open", () => {});

    // handle messages
    es.addEventListener("message", (event) => {
      // if stream done, close
      if (event.data === "[DONE]") {
        es.close();
        return;
      }

      // parse response and update data
      const data = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: prev.at(-1).content.concat(data.content),
        },
      ]);

      scrollRef.current?.scrollToEnd({ animated: false });
    });

    // handle error
    es.addEventListener("error", (event) => {
      console.log(event);
      if (event.type === "error") {
        console.error("Connection error:", event.message);
      } else if (event.type === "exception") {
        console.error("Error:", event.message, event.error);
      }

      // close on error
      es.close();
    });

    // handle close
    es.addEventListener("close", () => {
      es.removeAllEventListeners();
      setLoading(false);
    });
  }

  return (
    <VStack bgColor="white" alignItems="center" h="100%" w="100%">
      <ScrollView
        w="100%"
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: false })
        }
        onLayout={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((item, i) => (
          <ChatMessage {...item} key={i} />
        ))}
      </ScrollView>
      <Box py="3">
        <Input
          w="85%"
          size="md"
          placeholder="Send a message..."
          value={message}
          onChangeText={setMessage}
          InputRightElement={
            <Pressable onPress={sendMessage} isDisabled={loading || !message}>
              <Icon
                as={<Feather name="send" size={24} />}
                size={5}
                mr="2"
                color={message && !loading ? "muted.800" : "muted.400"}
              />
            </Pressable>
          }
        />
      </Box>
    </VStack>
  );
}

export default Chat;
