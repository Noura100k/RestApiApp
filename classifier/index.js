import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Exam_letter({ onOK, text }) {
  const ref = useRef();

  function DataURIToBlob(dataURI) {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);
    return new Blob([ia], { type: mimeString });
  }

  const handleOK = async (signature) => {
    uploadImageAsync(signature)
      .then((res) => res.json())
      .catch(console.error); //onOK(signature);
  };

  const uploadImageAsync = (signature) => {
    let apiUrl = "http://localhost:19006/classify";
    const file = DataURIToBlob(signature);

    let formData = new FormData();
    formData.append("photo", file, `photo.png`);

    let options = {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return fetch(apiUrl, options);
  };

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
      <View style={{ width: imgWidth, height: imgHeight }}>
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
          <Ionicons name="happy-outline" size={40} color="#FFC917" />
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
    paddingHorizontal: 30,
  },
});
