import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-navigation';
import { SearchBar } from 'react-native-elements';
import _ from 'lodash';

import HomeView from './HomeView';
import UserVideosView from './UserVideosView';
import Login from './LoginForm';
let globalSearchTerm = '';

const navigationOptions = ({ navigation }) => {
    SafeAreaView.setStatusBarHeight(0);
    const routes = navigation.state.routes;

    const homeViewActive = _.filter(routes, route => {
        return (route.key == 'Home' || route.key == 'Saved') && route.params && route.params.updateSearch;
    });

    if (homeViewActive[0]) {
        return renderSearch(navigation, homeViewActive);
    }

    return {
        headerStyle: {
            backgroundColor: '#303337',
            borderBottomWidth: 1,
            borderColor: '#333332',
            color: 'white',
        },
        headerTitle: (
            <Image source={require('../assets/images/logo-new.png')} resizeMode='contain' style={{resizeMode: 'contain', height: '100%', width: '100%'}}/>
        ),
        headerRight: (
            <TouchableOpacity onPress={() => navigation.setParams({searching: true})} >
                <Ionicons
                    name="ios-search"
                    size={30}
                    color="white"
                    style={{ lineHeight: 60, marginRight: 20, opacity: 0 }}
                />
            </TouchableOpacity> 
        ),
        headerLeft: ( 
            <Ionicons
                name="ios-search"
                size={30}
                color="black"
                style={{ lineHeight: 60, marginLeft: 15, opacity: 0 }}
            />
        )
    };
};

const renderSearch = (navigation, routes) => {
    const {params} = navigation.state;

    return {
        headerStyle: {
            backgroundColor: '#303337',
            borderBottomWidth: 1,
            borderColor: '#333332',
            color: 'white',
        },
        headerTitle: (params && params.searching ? 
            <SearchBar
                placeholder="Search for Player..."
                onChangeText={(searchTerm) => {
                    for (let route of routes) {
                        route.params.updateSearch(searchTerm);
                    }
                    
                    globalSearchTerm = searchTerm;
                    navigation.setParams({searchTerm})
                }}
                value={params.searchTerm}
                containerStyle={{width: '100%', height: '100%', borderBottomWidth: 0, borderWidth: 0, alignContent: 'center', backgroundColor: '#303337'}}
                inputStyle={{paddingVertical: 0, minHeight: 30}}
                onCancel={() => {
                    for (let route of routes) {
                        route.params.updateSearch('');
                    }
                    navigation.setParams({searching: false, searchTerm:''});
                    globalSearchTerm = '';
                }}
                platform="ios"
            />
            : 
            <Image source={require('../assets/images/logo-new.png')} resizeMode='contain' style={{resizeMode: 'contain', height: '100%', width: '100%'}}/>
        ),
        headerRight: (!params || !params.searching ? 
            <TouchableOpacity onPress={() => navigation.setParams({searching: true})} >
                <Ionicons
                    name="ios-search"
                    size={30}
                    color="white"
                    style={{ lineHeight: 60, marginRight: 20 }}
                />
            </TouchableOpacity> 
            : null
        ),
        headerLeft: (!params || !params.searching ? 
            <Ionicons
                name="ios-search"
                size={30}
                color="black"
                style={{ lineHeight: 60, marginLeft: 15, opacity: 0 }}
            />
            : null
        )
    };
}

const TabNavigator = createBottomTabNavigator(
    {
        Home: HomeView,
        Saved: {
            screen: props => <UserVideosView  screenProps={props} searchTerm={globalSearchTerm}/>
        }
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
                else if (routeName === 'Saved') {
                    iconName = 'ios-heart'
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
            style: {
                borderWidth: 0.2,
            },
        },
        backBehavior: 'none',
    }
);

const stackNaviagor = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: ({navigation}) => ({
            header: null
        })
    },
    TabNavigator: {
        screen: TabNavigator,
        navigationOptions,
    },
});

module.exports = createAppContainer(stackNaviagor);
