import React from "react";
import { View, ActivityIndicator } from "react-native";
import { DARK } from "../../config";

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={DARK} />
    </View>
  );
};
export default Loading;
