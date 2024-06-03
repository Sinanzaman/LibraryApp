import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Screens/Home';
import Login from './Screens/Login';
import Singup from './Screens/Singup';
import Forget from './Screens/Forget';
import Dashboar from './Screens/TabScreens/Dashboar';
import ReadingBook from "./Screens/Signedin/ReadingBook";
import AdminLoginScreen from "./Screens/Admin/AdminLoginScreen";
import AdminPanel from "./Screens/Admin/AdminPanel";
import UserInformation from "./Screens/Signedin/UserScreens/UserInformation";
import ChangePassword from "./Screens/Signedin/UserScreens/ChangePassword";
import UserUpload from "./Screens/Signedin/UserScreens/UserUpload";
import TermsAndPrivacyPolicy from "./Screens/Signedin/UserScreens/TermsAndPrivacyPolicy";
import OneriSikayet from "./Screens/Signedin/UserScreens/OneriSikayet";
import DeleteAccount from "./Screens/Signedin/UserScreens/DeleteAccount";
import BookScreen from "./Screens/Signedin/BookScreen";
import AddAlert from "./Screens/Signedin/UserScreens/AddAlert";
import AnonymousExplore from "./Screens/Anonymous/AnonymousExplore";
import AnonymousDashboard from "./Screens/Anonymous/AnonymousDashboard";
import AnonymousBookScreen from "./Screens/Anonymous/AnonymousBookScreen";
import AdminDashboard from "./Screens/Admin/AdminDashbord";
import AdminBookDetailScreen from "./Screens/Admin/AdminBookDetailScreen";
import AdminEditBookScreen from "./Screens/Admin/AdminEditBookScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home Screen" component={Home}  options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="Login" component={Login}  options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="Singup" component={Singup}  options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="Forget" component={Forget}  options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="Dashbord" component={Dashboar}  options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="ReadingBook" component={ReadingBook} options={{statusBarHidden:true}} />
        <Stack.Screen name="AdminLoginScreen" component={AdminLoginScreen} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="AdminPanel" component={AdminPanel} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="AdminBookDetailScreen" component={AdminBookDetailScreen} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="AdminEditBookScreen" component={AdminEditBookScreen} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="UserInformation" component={UserInformation} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="UserUpload" component={UserUpload} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="TermsAndPrivacyPolicy" component={TermsAndPrivacyPolicy} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="OneriSikayet" component={OneriSikayet} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="BookScreen" component={BookScreen} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="AnonymousExplore" component={AnonymousExplore} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="AnonymousDashboard" component={AnonymousDashboard} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="AnonymousBookScreen" component={AnonymousBookScreen} options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="AddAlert" component={AddAlert} options={{headerShown:false, statusBarHidden:true}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;