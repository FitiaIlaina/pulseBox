import library from '@/assets/data/library.json';
import { TrackList } from "@/components/TrackList";
import { colors } from "@/constants/tokens";
import { defaultStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivityIndicator } from 'react-native';

interface Track {
    title: string;
    artist?: string;
    artwork?: string;
    url: string;
}

const SongScreen = () => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredTrack, setFilteredTrack] = useState<Track[]>(library);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async(text: string) => {
        setSearchQuery(text);
        setIsLoading(true);

        if (text.trim() === '') {
            setFilteredTrack(library);
            setIsLoading(false);
            return;
        }
   
        const searchItem = text.toLowerCase();

        const filtered = library.filter((track: Track) =>{
            const title = track.title.toLowerCase().includes(searchItem);
            const artist = track.artist?.toLowerCase().includes(searchItem);
            return title || artist;
        });
       
    setFilteredTrack(filtered);
    setIsLoading(false)
    
    };

    const clearsearch= () => {
        setSearchQuery('');
        setFilteredTrack(library)
    }
   
    return (
    <View style={[defaultStyles.container, styles.Songcontainer]}>
       <SafeAreaView style={styles.searchContainer}>
             <Ionicons 
                name="search" 
                size={20} 
                color={colors.text}
                style={styles.searchIcon}
            /> 
            <TextInput 
                style={styles.searchBar}
                placeholder="Find in songs"
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
       <ScrollView keyboardShouldPersistTaps="handled"
       contentContainerStyle={styles.scrollcontent}
       showsVerticalScrollIndicator={false}
       scrollEnabled={true}
       > 
       {filteredTrack.length === 0 ?(
                    <Text style={styles.noResult}>No results found</Text>
                ):(
            <TrackList scrollEnabled={true} data={filteredTrack}/>)
    }
       </ScrollView>
    </View>
    )
}

const styles = StyleSheet.create({
    Songcontainer :{
    flex: 1,

    },
    scrollcontent:{
        flexGrow: 1,
    padding: 10,
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
    },
    noResult:{
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
        fontSize: 16
    }
    
})

export default SongScreen
