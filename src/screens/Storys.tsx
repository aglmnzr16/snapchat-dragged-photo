import {NavigationProp, RouteProp} from '@react-navigation/native';
import {SnapchatRoutes} from '../utils/Model';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {snapPoint, useVector} from 'react-native-redash';
import {useMemo} from 'react';

interface StoryProps {
  navigation: NavigationProp<SnapchatRoutes, 'Story'>;
  route: RouteProp<SnapchatRoutes, 'Story'>;
}

const {height} = Dimensions.get('window');

export default function Storys({route, navigation}: StoryProps) {
  const {story} = route.params;

  const isGestureActive = useSharedValue(false);
  const translation = useVector()

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onGestureEvent = Gesture.Pan()
    .onStart(() => {
      isGestureActive.value = true;
    })
    .onChange(({translationX, translationY}) => {
      translateX.value = translationX;
      translateY.value = translationY;
    })
    .onEnd(({translationY, velocityY}) => {
      const snapBack =
      snapPoint(translationY, velocityY, [0, height]) === height;

    if (snapBack) {
      runOnJS(navigation.goBack)();
    } else {
      isGestureActive.value = false;
      translation.x.value = withSpring(0);
      translation.y.value = withSpring(0);
    }
    });

  const style = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [0, height],
      [1, 0.5],
      Extrapolation.CLAMP,
    );
    return {
      flex: 1,
      transform: [
        {translateX: translateX.value * scale},
        {translateY: translateY.value * scale},
        {scale},
      ],
    };
  });

  const borderStyle = useAnimatedStyle(() => ({
    borderRadius: withTiming(isGestureActive.value ? 24 : 0),
  }));

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <GestureDetector gesture={onGestureEvent}>
        <Animated.View style={style}>
          <SharedElement id={story.id} style={{flex: 1}}>
            {!story.video && (
              <Animated.Image
                source={story.source}
                style={[
                  {
                    ...StyleSheet.absoluteFillObject,
                    width: undefined,
                    height: undefined,
                  },
                  borderStyle,
                ]}
              />
            )}
          </SharedElement>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
