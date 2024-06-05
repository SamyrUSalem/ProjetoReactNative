import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const Profile = ({ userCredentials }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [username, setUsername] = useState(userCredentials.username);
    const [password, setPassword] = useState(userCredentials.password);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadProfileImage();
    }, []);

    const loadProfileImage = async () => {
        try {
            const savedImage = await AsyncStorage.getItem(`${username}_profile_image`);
            if (savedImage) {
                setProfileImage(savedImage);
            }
        } catch (error) {
            console.error('Erro ao carregar imagem do perfil:', error);
        }
    };

    const saveProfileImage = async (imageUri) => {
        if (imageUri) {
            try {
                await AsyncStorage.setItem(`${username}_profile_image`, imageUri);
            } catch (error) {
                console.error('Erro ao salvar imagem do perfil:', error);
            }
        }
    };

    const saveProfileData = async () => {
        try {
            // Remove os dados antigos do usuário do AsyncStorage
            await AsyncStorage.removeItem(userCredentials.username);

            // Atualiza os dados do usuário no AsyncStorage
            const updatedUserData = { username, password };
            await AsyncStorage.setItem(username, JSON.stringify(updatedUserData));

            setIsEditing(false);
            Alert.alert('Sucesso', 'Dados do perfil atualizados com sucesso');
        } catch (error) {
            console.error('Erro ao salvar dados do usuário:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados do perfil');
        }
    };


    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão negada', 'Precisamos da sua permissão para acessar a galeria.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],  // Tornar a seleção da imagem quadrada
            quality: 1,
        });

        if (!result.cancelled) {
            setProfileImage(result.uri);
            saveProfileImage(result.uri);
        }
    };


    return (
        <View style={styles.container}>
            {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.image} />
            ) : (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>Nenhuma imagem</Text>
                </View>
            )}
            {isEditing ? (
                <>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Username"
                    />
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry={true}
                    />
                    <Button title="Salvar" onPress={saveProfileData} />
                </>
            ) : (
                <>
                    <Text style={styles.username}>Username: {username}</Text>
                    <Text style={styles.password}>Password: {password}</Text>
                    <Button title="Editar" onPress={() => setIsEditing(true)} />
                </>
            )}
            <Button title="Adicionar/Trocar Imagem" onPress={pickImage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50, // Tornar a imagem circular
        marginBottom: 20,
    },
    placeholder: {
        width: 100,
        height: 100,
        borderRadius: 50, // Tornar o placeholder circular
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    placeholderText: {
        color: '#888',
    },
    input: {
        width: '100%',
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
    },
    username: {
        fontSize: 20,
        marginVertical: 10,
    },
    password: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
    },
});

export default Profile;
