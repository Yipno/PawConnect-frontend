import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import TabBarButton from './TabBarButton';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function CustomTabBar({ state, descriptors, navigation }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState(0);

  const buttonWidth = dimensions.width / state.routes.length;
  const onTabBarLayout = e => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View onLayout={onTabBarLayout} style={styles.container}>
      <Animated.View
        style={[
          animatedButtonStyle,
          {
            position: 'absolute',
            backgroundColor: '#7f9C88',
            borderRadius: 28,
            height: dimensions.height - 24,
            width: buttonWidth,
          },
          position === 0 && [{ left: 14 }, { width: buttonWidth - 14 }],
          position === 1 && [{ left: 4 }, { width: buttonWidth - 10 }],
          position === 2 && [{ marginLeft: -2 }, { width: buttonWidth - 14 }],
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, { damping: 100, stiffness: 1600 });
          setPosition(index);
          navigation.navigate(route.name);
        };
        const iconName = options.tabBarIcon;

        return (
          <TabBarButton
            key={route.key}
            onPress={onPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? '#FAF9F7' : '#2E2F2F'}
            label={options.tabBarLabel}
            icon={iconName}
          />
          // <TouchableOpacity
          // onPress={() => navigation.navigate(route.name)}
          //   style={[styles.tabButton, isFocused && { backgroundColor: '#7f9C88' }]}>
          //   <Animated.View>
          //     <Ionicons name={iconName} size={32} color={isFocused ? '#FAF9F7' : '#2E2F2F'} />
          //   </Animated.View>
          //   <Animated.Text style={[styles.label]}>{options.tabBarLabel}</Animated.Text>
          // </TouchableOpacity>
        );
      })}
    </View>
  );
}
// isFocused && { display: 'none' }
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#faf9f7', //rgba(178, 18, 18, 0.25),
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderRadius: 35,
    // borderBottomRightRadius: 35,
    // borderBottomLeftRadius: 35,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.2,
  },
});
