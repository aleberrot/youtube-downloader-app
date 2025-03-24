import { Image, StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { downloadVideo, requestPermissions } from '../api';

export default function HomeScreen(){
  const [url, setVideo] = useState('');
  const [quality, setQuality] = useState('144');
  const [format, setFormat] = useState('video');
  const [hasPermissions, setHasPermissions] = useState(false);

  // TODO add useEffect to check permissions
  useEffect(()=>{
    (async ()=>{
      setHasPermissions(await requestPermissions());
    })()
  }, [])

  // TODO make handle submit function
  const handleSubmit = async () => {
    if (!url){
      Alert.alert("Error", "Please enter a valid URL");
      return;
    }
    try {
      if (!hasPermissions){
        Alert.alert("Error", "You must grant permissions to download files");
        return;
      }
      await downloadVideo(url, format, quality);
    } catch (error) {
      Alert.alert("Error", `Error downloading video: ${error}`);
    }
  }
 // TODO break down the UI into components 
 return (
    <View style={styles.container}>
      <Text style={styles.header}>YouTube Downloader</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>Video Url</Text>
        <TextInput
            style={styles.input}
            value= {url}
            placeholder='Url here!'
            onChangeText={(newUrl) => setVideo(newUrl)}
          />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.label}>Select Format</Text>
        <Picker
        selectedValue={format}
        onValueChange={(itemValue) => setFormat(itemValue)}
        style={styles.picker}
        mode='dropdown'
        >
          <Picker.Item label='Video' value='video' />
          <Picker.Item label= 'Audio' value='audio' />
        </Picker>
      </View>

      {format === 'video' ?
      ( 
      <View style={styles.contentContainer}>
        <Text style={styles.label}>Select Quality:</Text>
        <Picker
          selectedValue={quality}
          onValueChange={(itemValue) => setQuality(itemValue)}
          style={styles.picker}
          mode='dropdown'
          >
          <Picker.Item label='144p' value='144' />
          <Picker.Item label='360p' value='360' />
          <Picker.Item label='480p' value='480' />
          <Picker.Item label='720p' value='720' />
          <Picker.Item label='1080p' value='1000' />
          
        </Picker>
      </View>
  ): <Text></Text>
      }

      <Button color="red" title='Download' onPress={handleSubmit}  />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    justifyContent: "center",
    padding: 10,
    flex: 1,
    backgroundColor: "#FEF9E1",
    alignItems: "center"
  },
  header: {
    fontWeight: "heavy",
    fontSize: 30,
    margin: 30
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    fontStyle: "italic"
  },
  input:{
    backgroundColor: "beige",
    height: 40,
    width: "100%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "red"
  },
  contentContainer:{
    padding: 5,
    marginBottom: 20,
    alignItems: "center",
    width: "70%"
  },
  picker:{
    width: "100%",
    height: 50,
    backgroundColor: "beige",
  },
})
