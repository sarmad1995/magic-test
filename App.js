/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { Provider } from "react-redux";

import TrackDirection from "./src/components/TrackDirection";
import store from "./src/store/index";
import { DARK } from "./src/config";

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Provider store={store}>
        <SafeAreaView style={{ flex: 1, backgroundColor: DARK }}>
          <View style={styles.container}>
            <TrackDirection />
          </View>
        </SafeAreaView>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
