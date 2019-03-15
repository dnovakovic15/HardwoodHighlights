import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Images from '../assets/images/index';
import config from '../config';
import { SafeAreaView } from 'react-navigation';
import { SearchBar } from 'react-native-elements';
import _ from 'lodash';
// import fetch from 'fetch';

import YouTube from 'react-native-youtube';

class HomeView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            videoActive: false,
            activeVideoId: '',
            searchTerm: '',
        };
    }

    static navigationOptions = ({ navigation }) => {
        SafeAreaView.setStatusBarHeight(0);
        return {
            visible: false,
            headerStyle: {
                backgroundColor: 'white',
                borderBottomWidth: 0,
                borderColor: '#333332',
                color: 'white',
            },
            headerTitle: 
                <SearchBar
                    placeholder="Search for Player..."
                    onChangeText={(searchTerm) => navigation.state.params.updateSearch(searchTerm)}
                    value={navigation.state.params ? navigation.state.params.searchTerm : ''}
                    containerStyle={{width: '100%', borderBottomWidth: 0, borderWidth: 0}}
                />
        };
    };

    componentDidMount = async () => {
        const results = await fetch('http://ec2-18-219-146-60.us-east-2.compute.amazonaws.com/videos/all', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            return response.json();
        });

        console.log(results);

        this.setState({
            videos: results.records,
        });
        this.props.navigation.setParams({searchTerm: this.state.searchTerm, updateSearch: this.updateSearch});
    };

    updateSearch = (searchTerm) => {
        this.setState({searchTerm});
        this.props.navigation.setParams({searchTerm});
    }

    initializeMedications = async () => {};

    playVideo = (youtubeId) => {
        this.setState({activeVideoId: youtubeId, videoActive: true})
    }

    renderItem = ({ item }) => (
        <View style={{ 
            shadowColor: 'rgba(0,0,0, .4)', 
            shadowOffset: { height: 1, width: 1 }, 
            shadowOpacity: 1, 
            shadowRadius: 1, 
            elevation: 3,
            margin: 10,
            marginBottom: 5,
            borderRadius: 15,
            backgroundColor: 'white'
        }}>
            <View style={{ height: 60, flexDirection: 'row' }}>

                <Image
                    style={{ width: 36, height: 36, marginLeft: 12, marginTop: 12,  borderRadius: 50, borderWidth: StyleSheet.hairlineWidth, borderColor: 'lightgray' }}
                    source={Images.avatars[item.playerName]}
                />

                <View style={{flexDirection: 'column', justifyContent: 'center', flex: 1}}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            marginLeft: 10,
                            fontSize: 18,
                            color: '#0e1011',
                            fontWeight: 'bold'
                        }}
                    >
                        {item.title}
                    </Text>

                    <Text
                        style={{
                            fontWeight: 'bold',
                            marginLeft: 10,
                            fontSize: 14,
                            color: '#0e1011',
                            fontFamily: 'Graduate-Regular',
                            fontWeight: "200"
                        }}
                    >
                        {item.statline}
                    </Text>
                </View>

                <Ionicons
                    name="ios-more"
                    size={30}
                    color="black"
                    style={{ lineHeight: 60, marginRight: 15 }}
                />
            </View>
            {this.state.videoActive && this.state.activeVideoId == item.youtubeID && 
                <YouTube
                    apiKey={config.google_api_key}
                    videoId={item.youtubeID}
                    play={true}
                    loop={false}           
                    
                    onReady={e => this.setState({ isReady: true })}
                    onChangeState={e => this.setState({ status: e.state })}
                    onChangeQuality={e => this.setState({ quality: e.quality })}
                    onError={e => this.setState({ error: e.error })}
                    
                    style={{ alignSelf: 'stretch', height: 50 }}
                />
            }
            {(!this.state.videoActive || this.state.activeVideoId != item.youtubeID) &&
                <TouchableOpacity style={{ alignSelf: 'stretch', height: 300, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.playVideo(item.youtubeID)}>
                    <Ionicons  name='ios-play' color='white' size={50}/>
                </TouchableOpacity>
            }

            <View
                style={{
                    height: 54,
                    flexDirection: 'row',
                }}
            >
                <Ionicons
                    name="ios-heart-empty"
                    size={34}
                    color="#cc201a"
                    style={{ marginTop: 12, marginLeft: 15 }}
                />
                <View style={{ flex: 1 }} />
                <Icon
                    name="bookmark"
                    size={34}
                    color="darkblue"
                    style={{ marginTop: 12, marginRight: 15 }}
                />
            </View>

            <View style={{ marginBottom: 8, paddingLeft: 15 }}>
                <Text style={{ fontSize: 12, color: '#434345', fontWeight: 'bold' }}>
                    {'20 MINUTES AGO'}
                </Text>
            </View>
        </View>
    );

    keyExtractor = item => item.key.toString();

    render() {
        const filteredVideos = _.filter(this.state.videos, (video) => {
            const title = video.title.toLowerCase();
            const searchTerm = this.state.searchTerm.toLowerCase();

            return title.indexOf(searchTerm) > -1;
        });

        return (
            <View  style={{ flexDirection: 'column', flex: 1, backgroundColor: '#c4c4c4' }}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={filteredVideos}
                        extraData={this.state}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    />
                </View>
            </View>
        );
    }
}


export default HomeView;
