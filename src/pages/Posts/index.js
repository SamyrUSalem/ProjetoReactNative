import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditPostModal from '../../components/EditPostModal';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const STORAGE_KEY = '@posts';

const Posts = ({ navigation, route }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [likedPosts, setLikedPosts] = useState([]);
    const [likeCounts, setLikeCounts] = useState({});

    useEffect(() => {
        loadPosts();
    }, []);

    useEffect(() => {
        if (route.params?.newPost) {
            setPosts(prevPosts => [route.params.newPost, ...prevPosts]);
        }
    }, [route.params?.newPost]);

    const loadPosts = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            const savedPosts = jsonValue != null ? JSON.parse(jsonValue) : [];
            setPosts(savedPosts);
            setLoading(false);
        } catch (error) {
            console.error('Error loading posts:', error);
            setLoading(false);
        }
    };
    const savePosts = async (updatedPosts) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
            console.log('Posts saved locally:', updatedPosts);
        } catch (error) {
            console.error('Error saving posts locally:', error);
        }
    };

    const handleCreatePost = () => {
        navigation.navigate('CreatePost', { onPostCreated: addNewPost });
    };

    const addNewPost = (newPost) => {
        setPosts([newPost, ...posts]);
        savePosts([newPost, ...posts]);
    };

    const handleDeletePost = async (postId) => {
        Alert.alert(
            'Apagar Post',
            'Tem Certeza?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        const updatedPosts = posts.filter(post => post.id !== postId);
                        setPosts(updatedPosts);
                        await savePosts(updatedPosts);
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const handleEditPost = (post) => {
        setCurrentPost(post);
        setTitle(post.title);
        setBody(post.body);
        setModalVisible(true);
    };

    const handleSaveEdit = async () => {
        const updatedPost = { ...currentPost, title, body };
        const updatedPosts = posts.map(post => (post.id === updatedPost.id ? updatedPost : post));
        setPosts(updatedPosts);
        await savePosts(updatedPosts);
        setModalVisible(false);
    };

    const handleLikePost = (postId) => {
        // Verifica se o post já foi "gostado" pelo usuário
        const isLiked = likedPosts.includes(postId);
        // Atualiza a lista de posts "gostados"
        if (isLiked) {
            setLikedPosts(prevLikedPosts => prevLikedPosts.filter(id => id !== postId));
            setLikeCounts({
                ...likeCounts,
                [postId]: likeCounts[postId] ? likeCounts[postId] - 1 : 0,
            });
        } else {
            setLikedPosts(prevLikedPosts => [...prevLikedPosts, postId]);
            setLikeCounts({
                ...likeCounts,
                [postId]: likeCounts[postId] ? likeCounts[postId] + 1 : 1,
            });
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <TouchableOpacity
                            style={styles.postItem}
                            onPress={() => navigation.navigate('PostDetails', { post: item })}
                        >
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.body}>{item.body}</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Editar"
                                onPress={() => handleEditPost(item)}
                            />
                            <TouchableOpacity onPress={() => handleLikePost(item.id)}>
                                <View style={styles.likeContainer}>
                                    <FontAwesomeIcon icon={faThumbsUp} size={20} color={likedPosts.includes(item.id) ? 'green' : 'black'} />
                                    <Text style={styles.likeCount}>{likeCounts[item.id] || 0}</Text>
                                </View>
                            </TouchableOpacity>
                            <Button
                                title="Deletar"
                                color="red"
                                onPress={() => handleDeletePost(item.id)}
                            />
                        </View>
                    </View>
                )}
            />
            <Button
                title="Create New Post"
                onPress={handleCreatePost}
            />
            <EditPostModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveEdit}
                title={title}
                setTitle={setTitle}
                body={body}
                setBody={setBody}
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    postItem: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    body: {
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeCount: {
        marginLeft: 5,
    },
});

export default Posts;
