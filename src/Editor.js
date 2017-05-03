import React from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  Button,
  Slider,
  TouchableOpacity,
  Clipboard,
  ToastAndroid,
  Platform
} from "react-native";
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob'

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 100,
      height: 100
    };
  }
  async shareImage(url) {
    ToastAndroid.show('Fájl letöltése...', ToastAndroid.SHORT);
    RNFetchBlob.fetch('GET', url).then((res) => {
      var base64img = "data:image/jpeg;base64,"
      base64img += res.base64();
      return base64img;
    }).then((res) => {
      Share.open({url: res});
    }).catch((errorMessage, statusCode) => {
      console.log(errorMessage, statusCode)
      ToastAndroid.show('A fájl nem elérhető', ToastAndroid.SHORT);
    })
  }
  render() {
    if (this.props.navigation.state.params) {
      var fullSizePic = this.props.navigation.state.params.EditablePhoto.replace("/thumbnail.cgi?", "");
      return (
        <View style={styles.bodyBox}>
          <View style={styles.imgBox}>
            <Image style={styles.img} source={{
              uri: fullSizePic
            }}/>
            <View style={styles.uploadBox}>
              <Button title="Megosztás" onPress={() => {
                this.shareImage(fullSizePic)
              }}/>
            </View>
          </View>

        </View>
      );
    } else {
      return (
        <View style={styles.defaultButtonMargin}>
          <Text style={styles.text}>Kérjük válasszon ki egy képet a Távoli könyvtár fülön</Text>
          <View>
            <Button onPress={() => this.props.navigation.goBack()} title="Vissza" color="#9e9e9e" accessibilityLabel="Visszalépés az előző menüpontra"/>
          </View>
        </View>
      );
    }

  }
}
const styles = StyleSheet.create({
  bodyBox: {
    flex: 1,
    flexDirection: 'column'
  },
  imgBox: {
    flex: 12,
    backgroundColor: "#cfcfcf"
  },
  img: {
    width: '100%',
    height: '90%',
    justifyContent: 'flex-start',
    resizeMode: 'contain'
  },
  uploadBox: {
    marginHorizontal: 50,
    paddingTop: 10
  },
  text: {
    paddingVertical: 20,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500'
  },
  defaultButtonMargin: {
    marginTop: 0,
    marginHorizontal: 60
  }

});
