import library from '@/assets/data/library.json'
import { PlayPauseButton, SkipToNextButton, SkipToPreviousButton } from '@/components/PlayerControls'
import { defaultStyles } from '@/styles'
import { Audio } from 'expo-av'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native'
import { audioManager, audioMap } from './TrackList'

interface Track {
    title: string;
    artist?: string;
    artwork?: string;
    url: string;
}

interface Track {
    title: string;
    artist?: string;
    artwork?: string;
    url: string;
}

export const FloatingPlayer = ({ style }: ViewProps) => {
	const router = useRouter();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [currentplayer, setCurrentplayer] = useState(0)


	useEffect(() => {
        // manao mise a jour ny état any lecture miankina am statut
        audioManager.setPlaybackStatusUpdate((status) => {
            setIsPlaying(status.isPlaying);
            if (audioManager.currentTrack) {
                setCurrentTrack(audioManager.currentTrack);
            }
        });
    }, []);

	const handlePlayPause = async () => {
        if (audioManager.sound) {
            if (isPlaying) {
                await audioManager.sound.pauseAsync();
            } else {
                await audioManager.sound.playAsync();
            }
        }
    };
	
    const handleNext = async () =>{
		if(audioManager.sound){
			// manajanona anile hira mandeha
			await audioManager.sound.stopAsync();
			await audioManager.sound.unloadAsync();

			//mandray anile audioMap type Object 
			const takeKeys = Object.keys(audioMap);

			// mipasser am next
			const nextIndex = (currentplayer + 1) % takeKeys.length;
			const nextTakeKeys =takeKeys[nextIndex];

			// mitady anile hira anaty libraryjson
			const nextTrack = library.find(track=> track.url === nextTakeKeys)


			if(nextTrack){
				const {sound : newSound } = await Audio.Sound.createAsync(
					audioMap[nextTakeKeys],
					{shouldPlay: true},
					(status) => {
						console.log('Playback status:', status);
						if (audioManager.onPlaybackStatusUpdate) {
							audioManager.onPlaybackStatusUpdate(status);
						}
					}
				);
				audioManager.sound = newSound;
				audioManager.currentTrack = nextTrack;
				audioManager.isPlaying= true;
				setCurrentplayer(nextIndex);
			}
 
		}
	};
    const handlePrevious = async () =>{
		if(audioManager.sound){
			// manajanona anile hira mandeha
			await audioManager.sound.stopAsync();
			await audioManager.sound.unloadAsync();

			//mandray anile audioMap type Object 
			const takeKeys = Object.keys(audioMap);

			// makany am previous
			const nextIndex = (currentplayer - 1) % takeKeys.length;
			const nextTakeKeys =takeKeys[nextIndex];

			// mitady anile hira anaty libraryjson
			const nextTrack = library.find(track=> track.url === nextTakeKeys)


			if(nextTrack){
				const {sound : newSound } = await Audio.Sound.createAsync(
					audioMap[nextTakeKeys],
					{shouldPlay: true},
					(status) => {
						console.log('Playback status:', status);
						if (audioManager.onPlaybackStatusUpdate) {
							audioManager.onPlaybackStatusUpdate(status);
						}
					}
				);
				audioManager.sound = newSound;
				audioManager.currentTrack = nextTrack;
				audioManager.isPlaying= true;
				setCurrentplayer(nextIndex);
			}
 
		}
	};

//mampiseho anile hira ho ngeza
	const handlePress = () => {
		router.navigate('/player')
	}

	if (!currentTrack) return null

	return (
		 <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={[styles.container, style]}>
            <>
                <Image
                    source={
                        require('@/assets/images/unknown_track.png')
                    }
                    style={styles.trackArtworkImage}
                />

                <View style={styles.trackTitleContainer}>
                    <Text style={styles.trackTitle}>{currentTrack.title}</Text>
                </View>

                <View style={styles.trackControlsContainer}>
                    <SkipToPreviousButton iconSize={22} onPress={handlePrevious}/>
                    <PlayPauseButton 
                        iconSize={24}
                        isPlaying={isPlaying}
                        onPress={handlePlayPause}
                    />
                    <SkipToNextButton iconSize={22} onPress={handleNext} />
                    
                </View>
            </>
        </TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#252525',
		padding: 8,
		borderRadius: 20,
		paddingVertical: 10,
	},
	trackArtworkImage: {
		width: 40,
		height: 40,
		borderRadius: 8,
	},
	trackTitle: {
		...defaultStyles.text,
		fontSize: 18,
		fontWeight: '600',
		paddingLeft: 10,
	},
	trackTitleContainer: {
		flex: 1,
		overflow: 'hidden',
		marginLeft: 10,
	},
	trackControlsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 20,
		marginRight: 16,
		paddingLeft: 16,
	},
})
