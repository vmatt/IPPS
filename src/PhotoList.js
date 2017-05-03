import React, {Component} from "react";
import {
  AsyncStorage,
  Button,
  Dimensions,
  Image,
  ListView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from "react-native";

export default class PhotoList extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    var {width} = Dimensions.get('window');
    thumbnailSize = width / 3.1;
    this.state = {
      thumbnailSize: thumbnailSize,
      refreshing: false,
      dataSource: ds,
      ipAddress: '192.168.43.2',
      remoteFolder: '/DCIM/100WLAN0',
      timeout: '5000'
    }
  };
  componentDidMount() {
    this.onRefresh();
  }
  onRefresh() {
    this.setState({refreshing: true});
    this.getAsyncData(this.RefreshListView.bind(this));

  }
  RefreshListView(response) {
    if (response == 0) {
      this.setState({error: "Üres mappa"});
    } else if (response == 1) {
      this.setState({error: "Szerver nem elérhető"});
    } else if (response == 2) {
      this.setState({error: "Időtúllépés"});
    } else if (response == 404) {
      this.setState({error: "Oldal nem található"});
    } else if (response) {
      this.setState({error: false});
      response = response.map((item) => {
        console.log(item[0]);
        console.log(item);
        return "http://" + this.state.ipAddress + "/thumbnail.cgi?" + item[0] + '/' + item[1]
      });
      this.setState({dataSource: this.state.dataSource.cloneWithRows(response)})
    }
    this.setState({refreshing: false});
  }
  async getAsyncData(callback) {
    ipAddress = await AsyncStorage.getItem('ipAddress');
    remoteFolder = await AsyncStorage.getItem('remoteFolder');
    timeout = await AsyncStorage.getItem('timeout');
    if (await ipAddress != null) {
      this.setState({'ipAddress': ipAddress});
    }
    if (await remoteFolder != null) {
      this.setState({'remoteFolder': remoteFolder});
    }
    if (await timeout != null) {
      this.setState({'timeout': timeout});
    }
    if (await timeout == null || await ipAddress == null || await remoteFolder == null) {
      this.setState({error: "Hiányos beállítások"});
      this.setState({refreshing: false});

    } else {
      await this.getFileList(this.state.ipAddress, this.state.remoteFolder, callback);

    }

  }
  getFileList(ipAddress, remoteFolder, callback) {
    var url = "http://" + ipAddress + "/command.cgi?op=100&DIR=" + remoteFolder;
    let request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        var res = request.responseText;
        res = res.split('\n');
        res.splice(0, 1);
        res.splice(-1);
        if (res.length == 0) {
          callback(0);
        } else {
          RemoteFileImageArray = res.map((item) => {
            splitted = item.split(',');
            //csak a jpg képeket olvassuk be
            if (splitted[1].match(/.*\.(JPG|jpg)$/)) {
              return (splitted);
            }
          });
          var RemoteFileImageArray = res.reduce(function(result, item) {
            splitted = item.split(',');
            if (splitted[1].match(/.*\.(JPG|jpg)$/)) {
              result.push(splitted);
            }
            return result;
          }, []);
          callback(RemoteFileImageArray);

        }
      } else if (request.readyState === XMLHttpRequest.DONE && request.status === 404) {
        callback(404);
      } else if (request.readyState === XMLHttpRequest.DONE && request.status === 0) {
        callback(1);
      }
    };
    setTimeout(() => {
      if (request.readyState !== XMLHttpRequest.DONE) {

        request.abort();
        callback(2);
      }
    }, parseFloat(this.state.timeout));
    request.open('GET', url);
    request.send();
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView refreshControl={< RefreshControl refreshing = {
          this.state.refreshing
        }
        onRefresh = {
          this.onRefresh.bind(this)
        } />}>
          <Text style={styles.errorText}>{this.state.error}</Text>
        </ScrollView>
      );
    } else {
      return (
        <ScrollView style={styles.ScrollContainer} refreshControl={< RefreshControl refreshing = {
          this.state.refreshing
        }
        onRefresh = {
          this.onRefresh.bind(this)
        } />}>
          <ListView contentContainerStyle={styles.scrollList} initialListSize={this.state.dataSource.getRowCount()} dataSource={this.state.dataSource} renderRow={(rowData) => this.renderData(rowData)}/>
        </ScrollView>
      )
    }
  }

  renderData = (data) => {
    return (
      <TouchableHighlight onPress={() => this.props.navigation.navigate('Editor', {EditablePhoto: data})} style={styles.TouchableHighlight} width={this.state.thumbnailSize} height={10}>
        <View style={styles.box} width={this.state.thumbnailSize} height={this.state.thumbnailSize}>
          <Image source={{
            uri: data
          }} style={styles.boxImage} width={this.state.thumbnailSize} height={this.state.thumbnailSize}/>
        </View>
      </TouchableHighlight>
    );
  }

}
const styles = StyleSheet.create({
  ScrollContainer: {
    marginTop: 5
  },
  errorText: {
    margin: 20,
    fontSize: 20,
    textAlign: 'center'
  },
  scrollList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  box: {
    backgroundColor: '#FFF',
    margin: 1
  },
  boxImage: {
    flex: 1,
    backgroundColor: "grey"
  },
  boxText: {
    flex: 1,
    fontWeight: '900',
    fontSize: 15,
    color: 'white',
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  TouchableHighlight: {
    borderWidth: 0,
    borderColor: "#fff"
  }
});
