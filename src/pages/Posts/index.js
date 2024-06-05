import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditPostModal from '../../components/EditPostModal';
import { faThumbsUp, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Share } from 'react-native';


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
        loadPostsFromStorage(); // Carregar dados do AsyncStorage
    }, []);

    useEffect(() => {
        if (route.params?.newPost) {
            setPosts(prevPosts => [route.params.newPost, ...prevPosts]);
        }
    }, [route.params?.newPost]);

    const loadPostsFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            const savedPosts = jsonValue != null ? JSON.parse(jsonValue) : [];
            if (savedPosts.length > 0) {
                setPosts(savedPosts);
                setLoading(false);
            } else {
                // Se não houver dados armazenados, carregar da API
                loadPosts();
            }
        } catch (error) {
            console.error('Error loading posts from storage:', error);
            setLoading(false);
        }
    };

    const loadPosts = async () => {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
            setPosts(response.data);
            setLoading(false);
            // Salvar os dados carregados no AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
        } catch (error) {
            console.error('Error loading posts from API:', error);
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


    const handleLikePost = async (postId) => {
        try {
            // Verifica se o post já foi "gostado" pelo usuário
            const isLiked = likedPosts.includes(postId);
            // Atualiza a lista de posts "gostados"
            if (isLiked) {
                // Se o post já foi curtido, remove da lista de curtidas
                setLikedPosts(prevLikedPosts => prevLikedPosts.filter(id => id !== postId));
                setLikeCounts(prevLikeCounts => ({
                    ...prevLikeCounts,
                    [postId]: prevLikeCounts[postId] ? prevLikeCounts[postId] - 1 : 0,
                }));
            } else {
                // Se o post não foi curtido, adiciona à lista de curtidas
                setLikedPosts(prevLikedPosts => [...prevLikedPosts, postId]);
                setLikeCounts(prevLikeCounts => ({
                    ...prevLikeCounts,
                    [postId]: prevLikeCounts[postId] ? prevLikeCounts[postId] + 1 : 1,
                }));
            }

            // Salva os likes atualizados no AsyncStorage, juntamente com o estilo do ícone
            const updatedLikes = {
                likedPosts: likedPosts,
                likeCounts: likeCounts,
            };
            await AsyncStorage.setItem('@likes', JSON.stringify(updatedLikes));
        } catch (error) {
            console.error('Error saving likes:', error);
        }
    };

    //Sistema para salvar os Like (Tentativa)
    const restoreLikesFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@likes');
            if (jsonValue !== null) {
                const savedLikes = JSON.parse(jsonValue);
                setLikedPosts(savedLikes.likedPosts);
                setLikeCounts(savedLikes.likeCounts);
            }
        } catch (error) {
            console.error('Error restoring likes from storage:', error);
        }
    };

    useEffect(() => {
        restoreLikesFromStorage();
    }, []);

    const handleSharePost = async (postId, postTitle, postBody) => {
        try {
            const message = `Confira este post: ${postTitle}\n${postBody}`;
            await Share.share({
                message: message,
                title: 'Compartilhar Post',
            });
            console.log('Post compartilhado');
        } catch (error) {
            console.error('Erro ao compartilhar o post:', error.message);
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
                                <View style={styles.iconContainer}>
                                    <FontAwesomeIcon icon={faThumbsUp} size={20} color={likedPosts.includes(item.id) ? 'green' : 'black'} />
                                    <Text style={styles.iconText}>{likeCounts[item.id] || 0}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSharePost(item.id, item.title, item.body)}>
                                <View style={styles.shareContainer}>
                                    <FontAwesomeIcon icon={faShare} size={20} color="blue" />
                                    <Text style={styles.shareText}>Compartilhar</Text>
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
