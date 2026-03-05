import { Redirect } from "expo-router";
import React from "react";
import {useAuth} from "../context/authContext"
import { ActivityIndicator, View } from "react-native";

export default function Index(){
  const{user,loading} = useAuth();

  if(loading) {
    return(
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  // return <Redirect href={user ? "/(tabs)" : "/auth/splash"} />;
  return <Redirect href={"/auth/farmSetup"} />;
}
