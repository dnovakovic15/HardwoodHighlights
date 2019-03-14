import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Images from '../assets/images/index';
import config from '../config';

import YouTube from 'react-native-youtube';

class ScheduleView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            videoActive: false,
            activeVideoId: '',
        };
    }

    componentDidMount = async () => {
        const data = [
            {
                key: 1,
                title: 'Otto Porter vs. Pistons',
                statline: '37 Pts, 10 Reb, 4 Asts',
                playerName: 'otto_porter',
                active: 0,
                youtubeID: "86M0V0r0bZg"
            },
            {
                key: 2,
                title: 'Trae Young vs. Bulls',
                statline: '27 Pts, 10 Reb, 14 Asts',
                playerName: 'trae_young',
                active: 0,
                youtubeID: "ZETiJaljoOg"
            },
        ];

        this.setState({
            videos: data,
        });
    };

    componentWillUnmount() {}

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
            borderRadius: 7,
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
                    
                    style={{ alignSelf: 'stretch', height: 300 }}
                />
            }
            {(!this.state.videoActive || this.state.activeVideoId != item.youtubeID) &&
                <TouchableOpacity style={{ alignSelf: 'stretch', height: 300, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.playVideo(item.youtubeID)}>
                    <Ionicons  name='ios-play' color='white' size={50}/>
                </TouchableOpacity>
            }
            <View style={{ marginBottom: 8, marginTop: 8, paddingLeft: 15 }}>
                <Text style={{ fontSize: 12, color: '#434345', fontWeight: 'bold' }}>
                    {'20 MINUTES AGO'}
                </Text>
            </View>
        </View>
    );

    keyExtractor = item => item.key.toString();

    render() {
        return (
            <View  style={{ flexDirection: 'column', flex: 1, backgroundColor: '#c4c4c4' }}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.state.videos}
                        extraData={this.state}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    />
                </View>
            </View>
        );
    }
}

export default ScheduleView;
