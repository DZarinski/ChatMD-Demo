import { Center, HStack, Text } from "native-base";
import React from "react";

function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <HStack
      space={3}
      px="5"
      py="5"
      bgColor={isUser ? "white" : "coolGray.100"}
      borderColor="gray.300"
      borderBottomWidth="1"
      w="100%"
    >
      <Center bgColor={isUser ? "gray.600" : "green.500"} w="7" h="7">
        <Text fontWeight="medium" color="white">
          {isUser ? "D" : "MD"}
        </Text>
      </Center>
      <Text fontSize="lg" flexShrink={1}>
        {content}
      </Text>
    </HStack>
  );
}

export default ChatMessage;
