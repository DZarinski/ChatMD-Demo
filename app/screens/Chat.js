import { Feather } from "@expo/vector-icons";
import { FlatList, Icon, Input, Pressable, VStack } from "native-base";
import React, { useState } from "react";
import ChatMessage from "../components/ChatMessage";

const introduction = {
  role: "assistant",
  content: "Hello! How can I assist you with your medical questions today?",
};

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([introduction]);
  const [loading, setLoading] = React.useState(false);

  return (
    <VStack
      bgColor="white"
      pb="10"
      space={4}
      alignItems="center"
      h="100%"
      w="100%"
    >
      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatMessage {...item} />}
        keyExtractor={(_, index) => index}
        pt="3"
        w="100%"
      />
      <Input
        w="82%"
        size="md"
        placeholder="Send a message..."
        value={message}
        onChangeText={setMessage}
        InputRightElement={
          <Pressable onPress={() => console.log({ message })}>
            <Icon
              as={<Feather name="send" size={24} />}
              size={5}
              mr="2"
              color={message && !loading ? "muted.800" : "muted.400"}
            />
          </Pressable>
        }
      />
    </VStack>
  );
}

export default Chat;
