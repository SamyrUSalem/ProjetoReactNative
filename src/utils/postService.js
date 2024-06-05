import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@posts';

export async function loadPosts(setPosts, setLoading) {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setPosts(response.data);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
    } catch (error) {
        console.error('Error ao carregar os posts da API:', error);
    } finally {
        setLoading(false);
    }
};

export async function loadPostsFromStorage(setPosts, setLoading) {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        const savedPosts = jsonValue != null ? JSON.parse(jsonValue) : [];
        if (savedPosts.length > 0) {
            setPosts(savedPosts);
        } else {
            await loadPosts(setPosts, setLoading);
        }
    } catch (error) {
        console.error('Error ao carregar os posts no armazenamento:', error);
    } finally {
        setLoading(false);
    }
};

export async function savePosts(updatedPosts) {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    } catch (error) {
        console.error('Error ao salvar os posts localmente:', error);
    }
};
