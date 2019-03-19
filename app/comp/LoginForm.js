import React from 'react';
import {
	Alert,
	AsyncStorage,
	View,
	Image,
	ImageBackground,
    TouchableOpacity,
    Text,
    Button,
    TextInput,
    StyleSheet,
    Dimensions
} from 'react-native';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class LoginForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			emailaddress: '',
			password: '',
			errors: {},
		};
	}

	componentDidMount() {
		AsyncStorage.getItem('lastLoginEmail', (err, val) => {
			if (val) {
				this.setState({
					emailaddress: val,
				});
			}
        });
	}

	handleSubmit = () => {
		let data = {
			emailaddress: _.trim(this.state.emailaddress),
			password: this.state.password,
        };
        
        this.props.navigation.navigate('Home');

		// if (!data.emailaddress) {
		// 	Alert.alert('Please enter your email address.');
		// 	return;
		// }

		// if (!data.password) {
		// 	Alert.alert('Please enter your password.');
		// 	return;
		// }

		// if (/^demo\+/.test(data.emailaddress)) {
		// 	setDemoMode(true);
		// }

		// this.props.save({
		// 	appLoading: true,
		// });

		// _.post('/signin', data, (res) => {

		// 	if (res.status < 2) {
		// 		AsyncStorage.setItem('lastLoginEmail', this.state.emailaddress);

		// 		this.setState({
		// 			emailaddress: '',
		// 			password: '',
		// 		}, () => {
		// 			this.props.save({
		// 				session_id: res.session_id,
		// 				signedin: true,
		// 				user: res.user,
		// 				appLoading: false,
		// 			}, () => {
		// 				this.props.navigate('Dashboard', { user: res.user });
		// 			});
		// 		});
		// 	}
		// 	else {
		// 		this.props.save({
		// 			appLoading: false,
		// 		});

		// 		_.each(res.errors, function(error) {
		// 			Alert.alert('Login Failed!');
		// 			return false;
		// 		});
		// 	}
		// }).catch(() => {
		// 	this.props.save({
		// 		appLoading: false,
		// 	});
		// });
	}


	handleNext = (fieldName) => {
		this.refs[fieldName].focus();
	}

	render() {
		return (
			<TouchableOpacity activeOpacity={1} style={{flex: 1, backgroundColor: '#303337', flexDirection: 'column', alignItems: 'center'}}>
                <View style={{flex: 2}}/>
                <Image resizeMode="contain" source={require('../assets/images/logo-big.png')} style={{width: 150, height: 150}} />
                <View style={{flex: 2}}/>

                <View style={styles.input}>
                    <Ionicons name='ios-person' size={30} style={{marginRight: 10}}/>
                    <TextInput
                        value={this.state.emailaddress}
                        // style={styles.input}
                        placeholderTextColor={'white'}
                        maxLength={200}
                        placeholder={'Email Address'}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onSubmitEditing={this.handleNext.bind(null, 'password')}
                        returnKeyType="next"
                        onChangeText={(text) => this.setState({emailaddress: text})}
                    />
                </View>

                <View style={{flex: 0.5}}/>

                <View style={styles.input}>
                    <Ionicons name='ios-lock' size={30} style={{marginRight: 10}}/>
                    <TextInput
                        value={this.state.emailaddress}
                        // style={styles.input}
                        placeholderTextColor={'white'}
                        maxLength={200}
                        placeholder={'Email Address'}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onSubmitEditing={this.handleNext.bind(null, 'password')}
                        returnKeyType="next"
                        onChangeText={(text) => this.setState({emailaddress: text})}
                    />
                </View>

                <View style={{flex: 1}}/>
                <View style={{paddingHorizontal: 15, width: '100%'}}>
                    <TouchableOpacity onPress={this.handleSubmit} style={styles.button}><Text style={{color: '#ffffff', fontWeight: '200', fontSize: 18, fontFamily: 'Graduate-Regular'}}>Login</Text></TouchableOpacity>
                </View>
                <View style={{flex: 5}}/>
			</TouchableOpacity>
		);
	}

}

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    input: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: width - 40,
        height: 40,
        marginHorizontal: 20,
        paddingLeft: 15,
        borderRadius: 20,
        color: '#ffffff',
        alignItems: 'center'
    },
    button: {
        borderRadius: 20, 
        backgroundColor: '#212020',
        padding: 10,
        width: '100%',
        alignItems: 'center'
    }
});
