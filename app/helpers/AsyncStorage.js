import { AsyncStorage } from 'react-native';

const fetchVideos = async () => {
    const videos = await AsyncStorage.getItem('videos').then(function(result) {
        let storedVideos = null;

        if (!result) {
            return [];
        }

		try {
			storedVideos = JSON.parse(result);
		}
		catch (e) {
			storedVideos = null;
		}

        return storedVideos;
    });

    return videos;
}

const updateVideos = async(value) => {
    try {
        return await AsyncStorage.setItem('videos', JSON.stringify(value));
    } 
    catch (error) {
        console.error('AsyncStorage#setItem error: ' + error.message);
    }
}

const registerUser = async(props) => {
    const {email, password} = props;

    console.log(email, password)

    try {
        await AsyncStorage.setItem('email', JSON.stringify(email));
        return await AsyncStorage.setItem('password', JSON.stringify(password));
    } 
    catch (error) {
        console.error('AsyncStorage#setItem error: ' + error.message);
    }
}

module.exports ={
    fetchVideos,
    updateVideos,
    registerUser
}
