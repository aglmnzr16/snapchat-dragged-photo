import {SnapchatRoutes} from '../utils/Model';
import Snapchat, {stories} from '../screens/Snapchat';
import Storys from '../screens/Storys';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator<SnapchatRoutes>();
export const assets = stories.map(story => [story.avatar, story.source]).flat();

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
        cardOverlayEnabled: true,
        cardStyle: {backgroundColor: 'transparent'},
        presentation : "modal"
      }} >
      <Stack.Screen name="Snapchat" component={Snapchat} />
      <Stack.Screen name="Story" component={Storys} sharedElements={(route) => {
        return [route.params.story.id]
      }} />
    </Stack.Navigator>
  );
}
