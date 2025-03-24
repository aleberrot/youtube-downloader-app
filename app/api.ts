import { Platform } from "react-native";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

export async function downloadVideo(url: string, format: string, quality: string){
    try {
        const response = await axios.post(
            "https://youtube-downloader-e1hi.onrender.com/download",
            { url, format, quality },
            { timeout: 120000 })

        const { fileUrl, fileName } = response.data;
        console.log("File URL", fileUrl);
        console.log("File Name", fileName);

        if (Platform.OS === "web") {
            const response = await fetch(fileUrl);
            const blob = await response.blob();

            if (!response.ok){
                console.log("Error downloading file", response);
                Alert.alert("Error downloading file");
                return;
            }

            const link  = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            const fileUri = FileSystem.documentDirectory + fileName;
            const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);
            if (downloadResult.status !== 200){ 
                console.log("Error downloading file", downloadResult);
                Alert.alert("Error downloading file");
                return;
            }
            await saveFileToLibrary(downloadResult.uri);
        }
    } catch (e: any) {
        console.log("Error downloading file", e);
        Alert.alert("Error downloading file", e.message);
    }
}
export async function saveFileToLibrary(fileUri: string){
    try {
        const {status} = await MediaLibrary.getPermissionsAsync();
        if (status !== "granted"){
            console.log("Permissions not granted");
            Alert.alert("Permissions Denied", "You must grant permissions to access media library.");
            return;
        }
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        const album = await MediaLibrary.getAlbumAsync("Downloads");
        if (album){
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            return;
        }else{
            await MediaLibrary.createAlbumAsync("Downloads", asset, false);
        }
        Alert.alert("Download Saved!", "Check your downloads folder...");
    }catch(e){
        console.log("Error saving file", e);
        Alert.alert("Error Saving File!!")
    }
  }


export  async function requestPermissions(){
    try {
        const {status} = await MediaLibrary.requestPermissionsAsync();
        return status === "granted";
    }catch(e){
        console.log("Error requesting permissions", e);
        return false;
    }
}