import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import constants from '../utils/constants';

const TextPage = ({ route }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [text1, setText1] = useState();
  const [time, setTime] = useState();
  const [currentDateTime, setCurrentDateTime] = useState({
    day: '',
    date: '',
    time: ''
  });

  const textData = async()=>{
    try {
      var body = [{
        text: text1,
        time: `${currentDateTime.date} ${currentDateTime.time}`
      }];
      console.log(body);
    
      const response = await axios.post(`${constants.BASE_URL}${constants.setNotes}`, body);
      
      console.log(response.data);
      
      if (response.data.status === 200) {
        console.log(response.data);
        navigation.goBack();
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }



  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const day = daysOfWeek[date.getDay()];

      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;

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

  const handleTextChange = (inputText) => {
    setText(inputText);
  };

  const navigation = useNavigation();

  const handleFinishButtonClick = () => {
  
    const firstLine = text.split('\n')[0]; 

    navigation.navigate('NotesPage', {
      newNote: {
        text: firstLine,
        date: currentDateTime.date,
      },
    });
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.viewStyle}>
        <View style={{width: '50%'}}>
          <TouchableOpacity  style={{margin: 20}}>
            <Text style={styles.backButtonStyle}>Back</Text>
          </TouchableOpacity>
        </View>
         <View style={{width: '50%'}}>
          <TouchableOpacity
            onPress={() => {
              handleFinishButtonClick();
              textData();
            }}
            style={styles.button}
            disabled={!isFocused}
          >
            <Text style={[styles.buttonText, isFocused ? styles.buttonEnabled : styles.buttonDisabled]}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.titleText}>Title</Text>
      <Text style={styles.datatimeText}>
        {currentDateTime.day}, {currentDateTime.date}  at {currentDateTime.time} | {text.length} characters
      </Text>
      <View style={styles.textInput}>
        <TextInput
          style={{
            padding: 10,
            color: 'black'
          }}
          multiline
          value={text}
          onChangeText={(text) => {
            handleTextChange(text);
            setText1(text);
          }}
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
  backButtonStyle:{ 
    color: 'black',
    fontSize:16 
  },
  titleText:{ 
    fontSize: 30, 
    marginLeft: 20, 
    color: 'grey' 
  },
  datatimeText:{ 
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
  },
});


export default TextPage;
