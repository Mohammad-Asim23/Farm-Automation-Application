import React, { useState } from 'react';
import { View,Text,  TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import {Entypo} from '@expo/vector-icons';

const FloatingLabelInput = ({ label , iconName, isPassword, value, onChangeText }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChangeText = (text) => {
    setInputValue(text);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevIsPasswordVisible) => !prevIsPasswordVisible);
  };


  return (
    <View style={styles.container}
    >
      {!isFocused && inputValue === '' ? null : (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, isFocused ? styles.focusedLabel : null]}>{label}</Text>
        </View>
      )}
        <View style={[styles.inputContainer, isFocused && styles.focusedInputContainer]}>
        <Entypo name={iconName} size={12} color={isFocused ? '#333' : '#888'} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? '' : label}
          placeholderTextColor="#888"
          secureTextEntry={isPassword && !isPasswordVisible}
        />
       {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
            <Entypo name={isPasswordVisible ? 'eye' : 'eye-with-line'} size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom:15
  },
  inputContainer: {
    width:300,
    flexDirection: 'row',
    alignItems:'center',
    color:'white',
  },

  focusedInputContainer: {
    borderBottomColor: 'black',
    
  },

  icon: {
    marginRight: 8,
  },
  labelContainer: {
    position: 'absolute',
    top: -9,
    left:15,
    backgroundColor: 'white',
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  focusedLabel: {
    top: -10,
    fontSize: 16,
    color:'black',
    fontWeight: 600
  },
  input: {
    fontSize: 18,
    color: '#000',
    paddingTop:2,
    width:"100%"
  },
  iconContainer: {
    position: 'absolute',
    right: 8,
  },
});

export default FloatingLabelInput;
