import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import constants from '../utils/constants';

const UpdatePage = ({ route }) => {
  const { id } = route.params;
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [time, setTime] = useState();
  const [currentDateTime, setCurrentDateTime] = useState({
    day: '',
    date: '',
    time: ''
  });

  useEffect(() => {

    console.log(route.params.id)

    const updateDateTime = () => {
      const date = new Date();
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const day = daysOfWeek[date.getDay()];

      const formattedDate = `${date.getMonth() + 1}-${date.getDate()}`;

      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setCurrentDateTime({
        day: day,
        date: formattedDate,
        time: formattedTime
      });
    };

    updateDateTime();

    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const textData = async () => {
    try {
      const body = {
        id: id,
        updatedContent: {
          text: text,
          date: currentDateTime.date,
          time: currentDateTime.time,
        }
      };

      console.log(body)

      const response = await axios.patch(`${constants.BASE_URL}${constants.updateNotes}`, body);

      if (response.data.status === 200) {
        console.log(response.data);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleTextChange = (inputText) => {
    setText(inputText);
  };

  const navigation = useNavigation();

  const handleFinishButtonClick = () => {
    const firstLine = text.split('\n')[0]; 

    textData();

    navigation.navigate('Notes', {
      newNote: {
        text: firstLine,
        date: currentDateTime.date,
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.viewStyle}>
        <View style={{width: '50%'}}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ margin: 20 }}>
            <Text style={{ color: 'black', fontSize: 16 }}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '50%'}}>
          <TouchableOpacity
            onPress={handleFinishButtonClick}
            style={styles.button}
            disabled={!isFocused}
          >
            <Text style={[styles.buttonText, isFocused ? styles.buttonEnabled : styles.buttonDisabled]}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.titleText}>Title</Text>
      <Text style={styles.textStyle}>
        {currentDateTime.day}, {currentDateTime.date} at {currentDateTime.time} | {text.length} characters
      </Text>
      <View style={styles.textInput}>
        <TextInput
          style={{
            padding: 10,
            color: 'black'
          }}
          multiline
          value={text}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle:{ 
    height: 80, 
    width: '100%', 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  button: {
    alignItems: 'center',
    marginLeft: 100,
    padding: 10,
    borderRadius: 5,
  },
  buttonEnabled: {
    color: 'black',
  },
  buttonDisabled: {
    color: 'gray',
  },
  buttonText: {
    fontSize: 16,
  },
  titleText:{ 
    fontSize: 30, 
    marginLeft: 20, 
    color: 'grey' 
  },
  textStyle:{ 
    fontSize: 15, 
    marginLeft: 20, 
    top: 10, 
    color: 'grey' 
  },
  textInput:{ 
    width: "95%", 
    top: 20, 
    alignSelf: 'center', 
    flex: 0.920 
  }
});

export default UpdatePage;
