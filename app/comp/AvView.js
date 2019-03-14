import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import resolveAssetSource from 'resolveAssetSource';

const { width } = Dimensions.get('window');

export default class AvView extends Component {
    state = {
        rate: 1,
        volume: 1,
        muted: false,
        resizeMode: 'contain',
        duration: 0.0,
        currentTime: 0.0,
        controls: false,
        paused: true,
        skin: 'custom',
        ignoreSilentSwitch: null,
        isBuffering: false,
        imageHeight: 0,
    };

    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onBuffer = this.onBuffer.bind(this);
    }

    componentWillMount() {
        if (this.props.type === 'image') {
            this.setState({ imageHeight: Math.floor(713 * (width / 1267)) });
        }
    }

    onLoad(data) {
        this.setState({ duration: data.duration });
    }

    onProgress(data) {
        this.setState({ currentTime: data.currentTime });
    }

    onBuffer(isBuffering) {
        this.setState({ isBuffering });
    }

    render() {
        if (this.props.type === 'image') {
            return (
                <View>
                    <Image
                        style={{ width, height: this.state.imageHeight }}
                        resizeMode={'contain'}
                    />
                </View>
            );
        }

        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ paused: !this.state.paused });
                }}
                activeOpacity={0.8}
                style={{ width, height: width }}
            >
                <Video
                    source={{ uri: this.props.source }}
                    style={{ width, height: width }}
                    rate={this.state.rate}
                    paused={this.state.paused}
                    volume={this.state.volume}
                    muted={this.state.muted}
                    ignoreSilentSwitch={this.state.ignoreSilentSwitch}
                    resizeMode={'cover'}
                    onLoad={this.onLoad}
                    onBuffer={this.onBuffer}
                    onProgress={this.onProgress}
                    onEnd={() => null}
                    repeat={true}
                />
                <View
                    style={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                    }}
                >
                    <Ionicons
                        name="ios-videocam"
                        size={24}
                        color="white"
                        style={{
                            backgroundColor: 'transparent',
                            lineHeight: 40,
                            marginLeft: 10,
                        }}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}
