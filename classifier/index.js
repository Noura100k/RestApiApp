import { StatusBar } from 'expo-status-bar';
import React, { useRef,useState } from "react";
import { StyleSheet, View, Button,TouchableOpacity,Text ,Image} from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Exam_letter({ onOK,text }) {

  const ref = useRef();
   state = {
    uploading: false,
    image:'',
  }


 


  const handleOK = async (signature) => {
    const path = FileSystem.documentDirectory + "sign.png"; 
    FileSystem.writeAsStringAsync(
    path,
    signature.replace("data:image/png;base64,", ""),
    { encoding: FileSystem.EncodingType.Base64 }
  )
    .then(() => uploadImageAsync(path))
    .then(console.log(path),res => res.json())
    .catch(console.error);    //onOK(signature);
    
}

const uploadImageAsync =  (uri) => {
    
  let apiUrl = '/classify';

  let formData = new FormData();
  formData.append('photo', {
    uri,
    name: `photo.png`,
    type: `image/png`,
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
     
      'Content-Type': 'multipart/form-data',
    },
  };
  return fetch(apiUrl, options);
}


  //assign signature to ref
  const handleConfirm = () => {
    console.log("end");
    ref.current.readSignature();

  };

  const imgWidth = 300;
  const imgHeight = 300;
  const style = `.m-signature-pad {box-shadow: none; border: none; } 
  .m-signature-pad--body {border: none;}
  .m-signature-pad--footer {display: none; margin: 0px;}
  body,html {
  width: ${imgWidth}px; height: ${imgHeight}px;}`; 
   return (
    <View style={styles.container}>

      
 <View style={{width : imgWidth, height: imgHeight }}>
  <SignatureScreen
    ref={ref}
    bgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFq-uwQ1be8k03yZTxhVhyA5XtwoSI-rBMDQ&usqp=CAU"
    bgWidth={imgWidth}
    bgHeight={imgHeight}
    webStyle={style}
    onOK={handleOK}
    onEmpty={() => console.log("empty")}
  />

  
</View>
    <View style={styles.row}>
   <TouchableOpacity onPress={handleConfirm}>
   <Ionicons name="happy-outline"  size={40} color="#FFC917"/>
   <Text>Confirm</Text>
</TouchableOpacity>
    </View>


  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    padding: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginVertical: 40,
    paddingHorizontal:30
    
  },



});