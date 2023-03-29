 import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Classifer from './classifier/index';
export default function App() {
  return (
    <View style={styles.container}>
   <Classifer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
