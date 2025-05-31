import React, {useState, useEffect} from "react"
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
  Animated,
} from "react-native"

import { createClient } from 'pexels';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/Ionicons';

const WindowHeight = Dimensions.get('screen').height;
const WindowWidth = Dimensions.get('screen').width;

const pexelsClient = createClient('FaZpq1y99gwzypOpV9dj9E938PfFbYXFk1kFrdIEzJgMXsg3qMW0FqTU');

const WallpaperViewer = ({navigation, route}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadImage();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const loadImage = async () => {
    try {
      const photo = await pexelsClient.photos.show({ id: route.params.id });
      setImageUrl(photo.src.original);
    } catch (error) {
      console.error('Error loading image:', error);
      Alert.alert('Error', 'Failed to load image');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    try {
      setDownloading(true);
      const date = new Date();
      const ext = getExtension(imageUrl);
      const { config, fs } = RNFetchBlob;
      const PictureDir = fs.dirs.PictureDir;
      
      const options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: PictureDir + "/wallpaper_" + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
          description: 'Wallpaper'
        }
      };

      await config(options).fetch('GET', imageUrl);
      Alert.alert('Success', 'Wallpaper downloaded successfully!');
    } catch (error) {
      console.error('Error downloading:', error);
      Alert.alert('Error', 'Failed to download wallpaper');
    } finally {
      setDownloading(false);
    }
  };

  const getExtension = (filename) => {
    const ext = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    return ext ? '.' + ext[0] : '.jpg';
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      ) : (
        <Animated.View style={[styles.content, {opacity: fadeAnim}]}>
          <ImageBackground 
            source={{uri: imageUrl}} 
            style={styles.wallpaper}
            resizeMode="cover"
          >
            <SafeAreaView style={styles.overlay}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>

              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.actionButton, downloading && styles.actionButtonDisabled]}
                  onPress={downloadImage}
                  disabled={downloading}
                >
                  {downloading ? (
                    <ActivityIndicator size="small\" color="#FFF" />
                  ) : (
                    <>
                      <Icon name="download\" size={24} color="#FFF" />
                      <Text style={styles.actionText}>Download</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </Animated.View>
      )}
    </View>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wallpaper: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    marginTop: StatusBar.currentHeight + 10,
  },
  actions: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginVertical: 10,
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default WallpaperViewer;