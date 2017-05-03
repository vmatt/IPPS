import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Button,
  AsyncStorage,
  ScrollView,
  TouchableHighlight,
  ListView
} from 'react-native';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.getAsyncData();
  }
  async getAsyncData() {
    if (await AsyncStorage.getItem('ipAddress') != null) {
      this.setState({'ipAddress': await AsyncStorage.getItem('ipAddress')});
    }
    if (await AsyncStorage.getItem('remoteFolder') != null) {
      this.setState({'remoteFolder': await AsyncStorage.getItem('remoteFolder')});
    }
    if (await AsyncStorage.getItem('timeout') !== null) {
      this.setState({'timeout': await AsyncStorage.getItem('timeout')});
    } else {
      this.setDefaultState();
    }
  }
  async setDefaultState() {
    await this.saveAsyncData('ipAddress', '192.168.43.2');
    await this.saveAsyncData('remoteFolder', '/DCIM/100WLAN0');
    await this.saveAsyncData('timeout', '5000');
  }

  async saveAsyncData(key, value) {
    await AsyncStorage.setItem(key, value);
    await this.setState({[key]: value});
  }
  async resetAllSettings() {
    await AsyncStorage.clear();
    await this.setDefaultState();
  }

  render() {
    if (this.props.setDefaultSettings){
      return null;
    }
    else{
    return (
      <View style={styles.mainContainer}>
        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>IP cím</Text>
          <TextInput defaultValue={this.state.ipAddress} style={styles.optionTextInput} onChangeText={(text) => this.saveAsyncData('ipAddress', text)}/>
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>Távoli könyvtár</Text>
          <TextInput defaultValue={this.state.remoteFolder} style={styles.optionTextInput} onChangeText={(text) => this.saveAsyncData('remoteFolder', text)}/>
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>Időtúllépés (ms)</Text>
          <TextInput defaultValue={this.state.timeout} style={styles.optionTextInput} onChangeText={(text) => this.saveAsyncData('timeout', text)}/>
        </View>
        <View style={styles.button}>
          <Button onPress={() => this.resetAllSettings()} title="Alapérzelmezett beállítások" accessibilityLabel="Alapérzelmezett beállítások visszaállítása"/>
        </View>
      </View>

    );
  }
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 45
  },
  optionContainer: {
    marginVertical: 5
  },
  optionTextInput: {
    margin: 0
  },
  button: {
    marginHorizontal: 20
  }
});
