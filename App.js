import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Posts from './src/pages/Posts';
import PostDetails from './src/pages/PostDetails';
import Comments from './src/pages/Comments';
import CreatePost from './src/pages/CreatePost';
import Login from './src/pages/Login';
import Register from './src/pages/Register';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        { }
        <Stack.Screen name="Login" component={Login} />

        { }
        <Stack.Screen name="Register" component={Register} />

        { }
        <Stack.Screen name="Posts" component={Posts} />
        <Stack.Screen name="PostDetails" component={PostDetails} />
        <Stack.Screen name="Comments" component={Comments} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
