import React from 'react';
import {ActivityIndicator, AsyncStorage, StatusBar, View} from 'react-native';

class AuthLoadingScreen extends React.Component {
	constructor(props) {
		super(props);
		this._bootstrapAsync();
	}

  // Fetch the token from storage then navigate to our appropriate place
	_bootstrapAsync = async () => {
        const email = await AsyncStorage.getItem('email');
        
		this.props.navigation.navigate(!email ? 'Login' : 'Home');
	};

  // Render any loading content that you like here
	render() {
		return (
			<View>
				<ActivityIndicator />
				<StatusBar barStyle="default" />
			</View>
		);
	}
}

export default AuthLoadingScreen;
