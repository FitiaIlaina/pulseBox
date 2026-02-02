import { TrackList } from '@/components/TrackList';
import { useFavorites } from '@/components/useFavorite';
import { colors, screenPadding } from '@/constants/tokens';
import { defaultStyles } from '@/styles';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Track {
    title: string;
    artist?: string;
    artwork?: string;
    url: string;
}
const FavoritesScreen = () => {
    const { favorites } = useFavorites();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredTrack, setFilteredTrack] = useState<Track[]>(favorites);
    const [isLoading, setIsLoading] = useState(false);

    // mandaatra par alphabet

const milahatra = [...favorites].sort((a,b)=>a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

    console.log('Favorites in FavoritesScreen:', milahatra);

    // recherche 
    const handleSearch = async(text: string) => {
        setSearchQuery(text);
        setIsLoading(true);

        if (text.trim() === '') {
            setFilteredTrack(favorites);
            setTimeout(() => setIsLoading(false), 500);
            return;
        }
        
   
        const searchItem = text.toLowerCase();

        const filtered = favorites.filter((track: Track) =>{
            const title = track.title.toLowerCase().includes(searchItem);
            const artist = track.artist?.toLowerCase().includes(searchItem);
            return title || artist;
        });

        
    
        
    setFilteredTrack(filtered);
    setTimeout(() => setIsLoading(false), 500);
    
    };

    const clearsearch= () => {
        setSearchQuery('');
        setFilteredTrack(favorites)
    }

    return (
        <View style={defaultStyles.container}>

<SafeAreaView style={styles.searchContainer}>
             <Ionicons 
                name="search" 
                size={20} 
                color={colors.text}
                style={styles.searchIcon}
            /> 
            <TextInput 
                style={styles.searchBar}
                placeholder="Find in favorites"
                placeholderTextColor={colors.text}
                value={searchQuery}
                onChangeText={handleSearch}
                autoCapitalize= "none"
            />
            {   searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearsearch}>
                    <Entypo name="cross" size={24} color="white" style={styles.clearIcon} />
                </TouchableOpacity>
            )

            }
           
        </SafeAreaView>
        {isLoading && (
            <View style={{ padding: 10, alignItems: 'center' }}>
                <ActivityIndicator color={colors.text} />
            </View>
            )}
            <ScrollView
                style={{ paddingHorizontal: screenPadding.horizontal }}
                contentInsetAdjustmentBehavior="automatic"
            >
                
                 {favorites.length === 0 ? (
                    <Text style={styles.emptyText}>No favorites yet</Text>
                ) : searchQuery.length > 0 && filteredTrack.length === 0 ?(
                    <Text style={styles.noResult}>No results found</Text>
                ):(
                    <TrackList
                    data={searchQuery.length > 0 ? filteredTrack : favorites} 
                        scrollEnabled={false}
                    />
                )}
               
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    noResult:{
        textAlign: 'center',
        fontSize: 16,
        color: "#666",
        marginTop: 20,
        
    },
    searchBar: {
        height: 40,
       flex: 1,
        padding: 10,
       borderRadius: 10,
        color: colors.text,
    
      
    },
    searchContainer:{
        margin:12,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#cdcdd15e',
        shadowColor: '#dadadf',
        shadowOffset: {
            width: 0,
            height: 2,

        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchIcon:{
        paddingLeft: 10
    },
    clearIcon:{
        paddingRight: 10
    }
    
})

export default FavoritesScreen;