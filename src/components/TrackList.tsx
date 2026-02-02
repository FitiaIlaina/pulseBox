import library from '@/assets/data/library.json';
import { utilStyles } from "@/styles";
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { FlatList, FlatListProps, View } from "react-native";
import { TrackListItem } from "./TrackListItem";


interface Track {
    title: string;
    artist?: string;
    artwork?: string;
    url: string;
}

export const audioMap: { [key: string]: any } = {
    'audio/adore.mp3': require('@/assets/audio/adore.mp3'),
    'audio/before.mp3': require('@/assets/audio/before.mp3'),
    'audio/bts.mp3': require('@/assets/audio/bts.mp3'),
    'audio/coldplay.mp3': require('@/assets/audio/coldplay.mp3'),
    'audio/doses.mp3': require('@/assets/audio/doses.mp3'),
    'audio/fixyou.mp3': require('@/assets/audio/fixyou.mp3'),
    'audio/Infinity.mp3': require('@/assets/audio/Infinity.mp3'),
    'audio/say.mp3': require('@/assets/audio/say.mp3'),
    'audio/teky.mp3': require('@/assets/audio/teky.mp3'),
    'audio/time.mp3': require('@/assets/audio/time.mp3'),
};

export const audioManager = {
    sound: null as Audio.Sound | null,
    currentTrack: null as Track | null,
    isPlaying: false,
    onPlaybackStatusUpdate: null as ((status: any) => void) | null,

    setPlaybackStatusUpdate(callback: (status: any) => void) {
        this.onPlaybackStatusUpdate = callback;
    }
};

export type TrackListProps = Omit<FlatListProps<Track>, 'renderItem'> & {
    data?: Track[];
};

// mampilahatra anile hira 
const Hiramilahatra = (tracks: Track[]) => {
    return [...tracks].sort((a,b)=> {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    });
}


export const TrackList = ({ data = library, ...flatlistProps }: TrackListProps) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const milahatra = Hiramilahatra(data);

    useEffect(() => {
        async function setupAudio() {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
            });
            console.log('Mandeha tsara ny hira');
        }
        
        setupAudio();
    }, []);

    async function playSound(track: Track) {
        console.log('Mandefa anile hira:', track.url);

        if (audioManager.sound) {
            await audioManager.sound.unloadAsync();
        }

        const source = audioMap[track.url];
        if (!source) {
            console.error('Audio source tsy hita :', track.url);
            return;
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
            source,
            { shouldPlay: true },
            (status) => {
                console.log('Playback status:', status);
                if (audioManager.onPlaybackStatusUpdate) {
                    audioManager.onPlaybackStatusUpdate(status);
                }
            }
        );
        
        audioManager.sound = newSound;
        audioManager.currentTrack = track;
        audioManager.isPlaying = true;
        setSound(newSound);
        
        await newSound.playAsync();
    };
    
    
    useEffect(() => {
        return sound
            ? () => {
                console.log('Cleaning up sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return (
        <FlatList
            data={milahatra}
            contentContainerStyle={{paddingTop: 10, paddingBottom: 128}}
            ItemSeparatorComponent={() => <View style={utilStyles.itemSeparator}/>}
            renderItem={({item: track}) => (
                <TrackListItem
                    track={track}
                    onPress={() => playSound(track)}
                />
            )}
            {...flatlistProps}
        />
    );
};