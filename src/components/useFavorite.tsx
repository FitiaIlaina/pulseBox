import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import library from '@/assets/data/library.json';

export type Track = {
    title: string;
    artist?: string;
    image?: string;
    url: string;
};


let globalFavorites: Track[] = [];//izy rehetra
let listeners: ((favorites: Track[]) => void)[] = [];

const notifListeners = () => {
    listeners.forEach(listener => listener(globalFavorites));
};

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Track[]>(globalFavorites);

    useEffect(() => {
        // ajout listener
        listeners[listeners.length] = setFavorites;
        
        //chargement anile favoris refa misy hira iray natao favoris
        if (listeners.length === 1) {
            loadFavorites();
        } else {
            
            setFavorites(globalFavorites);
        }

       
        return () => {
            //rehefa tsy fav
            listeners = listeners.filter(listener => listener !== setFavorites);
        };
    }, []);

    const loadFavorites = async () => {
      
            const storedFavorites = await AsyncStorage.getItem('favorites');
                if (storedFavorites) {
                    globalFavorites = JSON.parse(storedFavorites);
                    notifListeners();
                }
    };

    const saveFavorites = async (newFavorites: Track[]) => {
      
            await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
            globalFavorites = newFavorites;
            notifListeners();
       
    };

    const toggleFavorite = (track: Track) => {
        if (isFavorite(track)) {
            console.log('miala anaty favorites:', track.title);
            
            const newFavorites = globalFavorites.filter(
                (favorite) => favorite.url !== track.url
            );
            saveFavorites(newFavorites);
        } else {
            console.log('Ajouter-na anaty favorites:', track.title);
            const songFromLibrary = library.find(song => song.url === track.url);
            if (songFromLibrary) {
                const newFavorites = [...globalFavorites, songFromLibrary];
                saveFavorites(newFavorites);
            }
        }
    };

    const isFavorite = (track: Track): boolean => {
        for (let i = 0; i < globalFavorites.length; i++) {
            if (globalFavorites[i].url === track.url) {
                return true;
            }
        }
        return false;
    };

    return {
        favorites,
        toggleFavorite,
        isFavorite,
    };
};