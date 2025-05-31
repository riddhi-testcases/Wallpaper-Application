import React, {useState, useEffect} from "react"
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated
} from "react-native"

const WindowHeight = Dimensions.get('screen').height
const WindowWidth = Dimensions.get('screen').width
const ThumbnailWidth = WindowWidth-(0.6*WindowWidth)

import Icon from "react-native-vector-icons/Ionicons"
import Carousel from 'react-native-snap-carousel';
import { createClient } from 'pexels';

const pexelsClient = createClient('FaZpq1y99gwzypOpV9dj9E938PfFbYXFk1kFrdIEzJgMXsg3qMW0FqTU');

const GalleryScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredImages, setFeaturedImages] = useState([]);
  const [slideAnimation] = useState(new Animated.Value(-100));
  const [categories] = useState([
    {
      "title":"Nature",
      "img_url":"https://images.pexels.com/photos/2724664/pexels-photo-2724664.jpeg"
    },
    {
      "title":"Urban",
      "img_url":"https://images.pexels.com/photos/1462935/pexels-photo-1462935.jpeg"
    },
    {
      "title":"Space",
      "img_url":"https://images.pexels.com/photos/5439/earth-space.jpg"
    },
    {
      "title":"Abstract",
      "img_url":"https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg"
    },
    {
      "title":"Minimal",
      "img_url":"https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg"
    },
    {
      "title":"Dark",
      "img_url":"https://images.pexels.com/photos/1583207/pexels-photo-1583207.jpeg"
    }
  ]);

  useEffect(() => {
    loadFeaturedImages();
    animateHeader();
  }, []);

  const loadFeaturedImages = async () => {
    try {
      const response = await pexelsClient.photos.search({ query: 'Featured Wallpapers', per_page: 10 });
      setFeaturedImages(response.photos);
    } catch (error) {
      console.error('Error loading featured images:', error);
    }
  };

  const animateHeader = () => {
    Animated.spring(slideAnimation, {
      toValue: 0,
      useNativeDriver: true,
      speed: 0.2
    }).start();
  };

  const renderCategory = ({item}) => (
    <TouchableOpacity 
      style={styles.categoryCard} 
      onPress={() => navigation.navigate("CategoryView", { query: item.title })}
    >
      <ImageBackground 
        source={{uri: item.img_url}} 
        style={styles.categoryImage} 
        imageStyle={styles.categoryImageStyle}
      >
        <Text style={styles.categoryTitle}>{item.title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderFeaturedImage = ({item}) => (
    <TouchableOpacity 
      style={styles.featuredCard} 
      onPress={() => navigation.navigate("WallpaperViewer", { id: item.id })}
    >
      <Image 
        source={{uri: item.src.medium}} 
        style={styles.featuredImage}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      <View style={styles.content}>
        <ImageBackground
          source={{uri: "https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg"}} 
          style={styles.headerBackground}
          imageStyle={styles.headerBackgroundImage}>
          
          <Animated.View style={[styles.headerContent, {
            transform: [{translateX: slideAnimation}]
          }]}>
            <Text style={styles.headerTitle}>Discover Beautiful Wallpapers</Text>
            <Text style={styles.headerSubtitle}>Customize Your Device</Text>
          </Animated.View>

          <Animated.View style={[styles.searchContainer, {
            transform: [{translateX: slideAnimation}]
          }]}>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search wallpapers..." 
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => navigation.navigate("CategoryView", { query: searchQuery })}
            >
              <Icon name="search" color="#FFF" size={20}/>
            </TouchableOpacity>
          </Animated.View>
        </ImageBackground>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Collection</Text>
        </View>

        <View style={styles.featuredSection}>
          <Carousel
            data={featuredImages}
            renderItem={renderFeaturedImage}
            sliderWidth={WindowWidth}
            itemWidth={ThumbnailWidth}
            activeSlideAlignment="center"
            autoplay={true}
            loop={true}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
        </View>

        <View style={styles.categoriesSection}>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.title}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.categorySeparator} />}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  headerBackground: {
    height: WindowHeight * 0.3,
    justifyContent: 'center',
  },
  headerBackgroundImage: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  searchContainer: {
    height: '20%',
    width: '85%',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    marginTop: 20,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    paddingHorizontal: 15,
  },
  searchButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
  },
  featuredSection: {
    height: WindowHeight * 0.2,
  },
  featuredCard: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  featuredImage: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  categoriesSection: {
    height: WindowHeight * 0.25,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryCard: {
    height: '90%',
    width: ThumbnailWidth,
    borderRadius: 15,
    overflow: 'hidden',
  },
  categoryImage: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  categoryImageStyle: {
    borderRadius: 15,
  },
  categoryTitle: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
    margin: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  categorySeparator: {
    width: 15,
  },
});

export default GalleryScreen;