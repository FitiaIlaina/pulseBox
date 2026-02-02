import { colors, screenPadding } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { ActivityIndicator, StyleSheet, View, Image , Text, PanResponder, Dimensions} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import{useEffect, useState, useRef} from 'react'
import { audioManager, audioMap } from '@/components/TrackList'
import { PlayPauseButton, SkipToNextButton, SkipToPreviousButton } from '@/components/PlayerControls'
import { Audio } from 'expo-av';
import library from '@/assets/data/library.json';
import { TouchableOpacity , Animated} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { useFavorites } from '@/components/useFavorite'
import { Stack , useRouter} from 'expo-router'
import { startMapper } from 'react-native-reanimated'


interface Track {
    title: string;
    artist?: string;
    artwork?: string;
    url: string;
}
const PlayerScreen = () => {
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTrack, setCurrentTrack] = useState<Track | null> (null)
	const [currentplayer, setCurrentplayer] = useState(0);
	const { isFavorite, toggleFavorite } = useFavorites();
	const router = useRouter();

	// glisse down 
	const translateY = useRef(new Animated.Value(0)).current

	const panResponder = useRef(PanResponder.create({
		onMoveShouldSetPanResponder: (event, glisse) => {
			return glisse.dy >10;
		},
		onPanResponderMove: (evt, glisse) => {
			if(glisse.dy > 0){
				translateY.setValue(glisse.dy)
			}
		},
		onPanResponderRelease: (evt,glisse ) =>{
			if(glisse.dy > 100){
				router.back()
			}else{
				Animated.spring(translateY, {
					toValue: 0,
					useNativeDriver: true,
				}).start()
			}
		},
	})
	).current


	const handleFavoritePress = (e: any) => {
        e.stopPropagation();
		if (currentTrack)
        {
			toggleFavorite(currentTrack);
			console.log(currentTrack);
		}
    };


	useEffect (() => {
		audioManager.setPlaybackStatusUpdate((status) => {
			setIsPlaying(status.isPlaying)
			if(audioManager.currentTrack){
				setCurrentTrack(audioManager.currentTrack)
			}
		});
	}, []);

	const handlePlayPause = async()=> {
		if(audioManager.sound){
			if(isPlaying){
				await audioManager.sound.pauseAsync();
			}
			else {
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
			const nextIndex = (currentplayer - 1 + takeKeys.length) % takeKeys.length;
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

	if(!audioManager.sound){
		console.log("audioManager.sound is no initialized ")
	}


	if (!currentTrack) {
		return (
			<View style={styles.chargement}>
				<ActivityIndicator color={colors.icon} />
			</View>
		)
	}



	return (
		<>
			<Stack.Screen options={{headerShown:false}}/>
				<Animated.View style={[styles.overlayContainer, {transform: [{translateY}] }]} {...panResponder.panHandlers}>
					<DismissPlayerSymbol />
					<View style={styles.contentContainer}>
						<Image source={require('assets/images/unknown_track.png')} style={styles.albumArt}/>
						<Text style={styles.title}>{currentTrack.title}</Text>
						{currentTrack.artist && (
							<Text style={styles.artist}>{currentTrack.artist}</Text>
						)}
						<TouchableOpacity 
							onPress={handleFavoritePress}
							style={styles.favoriteButton}
						>
							<Ionicons 
								name={currentTrack && isFavorite(currentTrack) ? "heart" : "heart-outline"}
								size={50}
								color={currentTrack && isFavorite(currentTrack) ? colors.primary : colors.text}
							/>
					</TouchableOpacity>
					<View style={styles.controls}>
							<SkipToPreviousButton onPress={handlePrevious}iconSize={44}/>
								<PlayPauseButton
									iconSize={48}
									isPlaying={isPlaying}
									onPress={handlePlayPause}
								/>
							<SkipToNextButton onPress={handleNext} iconSize={44} />
							
						</View>
					</View>
				</Animated.View>
		</>
		

					
	)
}

const DismissPlayerSymbol = () => {
	const { top } = useSafeAreaInsets()

	return (
		<View
			style={{
				position: 'absolute',
				top: top + 8,
				left: 0,
				right: 0,
				flexDirection: 'row',
				justifyContent: 'center',
			}}
		>
			<View
				accessible={false}
				style={{
					width: 50,
					height: 8,
					borderRadius: 8,
					backgroundColor: '#fff',
					opacity: 0.7,
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	overlayContainer: {
		...defaultStyles.container,
		paddingHorizontal: screenPadding.horizontal,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	chargement:{
		flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
	},
	contentContainer: {
		flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50,
	},
	albumArt:{
		width: 300,
        height: 300,
        borderRadius: 20,
        marginBottom: 30,
	},
	title :{
		...defaultStyles.text,
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
	},
	artist: {
		...defaultStyles.text,
        fontSize: 18,
        opacity: 0.8,
        marginBottom: 30,
        textAlign: 'center',
	},
	controls:{
		flexDirection: 'row',
        alignItems: 'center',
        columnGap: 30,
	},
	favoriteButton:{
		margin:5,
		marginTop:-25,
		padding: 2
	}
	
})

export default PlayerScreen;
