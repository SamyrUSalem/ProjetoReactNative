// src/pages/PostDetails.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommentInput from '../../components/CommentInput';
import EditCommentModal from '../../components/EditCommentModal';

const STORAGE_KEY = '@comments_';

const PostDetails = ({ route }) => {
    const { post } = route.params;
    const [comments, setComments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(`${STORAGE_KEY}${post.id}`);
            const savedComments = jsonValue != null ? JSON.parse(jsonValue) : [];
            setComments(savedComments);
        } catch (error) {
            console.error('Error ao carregar os comentarios:', error);
        }
    };

    const saveComments = async (updatedComments) => {
        try {
            await AsyncStorage.setItem(`${STORAGE_KEY}${post.id}`, JSON.stringify(updatedComments));
        } catch (error) {
            console.error('Error ao salvar os comentarios:', error);
        }
    };

    const handleAddComment = async (comment) => {
        const newComment = {
            id: Date.now().toString(),
            text: comment,
        };
        const updatedComments = [newComment, ...comments];
        setComments(updatedComments);
        await saveComments(updatedComments);
    };

    const handleDeleteComment = (commentId) => {
        Alert.alert(
            'Deletar Comentário',
            'Tem certeza?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        const updatedComments = comments.filter(comment => comment.id !== commentId);
                        setComments(updatedComments);
                        await saveComments(updatedComments);
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const handleEditComment = (comment) => {
        setCurrentComment(comment);
        setCommentText(comment.text);
        setModalVisible(true);
    };

    const handleSaveEdit = async () => {
        const updatedComment = { ...currentComment, text: commentText };
        const updatedComments = comments.map(comment => (comment.id === updatedComment.id ? updatedComment : comment));
        setComments(updatedComments);
        await saveComments(updatedComments);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.body}>{post.body}</Text>
            <CommentInput onAddComment={handleAddComment} />
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                        <Text>{item.text}</Text>
                        <View style={styles.buttonContainer}>
                            <Button title="Editar" onPress={() => handleEditComment(item)} />
                            <Button title="Deletar" color="red" onPress={() => handleDeleteComment(item.id)} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text>No comments yet.</Text>}
            />
            <EditCommentModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveEdit}
                text={commentText}
                setText={setCommentText}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    body: {
        fontSize: 16,
        marginBottom: 16,
    },
    commentItem: {
        padding: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
});

export default PostDetails;
