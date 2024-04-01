import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import xml2js from 'react-native-xml2js';
import axios, {all} from 'axios';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import SignatureScreen from 'react-native-signature-canvas';
import RadioGroup from 'react-native-radio-buttons-group';
const CustomOTPInput = React.lazy(() => import('../components/CustomOTPInput'));

function findAllValuesByKey(obj, keyToFind, values = []) {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        findAllValuesByKey(obj[i], keyToFind, values);
      }
    } else {
      for (const key in obj) {
        if (key === keyToFind) {
          values.push(obj[key]);
        }
        findAllValuesByKey(obj[key], keyToFind, values);
      }
    }
  }
  return values;
}

const Form = ({route}) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const {fromFirstBtn} = route.params;
  const [fromXmlFileValues, setFromXmlFileValues] = useState([]);
  const signatureRef = useRef(null);

  const [inputValues, setInputValues] = useState({
    customerName: '',
    forename: '',
    date: '',
    signature: '',
    radio1: '',
    radio2: '',
    radio3: '',
  });
  const [errors, setErrors] = useState({});

  const [inputTitles, setInputTitles] = useState({
    customerName: '',
    forename: '',
    date: '',
    signature: '',
    radio1: '',
    radio2: '',
    radio3: '',
  });

  useEffect(() => {
    if (fromXmlFileValues?.length && fromFirstBtn) {
      setInputTitles(prevState => ({
        ...prevState,
        customerName: fromXmlFileValues[0],
        forename: fromXmlFileValues[1],
        date: fromXmlFileValues[2],
        signature: fromXmlFileValues[3],
        radio1: fromXmlFileValues[4],
        radio2: fromXmlFileValues[5],
        radio3: fromXmlFileValues[6],
      }));
    }
  }, [fromXmlFileValues, fromFirstBtn]);

  const validateForm = () => {
    let newErrors = {};
    if (!inputValues.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!inputValues.forename.trim()) {
      newErrors.forename = 'Forename is required';
    }
    if (!inputValues.date.trim()) {
      newErrors.date = 'Date is required';
    }
    if (!inputValues.signature.trim()) {
      newErrors.signature = 'Signature is required';
    }
    if (!inputValues.radio1.trim() && !inputValues.radio2.trim() && !inputValues.radio3.trim()) {
      newErrors.radio1 = 'Radio option is required';
    }
    setErrors(newErrors);
    console.log("🚀 ~ file: Form.js:123 ~ validateForm ~ newErrors:", newErrors)
    return Object.keys(newErrors).length === 0;
  }

  const handleOTPChange = useCallback(
    (value, type) => {
      setInputValues(prevState => ({
        ...prevState,
        [type]: value,
      }));
    },
    [],
  );

  const handleFileRender = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://drive.google.com/uc?export=download&id=1aJ0fxnY2Hc417jEHyAwrndv4aPoyGMtV',
      );
      const xmlContent = response.data;
      parseAndRenderForm(xmlContent);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch XML data.');
    } finally {
      setLoading(false);
    }
  };

  const parseAndRenderForm = async xmlContent => {
    try {
      const parser = new xml2js.Parser();
      parser.parseString(xmlContent, async (err, result) => {
        if (err) {
          Alert.alert('Error', 'Failed to parse XML content.');
        } else {
          const keyToFind = 'fdtFieldName';
          const allValues = await findAllValuesByKey(result, keyToFind);
          setFromXmlFileValues(allValues);
          console.log('allValues', allValues);
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to parse XML content.');
    }
  };

  const renderFormFromInput = async () => {
    const xmlInput = `
        <form>
          <input type="text" name="firstName" label="First Name" />
          <input type="text" name="lastName" label="Last Name" />
          <button type="submit">Submit</button>
        </form>
      `;
    const parser = new xml2js.Parser();
    parser.parseString(xmlInput, (err, result) => {
      if (err) {
        Alert.alert('Error', 'Failed to render form from XML input.');
      } else {
        setFormData(result);
      }
    });
  };

  const [otpValue, setOTPValue] = useState('');

  const radioButtons = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: inputTitles.radio1 || 'Loading',
        value: inputValues.radio1,
      },
      {
        id: '2',
        label: inputTitles.radio2 || 'Loading',
        value: inputValues.radio2,
      },
      {
        id: '3',
        label: inputTitles.radio3 || 'Loading',
        value: inputValues.radio3,
      },
    ],
    [inputTitles],
  );

  const inputStyle = useMemo(
    () => ({
      // Your styles here
      marginHorizontal: 0,
    }),
    [],
  );

  useEffect(() => {
    if (fromFirstBtn) {
      handleFileRender();
    }
  }, []);

  const [selectedId, setSelectedId] = useState();

  const [signature, setSignature] = useState('');

  const handleSave = signature => {
    setInputValues(prevState => ({
        ...prevState,
        signature,
      }));
  };

  const handleClear = () => {
    setSignature('');
  };
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
        <ScrollView scrollEnabled={scrollEnabled} style={{flex: 1}}>
      <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flex: 0.6}}>
          <Suspense fallback={<Text>Loading...</Text>}>
            <CustomOTPInput
              length={5}
              separator={''}
              inputStyle={inputStyle}
              onChangeOTP={value => handleOTPChange(value, 'customerName')}
              parentOTPValue={inputValues.customerName}
              title={inputTitles.customerName || 'Loading...'}
              error={errors?.customerName}
            />
          </Suspense>
          <Suspense fallback={<Text>Loading...</Text>}>
            <CustomOTPInput
              length={5}
              separator={''}
              inputStyle={inputStyle}
              onChangeOTP={value => handleOTPChange(value, 'forename')}
              parentOTPValue={inputValues.forename}
              title={inputTitles.forename || 'Loading...'}
              error={errors?.forename}
            />
          </Suspense>
          <Suspense fallback={<Text>Loading...</Text>}>
            <CustomOTPInput
              length={8}
              separator={'/'}
              inputStyle={inputStyle}
              onChangeOTP={value => handleOTPChange(value, 'date')}
              parentOTPValue={inputValues.date}
              title={inputTitles.date || 'Loading...'}
              error={errors?.date}
            />
          </Suspense>
        </View>
        <View style={{flex: 0.3}}>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={setSelectedId}
            selectedId={selectedId}
            containerStyle={{alignItems: 'flex-start', flex: 1}}
            labelStyle={{color: 'black'}}
            />
            {errors &&  <Text style={[styles.errorText, {position: 'absolute', top: responsiveHeight(16)}]}>{errors?.radio1 || errors?.radio2 || errors?.radio3}</Text>} 
        </View>
      </View>
      <Text style={{marginVertical: responsiveHeight(2), color: 'black'}}>
        {inputTitles.signature}
      </Text>
      <SignatureScreen
        ref={signatureRef}
        onOK={handleSave}
        onEmpty={handleClear}
        onBegin={() => setScrollEnabled(false)} // Disable scrolling on signature begin
        onEnd={() => setScrollEnabled(true)}
        autoClear={true}
        saveImageFileInExtStorage={false}
        showNativeButtons={false}
        showTitleLabel={false}
        backgroundColor="#fff"
        title="Please sign"
        style={{flex: 1, height: responsiveHeight(errors?.signature ?  60: 70)}}
        subTitle="Sign your name here"
        clearText="Clear"
        confirmText="Save"
      />
        {errors &&  <Text style={styles.errorText}>{errors?.signature}</Text>} 
      <Button title="Submit" onPress={validateForm} />
    </View>
    </ScrollView>
  );
};
export default Form;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  formTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginVertical: 5,
  },
});
