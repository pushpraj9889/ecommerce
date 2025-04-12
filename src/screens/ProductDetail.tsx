import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
// import {WishListContext} from '../context/WishListContext';
// import {WishListContext} from '../context/WishListContext';
import {WishListContext} from '../context/WishListContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Formik} from 'formik';
import * as Yup from 'yup';

const InquirySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  message: Yup.string()
    .min(10, 'Message is too short')
    .max(500, 'Message is too long')
    .required('Message is required'),
});

const ProductDetail = ({route, navigation}: any) => {
  const {product} = route.params;
  const {isProductInWishList, addToWishList, removeFromWishList} =
    useContext(WishListContext);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const toggleWishList = () => {
    if (isProductInWishList(product.id)) {
      removeFromWishList(product.id);
    } else {
      addToWishList(product);
    }
  };

  const handleInquirySubmit = (values, {resetForm}) => {
    // In a real app, this would send the inquiry to a backend
    Alert.alert(
      'Inquiry Sent',
      "Thank you for your inquiry. We'll get back to you soon!",
      [{text: 'OK'}],
    );
    resetForm();
    setShowInquiryForm(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{uri: product.image}} style={styles.productImage} />
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={toggleWishList}>
          <Icon
            name={
              isProductInWishList(product.id) ? 'favorite' : 'favorite-border'
            }
            size={30}
            color={isProductInWishList(product.id) ? '#FF6B6B' : '#666'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.productTitle}>{product.title}</Text>

        <View style={styles.priceRatingContainer}>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          {product.rating && (
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>
                {product.rating.rate.toFixed(1)} ({product.rating.count}{' '}
                reviews)
              </Text>
            </View>
          )}
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLabel}>Category: </Text>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{product.description}</Text>

        <TouchableOpacity
          style={styles.inquiryButton}
          onPress={() => setShowInquiryForm(!showInquiryForm)}>
          <Text style={styles.inquiryButtonText}>
            {showInquiryForm ? 'Hide Inquiry Form' : 'Ask About This Product'}
          </Text>
        </TouchableOpacity>

        {showInquiryForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Product Inquiry</Text>
            <Formik
              initialValues={{name: '', email: '', message: ''}}
              validationSchema={InquirySchema}
              onSubmit={handleInquirySubmit}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      placeholder="Your name"
                    />
                    {touched.name && errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      placeholder="Your email"
                      keyboardType="email-address"
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      onChangeText={handleChange('message')}
                      onBlur={handleBlur('message')}
                      value={values.message}
                      placeholder="Type your question about this product..."
                      multiline
                      numberOfLines={4}
                    />
                    {touched.message && errors.message && (
                      <Text style={styles.errorText}>{errors.message}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit Inquiry</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  imageContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  productImage: {
    width: '80%',
    height: 250,
    resizeMode: 'contain',
  },
  wishlistButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
  },
  detailsContainer: {
    padding: 20,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#666',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#666',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 20,
  },
  inquiryButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  inquiryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetail;
