import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage } from 'react-native';
import { Button, Avatar, ListItem, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { refreshProfileData } from '../actions';
import Colors from '../constants/Colors';
import I18n from '../../locales/i18n';

class SettingScreen extends Component {
    
    componentWillMount() {
        I18n.locale = this.props.locale;
    }
    
    async logout() {
        await AsyncStorage.removeItem('fb_token');
        this.props.navigation.navigate('Auth');
    }

    refresh() {
        const { profile } = this.props;
        this.props.refreshProfileData(profile.uid);
    }

    showPhoneNumberStatus() {
        let text = 'Confirm your phone number';
        let icon = 'close-circle';
        let disabled = false;
        let colorName = Colors.grey;

        const { profile } = this.props;
        if (profile.confirmed) {
            text = 'Phone Verified';
            icon = 'checkmark-circle';
            disabled = true;
            colorName = Colors.red;
        }

        return (
            <ListItem 
                title={text}
                rightIcon={<Icon type='ionicon' name={`ios-${icon}`} size={25} color={colorName}/>}
                containerStyle={{ backgroundColor: Colors.white }}
                disabled={disabled}
                onPress={() => this.props.navigation.navigate('Confirm',
                     { profile: this.props.profile, onGoBack: () => this.refresh() })}
            />
        );
    }

    render() {
        const { profile } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    <Avatar
                        rounded
                        xlarge
                        source={{ uri: `${profile.photoURL}?height=150` }}
                        containerStyle={{ marginBottom: 20 }}
                    />
                    <Text style={styles.textStyle} > {profile.displayName} </Text>
                </View>
                
                { this.showPhoneNumberStatus() }

                <ListItem 
                    title={I18n.t('settings.language')}
                    containerStyle={{ backgroundColor: Colors.white, marginTop: 20 }}
                    rightIcon={{ name: 'ios-globe', type: 'ionicon', size: 25, color: Colors.red }}
                    onPress={() => this.props.navigation.navigate('Language')}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        raised
                        title={I18n.t('settings.logout', { defaultValue: 'Logout' })}
                        buttonStyle={styles.buttonStyle}
                        onPress={this.logout.bind(this)}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonContainer: {
        position: 'absolute', 
        bottom: 20,
        alignSelf: 'center'
    },
    buttonStyle: {
        backgroundColor: Colors.red,
        borderRadius: 5,
        width: 300
    },
    infoContainer: {
        marginBottom: 20,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    }

});


const maptStateToProps = ({ auth, language }) => {
    return {
        profile: auth.profile,
        locale: language.locale
    };
};

export default connect(maptStateToProps, { refreshProfileData })(SettingScreen);
