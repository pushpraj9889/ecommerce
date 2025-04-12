import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {WishListContext} from '../context/WishListContext';

import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const ProductList = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  const {isProductInWishList, addToWishList, removeFromWishList} =
    useContext(WishListContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, priceFilter, ratingFilter, products]);

  const filterProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        product =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply price filter
    if (priceFilter !== 'all') {
      if (priceFilter === 'under25') {
        filtered = filtered.filter(product => product.price < 25);
      } else if (priceFilter === '25to100') {
        filtered = filtered.filter(
          product => product.price >= 25 && product.price <= 100,
        );
      } else if (priceFilter === 'over100') {
        filtered = filtered.filter(product => product.price > 100);
      }
    }

    // Apply rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(
        product => product.rating && product.rating.rate >= minRating,
      );
    }

    setFilteredProducts(filtered);
  };

  const toggleWishList = product => {
    if (isProductInWishList(product.id)) {
      removeFromWishList(product.id);
    } else {
      addToWishList(product);
    }
  };

  const renderProduct = ({item}) => {
    const inWishList = isProductInWishList(item.id);

    return (
      <View style={styles.productCard}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetail', {product: item})}>
          <Image source={{uri: item.image}} style={styles.productImage} />
          <Text style={styles.productTitle} numberOfLines={1}>
            {item?.title}
          </Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {item.rating.rate.toFixed(1)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => toggleWishList(item)}>
          <Icon
            name={inWishList ? 'favorite' : 'favorite-border'}
            size={24}
            color={inWishList ? '#FF6B6B' : '#666'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={24}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}>
          <Icon name="filter-list" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wishListButton}
          onPress={() => navigation.navigate('WishList')}>
          <Icon name="favorite" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Price:</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  priceFilter === 'all' && styles.selectedFilter,
                ]}
                onPress={() => setPriceFilter('all')}>
                <Text
                  style={
                    priceFilter === 'all' ? styles.selectedFilterText : {}
                  }>
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  priceFilter === 'under25' && styles.selectedFilter,
                ]}
                onPress={() => setPriceFilter('under25')}>
                <Text
                  style={
                    priceFilter === 'under25' ? styles.selectedFilterText : {}
                  }>
                  Under $25
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  priceFilter === '25to100' && styles.selectedFilter,
                ]}
                onPress={() => setPriceFilter('25to100')}>
                <Text
                  style={
                    priceFilter === '25to100' ? styles.selectedFilterText : {}
                  }>
                  $25 - $100
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  priceFilter === 'over100' && styles.selectedFilter,
                ]}
                onPress={() => setPriceFilter('over100')}>
                <Text
                  style={
                    priceFilter === 'over100' ? styles.selectedFilterText : {}
                  }>
                  Over $100
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Rating:</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  ratingFilter === 'all' && styles.selectedFilter,
                ]}
                onPress={() => setRatingFilter('all')}>
                <Text
                  style={
                    ratingFilter === 'all' ? styles.selectedFilterText : {}
                  }>
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  ratingFilter === '4' && styles.selectedFilter,
                ]}
                onPress={() => setRatingFilter('4')}>
                <Text
                  style={ratingFilter === '4' ? styles.selectedFilterText : {}}>
                  4★ & Up
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  ratingFilter === '3' && styles.selectedFilter,
                ]}
                onPress={() => setRatingFilter('3')}>
                <Text
                  style={ratingFilter === '3' ? styles.selectedFilterText : {}}>
                  3★ & Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No products found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  filterButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  wishListButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterSection: {
    marginBottom: 10,
  },
  filterTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilter: {
    backgroundColor: '#007bff',
  },
  selectedFilterText: {
    color: 'white',
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  wishlistButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ProductList;
