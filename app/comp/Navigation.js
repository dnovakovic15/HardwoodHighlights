import React from 'react';
import {
    createStackNavigator,
    createBottomTabNavigator,
    createAppContainer,
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Text, Image } from 'react-native';

import HomeView from './HomeView';

const navigationOptions = ({ navigation }) => {
    SafeAreaView.setStatusBarHeight(0);
    return {
        visible: false,
        headerStyle: {
            backgroundColor: '#0c1c2e',
            borderBottomWidth: 1,
            borderColor: '#333332',
            color: 'white',
        },
        headerTitle: <Image 
                        source={require("../assets/images/logo.png")} 
                        resizeMode='contain' 
                        style={{height: '80%', width: '100%'}}
                    />,
        // headerTitle: <Text style={{color: 'white', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'Graduate-Regular', flex: 1}}>Hardwood Highlights</Text>,
        // headerLeft: (
        //     navigation.state.routeName == 'Home' ? null : (
        //         <TouchableOpacity style={{flex: 1, justifyContent: 'center', paddingHorizontal: 15}} onPress={() => navigation.goBack()} activeOpacity={0.7}>
        //             <Ionicons name="ios-arrow-back" color='white' size={25} />
        //         </TouchableOpacity>
        //     )
        // ),
        // headerRight: (
        //     navigation.state.routeName == 'StudyConfiguration' ? <View></View> :
        //     <TouchableOpacity
        //         activeOpacity={0.65}
        //         onPress={() => navigation.state.routeName == 'Settings' ? navigation.goBack() : navigation.navigate('Settings')}
        //     >
        //         <Icon name="cog" color='white' size={25} style={{paddingRight: 10}}/>
        //     </TouchableOpacity>
        // )
    };
};

const TabNavigator = createBottomTabNavigator(
    {
        Home: HomeView,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ tintColor }) => {
                const { routeName } = navigation.state;
                let IconComponent = Ionicons;
                let iconName;

                if (routeName === 'Home') {
                    iconName = `ios-home`;
                }

                return (
                    <IconComponent
                        name={iconName}
                        size={25}
                        color={tintColor}
                    />
                );
            },
        }),
        tabBarOptions: {
            activeTintColor: '#cc201a',
            inactiveTintColor: 'gray',
            visible: 'false',
            style: {
                borderWidth: 0.2,
            },
        },
        backBehavior: 'none',
        visible: 'false'
    }
);

const stackNaviagor = createStackNavigator({
    TabNavigator: {
        screen: HomeView,
        navigationOptions,
    },
});

module.exports = createAppContainer(stackNaviagor);
