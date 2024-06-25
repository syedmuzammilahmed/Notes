import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, Animated, FlatList } from 'react-native';
import { Card } from '@rneui/themed';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import constants from '../utils/constants';
import axios from 'axios';

const BottomSheet = ({ isVisible, onClose, onSelectFolder }) => {
  const translateY = useRef(new Animated.Value(600)).current;
  const navigation = useNavigation();
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    if (isVisible) {
      axios.get(`${constants.BASE_URL}${constants.getFolders}`)
        .then((response) => {
          if (response.data.status === 200) {
            setFolders(response.data.folders);
          } else {
            console.log(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching folders:", error);
        });
    }
  }, [isVisible]);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isVisible ? 0 : 600,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
        onSelectFolder(item._id);
        onClose(); // Close the bottom sheet after selecting a folder
      }}>
      <View style={{ height: 50, width: '100%', justifyContent: 'center', top: 3 }}>
        <Text style={styles.folderText}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View style={[styles.content, { transform: [{ translateY }] }]}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.contentTitle}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={folders}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </Animated.View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 22,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 12,
  },
  contentTitle: {
    fontSize: 20,
    color: 'black',
  },
  folderText: {
    fontSize: 20,
    fontWeight: '800',
    color: 'black',
    alignItems: 'center',
  },
});

export default BottomSheet;
