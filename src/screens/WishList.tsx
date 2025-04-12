import React, {useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import {WishListContext} from '../context/WishListContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WishList = ({navigation}) => {
  const {wishList, removeFromWishList} = useContext(WishListContext);

  const renderWishListItem = ({item}) => (
    <View style={styles.wishListItem}>
      <TouchableOpacity
        style={styles.productContainer}
        onPress={() => navigation.navigate('ProductDetail', {product: item})}>
        <Image source={{uri: item.image}} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromWishList(item.id)}>
        <Icon name="delete" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {wishList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="favorite-border" size={60} color="#ddd" />
          <Text style={styles.emptyText}>Your wish list is empty</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('ProductList')}>
            <Text style={styles.shopButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishList}
          renderItem={renderWishListItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default WishList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  wishListItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
});
