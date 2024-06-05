import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { savePost } from '../../utils/storagePosts'; // Importando o utilitário

function CreatePost({ navigation, route }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const { onPostCreated } = route.params || {};

    const handleSubmit = async () => {
        const newPost = { id: Math.floor(Math.random() * 100000), title, body };
        try {
            await savePost(newPost);
            onPostCreated && onPostCreated(newPost);
            navigation.goBack();
        } catch (error) {
            console.error('Error ao salvar o post:', error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Título</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />
            <Text style={styles.label}>Mensagem</Text>
            <TextInput
                style={styles.input}
                value={body}
                onChangeText={setBody}
            />
            <Button
                title="Enviar"
                onPress={handleSubmit}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
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
