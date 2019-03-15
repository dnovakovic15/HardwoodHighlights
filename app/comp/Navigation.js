import React from 'react';
import {
    createStackNavigator,
    createBottomTabNavigator,
    createAppContainer,
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeView from './HomeView';

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
    },
});

module.exports = createAppContainer(stackNaviagor);
