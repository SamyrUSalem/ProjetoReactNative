import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import EditPostModal from '../../components/EditPostModal';
import { faThumbsUp, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { loadPosts, loadPostsFromStorage, savePosts } from '../../utils/postService';
import { saveLikes, restoreLikesFromStorage } from '../../utils/storage';
import { handleSharePost } from '../../utils/share';
import { addNewPost } from '../../utils/addNewPost';
import { deletePost } from '../../utils/deletePost';
import { editPost } from '../../utils/editPost';
import { saveEdit } from '../../utils/saveEdit';
import { likePost } from '../../utils/likePost';


function Posts({ navigation, route }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [likedPosts, setLikedPosts] = useState([]);
    const [likeCounts, setLikeCounts] = useState({});

    useEffect(() => {
        loadPostsFromStorage(setPosts, setLoading);
    }, []);

    useEffect(() => {
        if (route.params?.newPost) {
            addNewPost(route.params.newPost, posts, setPosts);
        }
    }, [route.params?.newPost]);

    useEffect(() => {
        restoreLikesFromStorage(setLikedPosts, setLikeCounts);
    }, []);

    const handleCreatePost = () => {
        navigation.navigate('CreatePost', { onPostCreated: newPost => addNewPost(newPost, posts, setPosts) });
    };

    const handleDeletePost = (postId) => {
        deletePost(postId, posts, setPosts);
    };

    const handleEditPost = (post) => {
        editPost(post, setCurrentPost, setTitle, setBody, setModalVisible);
    };

    const handleSaveEdit = async () => {
        saveEdit(currentPost, title, body, posts, setPosts, setModalVisible);
    };

    const handleLikePost = async (postId) => {
        likePost(postId, likedPosts, setLikedPosts, likeCounts, setLikeCounts);
    };

    const renderItem = useCallback(({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.postItem}
                onPress={() => navigation.navigate('PostDetails', { post: item })}
            >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <Button title="Editar" onPress={() => handleEditPost(item)} />
                <TouchableOpacity onPress={() => handleLikePost(item.id)}>
                    <View style={styles.iconContainer}>
                        <FontAwesomeIcon icon={faThumbsUp} size={20} color={likedPosts.includes(item.id) ? 'green' : 'black'} />
                        <Text style={styles.iconText}>{likeCounts[item.id] || 0}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSharePost(item.title, item.body)}>
                    <View style={styles.shareContainer}>
                        <FontAwesomeIcon icon={faShare} size={20} color="blue" />
                        <Text style={styles.shareText}>Compartilhar</Text>
                    </View>
                </TouchableOpacity>
                <Button title="Deletar" color="red" onPress={() => handleDeletePost(item.id)} />
            </View>
        </View>
    ), [likedPosts, likeCounts]);

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
                renderItem={renderItem}
            />
            <Button title="Novo Post" onPress={handleCreatePost} />
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
        backgroundColor: '#DAD8D6',
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
        color: '#667',
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
    shareContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shareText: {
        marginLeft: 5,
        color: 'blue',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconText: {
        marginLeft: 5,
    },
});

export default Posts;
