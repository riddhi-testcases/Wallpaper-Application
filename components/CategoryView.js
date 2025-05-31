import React, {useState, useEffect} from "react"
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from "react-native"

const WindowHeight = Dimensions.get('screen').height
const WindowWidth = Dimensions.get('screen').width

import { createClient } from 'pexels';
import Icon from "react-native-vector-icons/Ionicons"

const pexelsClient = createClient('FaZpq1y99gwzypOpV9dj9E938PfFbYXFk1kFrdIEzJgMXsg3qMW0FqTU');

const CategoryView = ({navigation, route}) => {
  const [images, setImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const query = route.params.query;

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async (refresh = false) => {
    try {
      const currentPage = refresh ? 1 : page;
      const response = await pexelsClient.photos.search({ 
        query, 
        per_page: 20,
        page: currentPage
      });
      
      if (refresh) {
        setImages(response.photos);
      } else {
        setImages(prev => [...prev, ...response.photos]);
      }
      
      setPage(currentPage + 1);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadImages(true);
  };

  const renderImage = ({item}) => (
    <TouchableOpacity 
      style={styles.imageCard}
      onPress={() => navigation.navigate("WallpaperViewer", { id: item.id })}
    >
      <Image 
        source={{uri: item.src.medium}} 
        style={styles.image}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator 
          size="large" 
          color="#FFF" 
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={images}
          renderItem={renderImage}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor="#FFF"
            />
          }
          onEndReached={() => loadImages()}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: StatusBar.currentHeight,
  },
  backButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + 10,
    left: 15,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 10,
    paddingTop: 60,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageCard: {
    width: (WindowWidth - 30) / 2,
    height: WindowHeight * 0.3,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    flex: 1,
    alignSelf: 'center',
  },
});

export default CategoryView;