import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import CommonToolbar from './Commontoolbar';
import { Card } from '@rneui/themed';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ColorPicker } from 'react-native-color-picker';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import axios from 'axios';
import constants from '../utils/constants';
import CheckBox from '@react-native-community/checkbox';

const FolderList = ({ onLongPress, onDelete, folders, toggleCheckBox, setFolders }) => {
  const navigation = useNavigation();
  const [response, setResponse] =useState(); 

  console.log(folders)

  const handlePress = () => {
    navigation.navigate("FolderFiles");
  };

  const renderRightActions = () => (
    <View style={[styles.TouchableOpacity1, styles.deleteButton]}>
      <Text style={styles.TouchableOpacity1text}>Delete</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row' }}>
      {toggleCheckBox && (
        <CheckBox
          style={{ top: 50, marginLeft: 10, borderColor: 'black' }}
          disabled={false}
          value={item.isChecked}
          onValueChange={(newValue) => {
            setFolders((prevFolders) =>
              prevFolders.map((folder) =>
                folder._id === item._id ? { ...folder, isChecked: newValue } : folder
              )
            );
          }}
        />
      )}
      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableOpen={(direction) => {
          if (direction === 'right') {
            onDelete(item);
          }
        }}
      >
        <TouchableOpacity
          onPress={handlePress}
          onLongPress={() => onLongPress(item)}>
          <View style={styles.cardContainer}>
            <Card containerStyle={styles.card}>
              <View style={styles.cardContent}>
                <View style={{ width: '50%' }}>
                  <Text style={styles.folderText}>{item.text}</Text>
                </View>
              </View>
            </Card>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );

  return (
    <FlatList
      data={folders}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default function FolderScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState([]);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const getFolders = async () => {
    try {
      const response = await axios.get(`${constants.BASE_URL}${constants.getFolders}`);
      const fetchedFolders = response.data.folders.map(folder => ({ ...folder, isChecked: false }));
      setFolders(fetchedFolders);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  useEffect(() => {
    getFolders();
  },[]);

  const deleteFolder = async (folderId) => {
    try {
      const response = await axios.delete(`${constants.BASE_URL}${constants.deleteFolders}`, { data: { id: folderId._id } });
      if (response.data.status === 200) {
        setFolders(folders.filter(folder => folder._id !== folderId._id));
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const createFolder = async () => {
    if (folderName.trim().length === 0) {
      Alert.alert('Error', 'Folder name cannot be empty');
      return;
    }

    try {
      const response = await axios.post(`${constants.BASE_URL}${constants.setFolders}`, [{ text: folderName }]);
      if (response.data.status === 200) {
        getFolders();
        setModalVisible(false);
        setFolderName('');
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const updateFolderName = async (folderId) => {
    try {
      const response = await axios.patch(`${constants.BASE_URL}${constants.updateFolders}`, { id: folderId._id, updatedContent: { text: newFolderName } });
      if (response.data.status === 200) {
        getFolders();
        setRenameModalVisible(false);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error updating folder name:', error);
    }
  };

  const handleLongPress = (folder) => {
    setSelectedFolder(folder);
    setOptionsModalVisible(true);
  };

  const handleDeleteFolder = (folder) => {
    deleteFolder(folder);
  };

  const handleRenameFolder = () => {
    updateFolderName(selectedFolder);
  };

  const handleChangeColor = (newColor) => {
    setColorModalVisible(false);
    setOptionsModalVisible(false);
    setSelectedFolder(null);
  };

  const handleCToggle = () => {
    setToggleCheckBox(true);
    setSelectAll(false);
  };

  const handleCancel = () => {
    setToggleCheckBox(false);
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    setFolders((prevFolders) => {
      return prevFolders.map(item => ({ ...item, isChecked: newSelectAll }));
    });
  };

   const handleonDeleteMultiple = async () => {
    const selectedNotes = note.filter(item => item.isChecked);
    const noteIds = selectedNotes.map(note => note._id);
    const body = { ids: noteIds };
    axios.delete(`${constants.BASE_URL}${constants.deleteMultipleNotes}`, { data: body })
      .then((response) => {
        if (response.data.status === 200) {
          const filteredData = note.filter(note => !note.isChecked);
          setNotes(filteredData);
        } else {
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting notes:", error);
      });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <CommonToolbar
        onCToggle={handleCToggle}
        onCancel={handleCancel}
        onSelectAll={handleSelectAll}
        onDeleteMultiple={handleonDeleteMultiple} />
      <FolderList
        onLongPress={handleLongPress}
        onDelete={handleDeleteFolder}
        toggleCheckBox={toggleCheckBox}
        folders={folders}
        setFolders={setFolders} />
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => setModalVisible(true)}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create Folder</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter folder name"
              placeholderTextColor="#888"
              value={folderName}
              onChangeText={setFolderName}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.TouchableOpacity1}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.TouchableOpacity1text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.TouchableOpacity1}
                onPress={createFolder}
              >
                <Text style={styles.TouchableOpacity1text}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={optionsModalVisible}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Folder Options</Text>
            <TouchableOpacity
              style={styles.TouchableOpacity2}
              onPress={() => {
                setOptionsModalVisible(false);
                setRenameModalVisible(true);
              }}
            >
              <Text style={styles.TouchableOpacity1text}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.TouchableOpacity2}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Text style={styles.TouchableOpacity1text}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={renameModalVisible}
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Folder Options</Text>
            <TouchableOpacity
              style={styles.TouchableOpacity2}
              onPress={() => {
                setOptionsModalVisible(false);
                setRenameModalVisible(true);
              }}
            >
              <Text style={styles.TouchableOpacity1text}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.TouchableOpacity2}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Text style={styles.TouchableOpacity1text}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={renameModalVisible}
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Rename Folder</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new folder name"
              placeholderTextColor="#888"
              value={newFolderName}
              onChangeText={(text) => {
                setNewFolderName(text);
                setText(text);
              }}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.TouchableOpacity1}
                onPress={() => setRenameModalVisible(false)}
              >
                <Text style={styles.TouchableOpacity1text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.TouchableOpacity1}
                onPress={updateFolderName}
              >
                <Text style={styles.TouchableOpacity1text}>Rename</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={colorModalVisible}
        onRequestClose={() => setColorModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Folder Color</Text>
            <ColorPicker
              onColorSelected={(color) => handleChangeColor(color)}
              style={{ flex: 1, width: '100%' }}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.TouchableOpacity1}
                onPress={() => setColorModalVisible(false)}
              >
                <Text style={styles.TouchableOpacity1text}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    color:'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    color:"black",
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  TouchableOpacity1:{
    width:120,
    height:40,
    backgroundColor:'tomato',
    borderRadius:5
  },
  TouchableOpacity1text:{
    color:'white',
    fontSize:18,
    fontWeight:'400',
    alignSelf:'center',
    top:7
  },
  deleteButton:{
    backgroundColor:'red',
    top:40,
    height:80,
    width:'90%',
  },
  deleteButtontext:{
    alignSelf:'center',
  },
  TouchableOpacity2:{
    width:"100%",
    height:40,
    backgroundColor:'tomato',
    borderRadius:5,
    margin:2
  },
  touchabliopacitytext2:{
    fontSize:14,
    fontWeight:'600',
    top:10,
    alignSelf:'center'
  },
  folderText:{
    fontSize: 20,
    fontWeight: '800',
    color: 'black',
    alignItems: 'center',
  }
});



