import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import WebView from 'react-native-android-fullscreen-webview-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Images from '../assets/images/index';
import _ from 'lodash';

import AsyncStorage from '../helpers/AsyncStorage';

class HomeView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            videoActive: false,
            activeVideoId: '',
            searchTerm: '',
            videoLiked: 'false',
            focusListener: null,
            blurListener: null,
        };
    }

    componentDidMount = async () => {
        const focusListener = this.props.navigation.addListener('didFocus', async () => {
            await this.updateVideoLikes();
        });

        const blurListener = this.props.navigation.addListener('didBlur', async () => {
            this.setState({activeVideoId: ''});
        });

        const results = await fetch('http://ec2-18-219-146-60.us-east-2.compute.amazonaws.com/videos/all', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            return response.json();
        });

        this.setState({
            videos: results.records,
            focusListener
        });
        this.props.navigation.setParams({searchTerm: this.state.searchTerm, updateSearch: this.updateSearch});
        await this.updateVideoLikes();
    };

    componentWillUnmount = () => {
        if (this.state.focusListener) {
            this.state.focusListener.remove();
        }

        if (this.state.blurListener) {
            this.state.blurListener.remove();
        }
    }

    updateSearch = (searchTerm) => {
        this.setState({searchTerm});
        this.props.navigation.setParams({searchTerm});
    }

    initializeMedications = async () => {};

    playVideo = (youtubeId) => {
        this.setState({activeVideoId: youtubeId, videoActive: true})
    }

    updateVideoLikes = async () => {
        const userVids = await AsyncStorage.fetchVideos();
        let videos = this.state.videos;

        for (let video of videos) {
            const vidMatch = _.filter(userVids, (vid) => {
                return vid.id == video.youtubeID; 
            });

            if (vidMatch.length > 0) {
                video.liked = true;
            }
            else {
                video.liked = false;
            }
        }

        this.setState({videos});
    }

    updateUserSavedVids = async (id) => {
        let videos = await AsyncStorage.fetchVideos();
        let existingVid = false;

        for (let video of videos) {
            if (video.id == id) {
                existingVid = true;
            }
        }

        if (existingVid) {
            videos = _.filter(videos, video => {
                return video.id != id;
            })
        }
        else {
            videos.push({id, liked: true});
        }

        await AsyncStorage.updateVideos(videos);
        this.updateVideoLikes();
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
                    <Text style={{fontWeight: 'bold', marginLeft: 10, fontSize: 18, color: '#0e1011', fontWeight: 'bold'}}>{item.title}</Text>

                    <Text style={{fontWeight: 'bold',marginLeft: 10,fontSize: 14,color: '#0e1011',fontFamily: 'Graduate-Regular',fontWeight: "200"}}>
                        {item.statline}
                    </Text>
                </View>

                <Ionicons name="ios-more" size={30} color="black" style={{ lineHeight: 60, marginRight: 15 }} />
            </View>
            {this.state.videoActive && this.state.activeVideoId == item.youtubeID && 
                <WebView
                    style={{height: 300, alignSelf: 'stretch'}}
                    source={{uri: `https://www.youtube.com/embed/${item.youtubeID}`}}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabled={true}
                />
            }
            {(!this.state.videoActive || this.state.activeVideoId != item.youtubeID) &&
                <TouchableOpacity style={{ alignSelf: 'stretch', height: 200, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.playVideo(item.youtubeID)}>
                    <Ionicons  name='ios-play' color='white' size={50}/>
                </TouchableOpacity>
            }

            <View style={{ height: 54, flexDirection: 'row'}} >
                <View style={{ marginTop: 20, paddingLeft: 15 }}>
                    <Text style={{ fontSize: 12, color: '#434345', fontWeight: 'bold' }}>
                        {'20 MINUTES AGO'}
                    </Text>
                </View>

                <View style={{ flex: 1 }} />

                <TouchableOpacity onPress={() => {this.updateUserSavedVids(item.youtubeID)}}>
                    <Ionicons
                        name={item.liked ? "ios-heart" : "ios-heart-empty"}
                        size={34}
                        color="#cc201a"
                        style={{ marginTop: 10, marginRight: 15 }}
                    />
                </TouchableOpacity>
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
