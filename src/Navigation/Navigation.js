import React, { useRef, lazy, Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
const Stack = createNativeStackNavigator();

// Lazy load screen components
const LazyHome = lazy(() => import('../screens/Home'));
const LazyForm = lazy(() => import('../screens/Form'));

// Fallback component for Suspense
const SuspenseFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="orange" />
  </View>
);

const Navigation = () => {
  const navigationRef = useRef();

  return (
    <NavigationContainer ref={navigationRef} >
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {props => (
            <Suspense fallback={<SuspenseFallback />}>
              <LazyHome {...props} />
            </Suspense>
          )}
        </Stack.Screen>
        <Stack.Screen name="Form">
          {props => (
            <Suspense fallback={<SuspenseFallback />}>
              <LazyForm {...props} />
            </Suspense>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
