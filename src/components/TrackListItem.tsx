
import { colors, fontSize } from "@/constants/tokens";
import { defaultStyles } from "@/styles";
import { useFavorites } from "./useFavorite";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";

export type TrackListItemProps ={
    track :{title:string ,
             image?: string,
              artist? : string,
              url: string}
    onPress?: () => void ;
}

export const TrackListItem = ({track, onPress}:TrackListItemProps) => {
    const isActiveTrack = false
    const { isFavorite, toggleFavorite } = useFavorites();

    const handleFavoritePress = (e: any) => {
        e.stopPropagation();
        toggleFavorite(track);
    };

    return(
    <TouchableHighlight onPress={onPress}>
        <View style={styles.trackItemContainer}>
            <View>
                 <Image 
                        source={
                            require('@/assets/images/unknown_track.png')
                        }
                        style={[
                            styles.trackArtWorkImage,
                            { opacity: isActiveTrack ? 0.6 : 1 }
                        ]}
                    />
            </View>
            <View style={{ width: '100%'}}>
                <Text numberOfLines={1}
                style={{
                    ...styles.trackTitleText,color: isActiveTrack ?colors.primary: colors.text, }}>{track.title}
                </Text>
                    {track.artist && (
                        <Text numberOfLines={1} style={styles.trackArtistText}>{track.artist}</Text>
                    )}
            </View>
            <TouchableOpacity 
                    onPress={handleFavoritePress}
                    style={styles.favoriteButton}
                >
                    <Ionicons 
                        name={isFavorite(track) ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavorite(track) ? colors.primary : colors.text}
                    />
            </TouchableOpacity>
        </View>
       
    </TouchableHighlight>
    ) 
}
const styles = StyleSheet.create({
    trackItemContainer:{
        flexDirection: 'row',
        columnGap: 14,
        alignItems: 'center',
        paddingRight: 20,
    },
    trackArtWorkImage:{
        borderRadius: 8,
    width: 50,
        height: 50,
        margin: 10,
        //padding: 10
       
    },
    trackTitleText:{
        ...defaultStyles.text,
        fontSize: fontSize.sm,
        fontWeight: '600',
        maxWidth: '98%',
    },

    trackArtistText: {
        ...defaultStyles.text,
        color: colors.textMuted,
        fontSize: 14,
        marginTop: 4,
    },
    favoriteButton: {
        padding: 8,
        position: 'absolute',
        right: 16,
    }
})

