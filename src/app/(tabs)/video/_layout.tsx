import { StackScreenWithSearchBar } from "@/constants/layout";
import { defaultStyles } from "@/styles";
import { Stack } from "expo-router";
import { View } from "react-native";
import React from "react";
import { VideoProvider } from "./VideoContent";
import VideoScreen from '.';

const VideoScreenLayout = () => {
    return (
        <View style={defaultStyles.container}>
            <VideoProvider>
                <Stack>
                    <Stack.Screen name="index" options={{
                        ...StackScreenWithSearchBar,
                        headerTitle: 'Videos',
                        headerShown: true,
                    }} />
                    <VideoScreen />
                </Stack>
            </VideoProvider>
        </View>
    );
}

export default VideoScreenLayout;
