import React from 'react';
import Navigator from './Navigation';
import { SafeAreaView, View, Image, Text } from 'react-native';

class App extends React.Component {
    render() {
        let appContainerStyle = {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'white',
        };

        return (
            <SafeAreaView style={appContainerStyle}>
                <View style={{ flex: 1 }}>
                    <Navigator />
                </View>
            </SafeAreaView>
        );
    }
}

export default App;
