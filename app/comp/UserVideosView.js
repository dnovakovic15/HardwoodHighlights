import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Images from '../assets/images/index';
import config from '../config';
import _ from 'lodash';

import YouTube from 'react-native-youtube';
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
            focusListener: null
        };
    }

    componentDidMount = async () => {
        const videos = await this.fetchVideos();
        await this.updateVideoLikes(videos);

        const focusListener = this.props.screenProps.navigation.addListener('didFocus', async () => {
            const videos = await this.fetchVideos();
            await this.updateVideoLikes(videos);
        });

        this.setState({
            focusListener,
            searchTerm: this.props.searchTerm
        });
        this.props.screenProps.navigation.setParams({searchTerm: this.state.searchTerm, updateSearch: this.updateSearch});
    };

    componentWillUnmount = () => {
        if (this.state.focusListener) {
            this.state.focusListener.remove();
        }
    }

    fetchVideos = async () => {
        const results = await fetch('http://ec2-18-219-146-60.us-east-2.compute.amazonaws.com/videos/all', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            return response.json();
        });

        return results.records;
    }

    updateSearch = (searchTerm) => {
        this.setState({searchTerm});
        this.props.screenProps.navigation.setParams({searchTerm});
    }

    initializeMedications = async () => {};

    playVideo = (youtubeId) => {
        this.setState({activeVideoId: youtubeId, videoActive: true})
    }

    updateVideoLikes = async (videos) => {
        if (!videos) {
            return;
        }

        const userVids = await AsyncStorage.fetchVideos();
        if (!userVids) {
            return
        }

        let newVideos = [];

        for (let video of userVids) {
            const existingVid = _.filter(videos, (vid) => {
                vid.liked = true;
                return video.id == vid.youtubeID; 
            });

            if (existingVid[0]) {
                newVideos.push(existingVid[0]);
            }
        }

        this.setState({videos: newVideos});
    }

    updateUserSavedVids = async (id) => {
        let videos = await AsyncStorage.fetchVideos();
        let existingVid = false;

        if (!videos) {
            videos = [];
        }

        for (let video of videos) {
            if (video.id == id) {
                existingVid = true;
            }
        }

        if (existingVid && videos) {
            videos = _.filter(videos, video => {
                return video.id != id;
            })
        }
        else {
            videos.push({id, liked: true});
        }

        await AsyncStorage.updateVideos(videos);
        this.updateVideoLikes(this.state.videos);
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
        let filteredVideos = [];

        if (this.state.videos) {
            filteredVideos = _.filter(this.state.videos, (video) => {
                const title = video.title.toLowerCase();
                const searchTerm = this.state.searchTerm.toLowerCase();
    
                return title.indexOf(searchTerm) > -1;
            });
    
        }
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
