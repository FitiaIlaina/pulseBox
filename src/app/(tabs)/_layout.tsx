import { FloatingPlayer } from "@/components/FloatingPlayer"
import { colors, fontSize } from "@/constants/tokens"
import { AntDesign, FontAwesome, FontAwesome6, Ionicons,  } from '@expo/vector-icons'
import { BlurView } from "expo-blur"
import { Tabs } from "expo-router"
import { StyleSheet } from "react-native"

const TabsNavigation = () => {
    return (
        <>
                <Tabs screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarLabelStyle: {
                    fontSize: fontSize.xs,
                    fontWeight: '500',

                },
                tabBarLabelPosition: 'below-icon',

                headerShown: false,

                tabBarStyle:{
                    position: 'absolute',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    height: 55,
                    borderTopWidth: 0,
                    // paddingBottom: 0,
                    paddingTop: 0,
                    // marginBottom: 5,
                    // marginTop: 0,
                },

                tabBarBackground: () => <BlurView intensity={95}
                style={{
                    ...StyleSheet.absoluteFillObject,
                    overflow: 'hidden',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    
                    paddingTop: 50,
                }}/>,

            }}>
                <Tabs.Screen name="(songs)" options={{
                    title: "Songs",
                    tabBarIcon: ({color}) => <Ionicons name='musical-notes-sharp' size={24} color={color}/>,
                }}/> 
                
                
                
                <Tabs.Screen name="favorites" options={{
                    title: "Favorites",
                    tabBarIcon: ({color}) => <FontAwesome name='heart' size={20} color={color}/>,
                }}/>
                
                <Tabs.Screen name="video" options={{
                    title: "Video",
                    tabBarIcon: ({color}) => <AntDesign name='youtube' size={20} color={color}/>,
                }}/>

            </Tabs>
            <FloatingPlayer
				style={{
					position: 'absolute',
					left: 8,
					right: 8,
					bottom: 78,
				}}
			/>
            
        </>
    
    )
}

export default TabsNavigation