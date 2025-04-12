import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WishListContext = createContext();

export const WishListProvider = ({children}) => {
  const [wishList, setWishList] = useState([]);

  // Load wish list from storage on app start
  useEffect(() => {
    const loadWishList = async () => {
      try {
        const storedWishList = await AsyncStorage.getItem('wishList');
        if (storedWishList) {
          setWishList(JSON.parse(storedWishList));
        }
      } catch (error) {
        console.error('Failed to load wish list from storage', error);
      }
    };

    loadWishList();
  }, []);

  // Save wish list to storage whenever it changes
  useEffect(() => {
    const saveWishList = async () => {
      try {
        await AsyncStorage.setItem('wishList', JSON.stringify(wishList));
      } catch (error) {
        console.error('Failed to save wish list to storage', error);
      }
    };

    saveWishList();
  }, [wishList]);

  const addToWishList = product => {
    setWishList(prevWishList => {
      // Check if product is already in wishlist
      if (prevWishList.some(item => item.id === product.id)) {
        return prevWishList;
      }
      return [...prevWishList, product];
    });
  };

  const removeFromWishList = productId => {
    setWishList(prevWishList =>
      prevWishList.filter(product => product.id !== productId),
    );
  };

  const isProductInWishList = productId => {
    return wishList.some(product => product.id === productId);
  };

  return (
    <WishListContext.Provider
      value={{
        wishList,
        addToWishList,
        removeFromWishList,
        isProductInWishList,
      }}>
      {children}
    </WishListContext.Provider>
  );
};
