import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MainNavigator from './src/Routes/MainNavigator';

export default function App() {
  return (
    <View style={{flex: 1}}>
      <MainNavigator />
    </View>
  );
}

const styles = StyleSheet.create({});
