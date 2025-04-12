import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import ProductList from '../screens/ProductList';
import ProductDetail from '../screens/ProductDetail';
import WishList from '../screens/WishList';
import {WishListProvider} from '../context/WishListContext';

export default function MainNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <WishListProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ProductList">
          <Stack.Screen
            name="ProductList"
            component={ProductList}
            options={{title: 'Products'}}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetail}
            options={{title: 'Product Details'}}
          />
          <Stack.Screen
            name="WishList"
            component={WishList}
            options={{title: 'Wish List'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </WishListProvider>
  );
}

const styles = StyleSheet.create({});
