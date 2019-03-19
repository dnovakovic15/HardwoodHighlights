import React from 'react';
import {Alert, View, Image, TouchableOpacity, Text, TextInput, StyleSheet, Dimensions} from 'react-native';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '../helpers/AsyncStorage';

export default class LoginForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			email: '',
            password: '',
            confirmPassword: '',
			errors: {},
		};
	}

	handleSubmit = async () => {
		let data = {
			email: _.trim(this.state.email),
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        };
        
		if (!data.email) {
			Alert.alert('Please enter your email address.');
			return;
		}

		if (!data.password) {
			Alert.alert('Please enter your password.');
			return;
        }
        
        if (!data.confirmPassword) {
			Alert.alert('Please confirm your password.');
			return;
        }
        
        if (data.confirmPassword != data.password) {
			Alert.alert('The passwords entered do not match.');
			return;
		}

		const results = await fetch('http://ec2-18-219-146-60.us-east-2.compute.amazonaws.com/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            return response.json();
        });

        if (results.status == 0) {
            AsyncStorage.registerUser(data);
            this.props.naviagtion.navigate('Home');
            return;
        }

        alert('There was an error registering your account.');
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
                        value={this.state.email}
                        placeholderTextColor={'white'}
                        maxLength={200}
                        style={{width: '100%'}}
                        placeholder={'Email Address'}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onSubmitEditing={this.handleNext.bind(null, 'password')}
                        returnKeyType="next"
                        onChangeText={(text) => this.setState({email: text})}
                    />
                </View>
                <View style={{flex: 0.5}}/>
                <View style={styles.input}>
                    <Ionicons name='ios-lock' size={30} style={{marginRight: 10}}/>
                    <TextInput
                        value={this.state.password}
                        placeholderTextColor={'white'}
                        maxLength={200}
                        style={{width: '100%'}}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onSubmitEditing={this.handleNext.bind(null, 'password')}
                        returnKeyType="next"
                        onChangeText={(text) => this.setState({password: text})}
                    />
                </View>
                <View style={{flex: 0.5}}/>
                <View style={styles.input}>
                    <Ionicons name='ios-lock' size={30} style={{marginRight: 10}}/>
                    <TextInput
                        value={this.state.confirmPassword}
                        placeholderTextColor={'white'}
                        maxLength={200}
                        style={{width: '100%'}}
                        placeholder={'Re-Type Password'}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onSubmitEditing={this.handleNext.bind(null, 'password')}
                        returnKeyType="next"
                        onChangeText={(text) => this.setState({confirmPassword: text})}
                    />
                </View>

                <View style={{flex: 1}}/>
                <View style={{paddingHorizontal: 15, width: '100%'}}>
                    <TouchableOpacity onPress={this.handleSubmit} style={styles.button}>
                        <Text style={{color: '#ffffff', fontWeight: '200', fontSize: 18, fontFamily: 'Graduate-Regular'}}>Register</Text>
                    </TouchableOpacity>
                </View>

                <View style={{alignItems:'center', width: '100%', paddingHorizontal: 25, paddingTop: 10}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Text style={{color: 'white'}}>Return to Login</Text>
                    </TouchableOpacity>
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
