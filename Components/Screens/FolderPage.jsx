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
import { useNavigation, useRoute } from '@react-navigation/native';
import { ColorPicker } from 'react-native-color-picker';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import axios from 'axios';
import constants from '../utils/constants';
import CheckBox from '@react-native-community/checkbox';
import BottomSheet from './BottomSheet';

export var dataList = [];

const FoldersList = ({  onDelete, onLongPress, toggleCheckBox, data, setData, response}) => {

  const renderRightActions = () => (
    <View style={[styles.TouchableOpacity1, styles.deleteButton]}>
      <Text style={styles.TouchableOpacity1text}>Delete</Text>
    </View>
  );

  const navigation = useNavigation();

  const handlePress = (i) => {
    console.log(data[0].notes);
    navigation.navigate("FolderFiles", data[i].notes);
  };

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => (
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
              onPress={() => handlePress(index)}
              onLongPress={() => onLongPress(item)}
            >
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
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default function FolderScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState(dataList);
  const [response, setResponse] = useState();
  const [folder, setFolders] = useState();
  const [folders1, setFolders1] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [selectAll, setSelectAll] = useState();
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [text, setText] = useState('');


  const getFolders = async () => {
    try {
      const response = await axios.get(`${constants.BASE_URL}${constants.getFolders}`);
      const fetchedFolders = response.data.folders.map(folder => ({ ...folder, isChecked: false }));
      setFolders(fetchedFolders);

      setResponse(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getFolders();
    });
    return unsubscribe;
  }, [navigation, route.params]);

  const deleteFolders = async (folderId, item) => {
    var body = { id: folderId._id };


    axios.delete(`${constants.BASE_URL}${constants.deleteFolders}`, { data: body })
      .then((response) => {
        if (response.data.status === 200) {
          console.log(response.data)
          const filteredData = folders1.filter(folder => folder !== item);
          setFolders1(filteredData);
          deleteFolders()
        } else {
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting folder:", error);
      });
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

  const handleRenameFolder = () => {
    updateFolderName(selectedFolder);
  };


  const handleCToggle = () => {
    setToggleCheckBox(true);
    setSelectAll(!selectAll);
  };

  const handleCancel = () => {
    setToggleCheckBox(false);
    setSelectAll(false);
  };

  const handleDeleteFolder = (folder) => {
    deleteFolder(folder);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);

    if (selectAll) {
      setFolders((prevData) => {
        if (!Array.isArray(prevData)) {
          return [];
        }
      
       const updatedData = prevData.map(item => ({ ...item, isChecked: true }));
      
        return updatedData;
      });
    } else if (!selectAll) {
      setFolders((prevData) => {
        if (!Array.isArray(prevData)) {
          return [];
        }
      
        const updatedData = prevData.map(item => ({ ...item, isChecked: false }));
        return updatedData;
      });    }
  };

 
  const handleonDeleteMultiple = async () => {
    const selectedFolders = folder.filter(item => item.isChecked);
    const folderIds = selectedFolders.map(folder => folder._id);
    const body = { ids: folderIds };

    console.log(body)

    axios.delete(`${constants.BASE_URL}${constants.deleteMultipleFolders}`, { data: body })
      .then((response) => {
        if (response.data.status === 200) {
          const filteredData = folder.filter(folder => !folder.isChecked);
          setFolders(filteredData);
        } else {
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting folders:", error);
      });
  };


  return (
    <GestureHandlerRootView style={styles.container}>
      <CommonToolbar 
        onCToggle={handleCToggle} 
        onCancel={handleCancel} 
        onSelectAll={handleSelectAll} 
        onDeleteMultiple={handleonDeleteMultiple}
        setData={()=>{
          setFolders(folder)
        }} />
      <FoldersList   
        data={folder} 
        response = {response}
        toggleCheckBox={toggleCheckBox} 
        selectAll={selectAll} 
        onLongPress={handleLongPress}
        setData={(data)=>{
          setFolders(data)
        }} />
       <FAB
        style={styles.fab}
        small
        icon="pencil"
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
                onPress={handleRenameFolder}
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
    top:10
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
    borderRadius:100,
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