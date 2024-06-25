import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NotesPage from "./Components/Screens/NotesPage";
import TextPage from "./Components/Screens/TextPage";
import MyTabs from "./Components/Screens/BottomNatvigation";
import UpdatePage from "./Components/Screens/UpdatePage";
import FolderScreen from "./Components/Screens/FolderPage";
import FolderFiles from "./Components/Screens/FolderFiles";
import CommonToolbar from './Components/Screens/Commontoolbar';
import BottomSheet from './Components/Screens/BottomSheet';
import SearchPage from './Components/Screens/SearchPage'


const Stack = createStackNavigator();

export default function App(){
  return <NavigationContainer>

    <Stack.Navigator initialRouteName={"BottomNatvigation"} >
     
    <Stack.Screen name="NotesPage" component={NotesPage} ></Stack.Screen> 
      <Stack.Screen name="TextPage" component={TextPage} ></Stack.Screen>
      <Stack.Screen name="UpdatePage" component={UpdatePage} ></Stack.Screen>
      <Stack.Screen name="FolderScreen" component={FolderScreen} ></Stack.Screen>
      <Stack.Screen name="FolderFiles" component={FolderFiles} ></Stack.Screen>
      <Stack.Screen name="CommonToolbar" component={CommonToolbar} ></Stack.Screen>
      <Stack.Screen name="BottomSheet" component={BottomSheet} ></Stack.Screen> 
      <Stack.Screen name="SearchPage" component={SearchPage} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="BottomNatvigation" component={MyTabs} options={{ headerShown: false }}></Stack.Screen>

    </Stack.Navigator>  


  </NavigationContainer>

}