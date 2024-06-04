// src/pages/CreatePost.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@posts';

const savePost = async (post) => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        const existingPosts = jsonValue != null ? JSON.parse(jsonValue) : [];
        const updatedPosts = [...existingPosts, post];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
        console.log('Post saved successfully:', post);
    } catch (error) {
        console.error('Error saving post:', error);
    }
};

const CreatePost = ({ navigation, route }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const { onPostCreated } = route.params || {};

    const handleSubmit = async () => {
        const newPost = { id: Math.floor(Math.random() * 100000), title, body };
        try {
            // Salva o novo post localmente
            await savePost(newPost);
            // Chama a função onPostCreated passando o novo post
            onPostCreated && onPostCreated(newPost);
            // Retorna para a tela anterior
            navigation.goBack();
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />
            <Text style={styles.label}>Body</Text>
            <TextInput
                style={styles.input}
                value={body}
                onChangeText={setBody}
            />
            <Button
                title="Submit"
                onPress={handleSubmit}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        marginVertical: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
    },
});

export default CreatePost;
