import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useFocusEffect } from '@react-navigation/native'; //import mba i-contrôler-na ny famakiana vidéo(s) rehefa miova écran/page hafa ny use
import { useVideoContext } from './VideoContent';
import { audioManager } from '@/components/TrackList';

interface Video {
    id: number;
    videoSource: any;
    title: string;
}

const videos = [
    {
        id: 1,
        videoSource: require('./data/Billie Eilish - SIX FEET UNDER (Lyrics)(720P_HD).mp4'),
        title: 'Billie Eilish - SIX FEET UNDER (Lyrics)',
    },
    {
        id: 2,
        videoSource: require('./data/Billie__Eilish - Your Power (Lyrics).mp4'),
        title: 'Billie__Eilish - Your Power (Lyrics)',
    },
    {
        id: 3,
        videoSource: require('./data/Kalash - Mwaka Moon ft. Damso(480P).mp4'),
        title: 'Kalash ft Damso - Mwaka Moon',
    },
    {
        id: 4,
        videoSource: require('./data/LION HILL angala fitia.mp4'),
        title: 'Lion Hill - Angala Fitia',
    },
    {
        id: 5,
        videoSource: require('./data/TeddySwims.mp4'),
        title: 'Are You Even Real (Lyrics) _Teddy Swims Feat Giveon',
    },
];

const VideoItem = ({ video }: { video: Video }) => {
    const { currentVideoId, setCurrentVideoId } = useVideoContext();
    const player = useVideoPlayer(video.videoSource, async (player) => {

        if(audioManager.sound){
          await audioManager.sound.stopAsync();
          await audioManager.sound.unloadAsync();
          audioManager.sound = null;
          audioManager.isPlaying = false;
          player.loop = false;
          player.pause();
        }

        player.loop = true;
        player.play();
    });

    //Gestion de lecture mba tsy handeha automatiquement au tout début de l'ouverture de l'application ny vidéos rehetra
    useEffect(() => {
        if (currentVideoId === video.id) {
            player.pause();
        } else {
            player.pause();
        }
    }, [currentVideoId, player, video.id]);

    const handleVideoPress = () => {
        setCurrentVideoId(video.id);
    };

    //M-pause an'l video rehefa miala ao amin'ilay screen video
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                player.pause();
            };
        }, [player])
    );

    return (
        
        <View style={styles.videoContainer} onTouchEnd={handleVideoPress}>
            
            <Text style={styles.title}>{video.title}</Text>
            
            <VideoView
                style={styles.video}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
            />
            
        </View>
    );
};

export default function VideoScreen() {
    return (
        <ScrollView style={styles.container}>

            {videos.map((video) => (
                <VideoItem key={video.id} video={video} />
            ))}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#000',
    },

    videoContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },

    video: {
        width: '100%',
        height: 275,
        marginBottom: 50,
    },

});
