import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeBaseProvider } from "native-base";
import React from "react";
import Chat from "./screens/Chat";

// navigation stack
const Stack = createStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="ChatMD" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
