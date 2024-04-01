import React, {useState, useRef, memo, useMemo, useCallback} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

// interface CustomOTPInputProps {
//   length: number;
//   separator: string;
//   inputStyle?: React.CSSProperties;
//   onChangeOTP: (otp: string) => void;
// }
const CustomOTPInput = ({
  length,
  separator,
  onChangeOTP,
  style,
  inputStyle,
  title,
  error
}) => {
  console.log("🚀 ~ file: CustomOTPInput.js:23 ~ errors:", error)
  console.log(
    'ren render:',
    CustomOTPInput,
  );
  const [otp, setOTP] = useState(Array(length).fill(''));
  const inputsRef = useRef([]);

  const handleChangeText = useMemo(() => {
    return (text, index) => {
      let newOTP = [...otp];
      newOTP[index] = text;
      setOTP(newOTP);

      // Join all OTP digits with separator and pass them to onChangeOTP prop
      onChangeOTP(newOTP.join(separator));

      // Move to the next input field if available
      if (text.length === 1 && index < length - 1) {
        inputsRef.current[index + 1].focus();
      }
    };
  }, [otp, setOTP, onChangeOTP, separator, inputsRef, length]);

  const handleKeyPress = useCallback((e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  }, []);

  return (
    <>
          <Text style={{color: 'black'}}>{title}</Text>
    <View style={[styles.container, style, error ? {marginTop: responsiveHeight(2)} : {}]}>
      {Array(length)
        .fill()
        .map((_, inputIndex) => (
          <View key={inputIndex} style={styles.inputContainer}>
            <TextInput
              ref={input => (inputsRef.current[inputIndex] = input)}
              style={[styles.input, inputStyle]}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={text => handleChangeText(text, inputIndex)}
              onKeyPress={e => handleKeyPress(e, inputIndex)}
              value={otp[inputIndex]}
            />
            {inputIndex > 4
              ? null
              : (inputIndex + 1) % 2 === 0 &&
                inputIndex !== length - 1 && (
                  <Text
                    style={{
                      fontSize: 20,
                      marginHorizontal: separator ? 5 : 0,
                    }}>
                    {separator}
                  </Text>
                )}
          </View>
        ))}
    </View>
        {error &&  <Text style={styles.errorText}>{error}</Text>} 
    </>
  );
}
export default memo(CustomOTPInput);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Display inputs horizontally
    marginVertical: responsiveHeight(2)
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: responsiveWidth(9),
    height: responsiveHeight(6),
    textAlign: 'center',
    marginHorizontal: 0,
    color: 'black'
  },
  separator: {
    fontSize: 20,
    // marginHorizontal: 5,
  },
  errorText: {
    color: 'red',
    marginVertical: 5,
  },
});
