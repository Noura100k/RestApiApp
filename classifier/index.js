import { decode as atob } from "base-64";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ActivityIndicator } from "react-native";
export default function Exam_letter({ text }) {
  const ref = useRef();
  const [loading, setLoading] = useState(false);
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
    // start loading
    setLoading(true);
    // upload image to server
    await uploadImageAsync(signature)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    // stop loading
    setLoading(false);
  };

  const uploadImageAsync = async (signature) => {
    /**
     * how to get your laptop IP:
     * 1. open cmd
     * 2. type "ipconfig"
     * 3. find "IPv4 Address" and copy it
     * 4. paste it in the url above
     * 5. replace "<YourLaptopIP>"" with your IP
     * example: http://192.168.100.5:19006/classify
     */
    let apiUrl = "http://<YourLaptopIP>:19006/classify";

    const file = DataURIToBlob(signature);
    let formData = new FormData();
    formData.append("photo", file, `photo.png`);

    let options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    return fetch(apiUrl, options);
  };

  //assign signature to ref
  const handleConfirm = () => {
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
        {loading ? (
          <ActivityIndicator />
        ) : (
          <SignatureScreen
            ref={ref}
            bgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFq-uwQ1be8k03yZTxhVhyA5XtwoSI-rBMDQ&usqp=CAU"
            bgWidth={imgWidth}
            bgHeight={imgHeight}
            webStyle={style}
            onOK={handleOK}
            onEmpty={() => console.log("empty")}
          />
        )}
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
