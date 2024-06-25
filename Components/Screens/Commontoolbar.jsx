import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function CommonToolbar({ onCToggle, onCancel, onSelectAll, onDeleteMultiple, navigation }) {
  const [cText, setCText] = useState('C');
  const [sText, setSText] = useState('S');
  const [mText, setMText] = useState('M');
  const [isXEnabled, setIsXEnabled] = useState(false);

  const handleCPress = () => {
    if (cText === 'C') {
      setCText('A');
    }
    setSText('U');
    setMText('D');
    setIsXEnabled(true);
    onCToggle();
  };

  const handleXPress = () => {
    setCText('C');
    setSText('S');
    setMText('M');
    setIsXEnabled(false);
    if (onCancel) onCancel();
  };

  const handleAPress = () => {
    onSelectAll();
    if (cText === 'A') {
      setCText('U');
    } else if (cText === 'U') {
      setCText('A');
    }
  };

  const handleSPress = () => {
    navigation.navigate('SearchPage');
  };

  return (
    <View style={styles.viewStyle}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.touchableStyle}
          onPress={handleXPress}
          disabled={!isXEnabled}
        >
          <View style={[styles.textViewStyle, !isXEnabled && styles.disabledTextViewStyle]}>
            <Ionicons name="close" size={20} color={isXEnabled ? 'black' : 'white'} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={isXEnabled ? handleAPress : handleCPress} style={styles.touchableStyle}>
          <View style={styles.textViewStyle}>
            {cText === 'C' ? (
              <Ionicons name="checkbox" size={20} color="black" />
            ) : cText === 'A' ? (
              <MaterialCommunityIcons name="select-all" size={20} color="black" />
            ) : (
              <MaterialCommunityIcons name="select-remove" size={20} color="black" />
            )}
          </View>
        </TouchableOpacity>
        {sText !== 'U' && (
          <TouchableOpacity onPress={isXEnabled ? handleSPress : null} style={styles.touchableStyle}>
            <View style={styles.textViewStyle}>
              <Ionicons name="search" size={20} color="black" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.touchableStyle} onPress={onDeleteMultiple}>
          <View style={styles.textViewStyle}>
            <Ionicons name={mText === 'M' ? 'ellipsis-vertical' : 'trash-sharp'} size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 20,
  },
  leftSection: {
    width: '50%',
    marginLeft: 2,
  },
  rightSection: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textViewStyle: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  disabledTextViewStyle: {
    backgroundColor: 'white',
  },
  touchableStyle: {
    padding: 10,
  },
});
