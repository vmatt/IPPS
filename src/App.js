import React, {Component} from "react";
import {View, StyleSheet} from "react-native";
import {TabNavigator} from "react-navigation";
import PhotoList from './PhotoList';
import Editor from './Editor';
import Settings from './Settings';

class RemoteScreen extends React.Component {
  constructor(props) {
    super(props);
  };
  static navigationOptions = {
    tabBarLabel: 'Távoli könyvtár'
  };
  render() {
    return (
      <View style={styles.container}>
        <PhotoList navigation={this.props.navigation}/>
      </View>
    );
  }
}
class EditorScreen extends React.Component {
  constructor(props) {
    super(props);
  };

  static navigationOptions = {
    tabBarLabel: 'Kép'
  };

  render() {
    return (
      <View style={styles.container}>
        <Editor navigation={this.props.navigation}/>
      </View>
    );
  }
}

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  };
  static navigationOptions = {
    tabBarLabel: 'Beállítások'
  };
  render() {
    return (
      <View style={styles.container}>
        <Settings navigation={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2'
  },
  icon: {
    height: 26,
    width: 26
  }
});
const ippsMain = TabNavigator({
  Remote: {
    screen: RemoteScreen
  },
  Editor: {
    screen: EditorScreen
  },
  Settings: {
    screen: SettingsScreen
  }
}, {
  tabBarOptions: {
    activeTintColor: '#FFF',
    indicatorStyle: {
      backgroundColor: "#cfcfcf"
    },
    labelStyle: {
      fontSize: 10
    },
    style: {
      backgroundColor: '#9e9e9e'
    }
  }
});

module.exports = ippsMain;
