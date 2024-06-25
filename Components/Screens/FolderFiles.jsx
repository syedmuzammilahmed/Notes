import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
import CommonToolbar from './Commontoolbar';
import { Card } from '@rneui/themed';
import { FAB } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import axios from 'axios';
import constants from '../utils/constants';
import { apiGetNotes } from '../utils/api';
import CheckBox from '@react-native-community/checkbox';
import BottomSheet from './BottomSheet';

export var dataList = [];

const NotesList = ({  onDelete, onLongPress, toggleCheckBox, data, setData}) => {


  const renderRightActions = () => (
    <View style={[styles.TouchableOpacity1, styles.deleteButton]}>
      <Text style={styles.TouchableOpacity1text}>Delete</Text>
    </View>
  );

  const navigation = useNavigation();

  const handlePress = (noteId) => {
    navigation.navigate('UpdatePage', { id: noteId });
  };

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row' }}>
          {toggleCheckBox && (
            <CheckBox
              style={{ top: 50, marginLeft: 10, borderColor:'black' }}
              disabled={false}
              value={item.isChecked}
              onValueChange={(newValue) => {
                setData((prevData) =>
                  prevData.map((dataItem) =>
                    dataItem._id === item._id ? { ...dataItem, isChecked: newValue } : dataItem
                  )
                );
                console.log(item)
              }}
            />
          )}
          <Swipeable
            renderRightActions={renderRightActions}
            onSwipeableOpen={(direction) => {
              if (direction === 'right') {
                onDelete(item);
                const index = dataList.indexOf(item);
                if (index !== -1) dataList.splice(index, 1);
              }
            }}
          >
            <TouchableOpacity
              onPress={() => handlePress(item._id)}
              onLongPress={() => onLongPress(item)}
            >
              <View style={styles.cardContainer}>
                <Card containerStyle={styles.card}>
                  <View style={styles.cardContent}>
                    <View style={{ width: '50%' }}>
                      <Text style={styles.folderText}>{item.text}</Text>
                      <Text style={styles.folderTime}>{item.time}</Text>
                    </View>
                  </View>
                </Card>
              </View>
            </TouchableOpacity>
          </Swipeable>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};
 
export default function FolderFiles({route}) {
  const navigation = useNavigation();
  // const route = useRoute();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const toggleBottomSheet = () => {
    setBottomSheetVisible(!bottomSheetVisible);
  };

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const getData = async () => {

    // console.log(route.params)
    // const resp = await apiGetNotes();
    // if (resp.data.status === 200) {
      setNotes(route.params);
    // } else {
    //   console.log(resp.data);
    // }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation, route.params]);

  const deleteNote = async (noteId) => {
    try {
      const response = await axios.delete(`${constants.BASE_URL}${constants.deleteNotes}`, { data: { id: noteId } });
      if (response.data.status === 200) {
        setNotes((prevNotes) => prevNotes.filter(note => note._id !== noteId));
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleLongPress = (item) => {
    setSelectedNote(item._id);
    console.log(item)
    setModalVisible(true);
  };

  const moveToFolder = async (folderId) => {
    // const selectedNotes = notes.filter(note => note.isChecked);
    const noteIds = [selectedNote];
    // console.log('Selected Notes:', selectedNotes); 
    console.log('Folder ID:', folderId); 
    try {
      console.log( {
        notes: noteIds,
        folderId: folderId,
        
      })
      const response = await axios.post(`${constants.BASE_URL}${constants.moveNoteToFolder}`, {
        notes: noteIds,
        folderId: folderId,
        
      });
    
      console.log(folderId)
      if (response.data.status === 200) {
        getData(); 
        toggleBottomSheet();
        console.log(response.data.message, "Notes moved successfully");
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error moving notes to folder:', error);
    }
  };

  const handleModalOptionPress = (option, folderId) => {
    setModalVisible(false);
    switch (option) {
      case 'Encrypt':
        // Encryption logic here
        break;
      case 'Move to folder':
        moveToFolder(folderId);
        break;
      case 'Pin to top':
        // Pin to top logic here
        break;
      default:
        break;
    }
  };

  const handleToggleCheckBox = () => {
    setToggleCheckBox(true);
    setSelectAll(!selectAll);
  };

  const handleCancel = () => {
    setToggleCheckBox(false);
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setNotes((prevNotes) => prevNotes.map(note => ({ ...note, isChecked: !selectAll })));
  };

  const handleDeleteMultiple = async () => {
    const selectedNotes = notes.filter(note => note.isChecked);
    const noteIds = selectedNotes.map(note => note._id);
    try {
      const response = await axios.delete(`${constants.BASE_URL}${constants.deleteMultipleNotes}`, { data: { ids: noteIds } });
      if (response.data.status === 200) {
        setNotes((prevNotes) => prevNotes.filter(note => !note.isChecked));
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting notes:", error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <CommonToolbar 
        onCToggle={handleToggleCheckBox} 
        onCancel={handleCancel} 
        onSelectAll={handleSelectAll} 
        onDeleteMultiple={handleDeleteMultiple}
        setData={() => setNotes(notes)} 
      />
      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row' }}>
            {toggleCheckBox && (
              <CheckBox
                style={styles.checkBox}
                disabled={false}
                value={item.isChecked}
                onValueChange={(newValue) => {
                  setNotes((prevNotes) =>
                    prevNotes.map((note) =>
                      note._id === item._id ? { ...note, isChecked: newValue } : note
                    )
                  );
                }}
              />
            )}
            <Swipeable
              renderRightActions={() => (
                <View style={[styles.TouchableOpacity1, styles.deleteButton]}>
                  <Text style={styles.TouchableOpacity1text}>Delete</Text>
                </View>
              )}
              onSwipeableOpen={(direction) => {
                if (direction === 'right') {
                  deleteNote(item._id);
                }
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('UpdatePage', { id: item._id })}
                onLongPress={() => handleLongPress(item)}
              >
                <View style={styles.cardContainer}>
                  <Card containerStyle={styles.card}>
                    <View style={styles.cardContent}>
                      <View style={{ width: '50%' }}>
                        <Text style={styles.folderText}>{item.text}</Text>
                        <Text style={styles.folderTime}>{item.time}</Text>
                      </View>
                    </View>
                  </Card>
                </View>
              </TouchableOpacity>
            </Swipeable>
          </View>
        )}
        keyExtractor={(item) => item._id.toString()}
      />
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => navigation.push('TextPage')}
      />
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Options</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleModalOptionPress('Encrypt')}
              >
                <Text style={styles.modalButtonText}>Encrypt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  setBottomSheetVisible(true);
                }}
              >
                <Text style={styles.modalButtonText}>Move to Folder</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleModalOptionPress('Pin to top')}
              >
                <Text style={styles.modalButtonText}>Pin to top</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <BottomSheet isVisible={bottomSheetVisible} onClose={toggleBottomSheet} onSelectFolder={(folderId) => handleModalOptionPress('Move to folder', folderId)} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  cardContainer: {
    marginVertical: 10,
  },
  card: {
    height: 80,
    width: 360,
    borderRadius: 12,
    flexDirection:'column',
    justifyContent:'center'
  },
  cardContent: {
    flexDirection:'row',
    width:'100%',
    alignItems:"center",
    height:80
  },
  fab: {
    position: 'absolute',
    right: 26,
    bottom: 50,
    backgroundColor: 'tomato',
  },
  TouchableOpacity1: {
    width: 90,
    height: 40,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  TouchableOpacity1text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
    alignSelf: 'center',
    top: 7,
  },
  deleteButton: {
    backgroundColor: 'red',
    top: 29,
    height: 75,
    width: '90%',
  },
  folderText: {
    fontSize: 20,
    fontWeight: '800',
    color: 'black',
    alignItems: 'center',
  },
  folderTime: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: 'black',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: 'tomato',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
  },
});