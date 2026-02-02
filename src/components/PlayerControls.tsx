import { colors } from '@/constants/tokens';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { Audio } from 'expo-av';

type PlayerControlsProps = {
    style?: ViewStyle;
};

type PlayerButtonProps = {
    style?: ViewStyle;
    iconSize?: number;
    isPlaying?: boolean;
    onPress?: () => void;
};

export const PlayPauseButton = ({ style, iconSize, isPlaying, onPress }: PlayerButtonProps) => {
    return (
        <View style={[{ height: iconSize }, style]}>
            <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
                <FontAwesome 
                    name={isPlaying ? 'pause' : 'play'} 
                    size={iconSize} 
                    color={colors.text}
                />
            </TouchableOpacity>
        </View>
    );
};

export const SkipToNextButton = ({ iconSize = 30 , onPress }: PlayerButtonProps) => {
    return (
        <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={onPress}
        >
            <FontAwesome6 
                name="forward" 
                size={iconSize} 
                color={colors.text}
            />
        </TouchableOpacity>
    );
};

export const SkipToPreviousButton = ({ 
    iconSize = 30,
    onPress 
}: PlayerButtonProps) => {
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
            <FontAwesome6 name="backward" size={iconSize} color={colors.text}/>
        </TouchableOpacity>
    );
};

// Hook utilitaire pour gérer la logique de lecture
export const useAudioControls = (sound: Audio.Sound | null) => {
    const handlePlayPause = async () => {
        if (!sound) return;
        
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
            if (status.isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
        }
    };

    return {
        handlePlayPause
    };
};