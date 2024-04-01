/**
 * @format
 */

import * as React from 'react';
import { AppRegistry, Platform, SafeAreaView as SafeAreaIOS } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { name as appName } from './app.json';
import App from './App';

export default function Main() {
    const SafeArea = Platform.OS === 'ios' ? SafeAreaIOS : SafeAreaView;
    return (
        <SafeArea style={{flex:1}}>
                <App />
        </SafeArea>
    );
}

AppRegistry.registerComponent(appName, () => Main);
