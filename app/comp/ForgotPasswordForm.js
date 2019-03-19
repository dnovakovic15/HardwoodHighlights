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
            errors: {},
            message: null,
		};
	}

	handleSubmit = () => {
		let data = {
			emailaddress: _.trim(this.state.emailaddress),
        };

        if (!data.emailaddress) {
            Alert.alert('Please enter your email address.');
            return;
        }

        
        this.setState({message: 'Hardwood Highlights has been contacted. We will reach out to you shortly. '})
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

                {this.state.message &&
                    <Text style={{color: 'white', padding: 15, fontSize: 18, fontFamily: 'Graduate-Regular', alignSelf: 'center'}}>{this.state.message}</Text>
                }

                {!this.state.message &&
                    <View style={styles.input}>
                        <Ionicons name='ios-person' size={30} style={{marginRight: 10}}/>
                        <TextInput
                            value={this.state.emailaddress}
                            placeholderTextColor={'white'}
                            maxLength={200}
                            style={{width: '100%'}}
                            placeholder={'Email Address'}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            onSubmitEditing={this.handleNext.bind(null, 'password')}
                            returnKeyType="next"
                            onChangeText={(text) => this.setState({emailaddress: text})}
                        />
                    </View>
                }

                {!this.state.message &&
                    <View style={{flex: 1}}/>
                }

                {!this.state.message &&
                    <View style={{paddingHorizontal: 15, width: '100%'}}>
                        <TouchableOpacity onPress={this.handleSubmit} style={styles.button}><Text style={{color: '#ffffff', fontWeight: '200', fontSize: 18, fontFamily: 'Graduate-Regular'}}>Reset Password</Text></TouchableOpacity>
                    </View>
                }

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
