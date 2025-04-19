import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TextInput, Button } from 'react-native';
import { useFonts } from 'expo-font';
import Bg from "@/assets/images/landing_bg.jpeg"

// Ensure you have the correct path for the font
import Bitter from "@/assets/fonts/Bitter-Italic-VariableFont_wght.ttf";

const Home = () => {
  const [fontsLoaded] = useFonts({
    Bitter: Bitter,
  });

  if (!fontsLoaded) {
    return <Text>Loading Fonts...</Text>; // Display a loading message until fonts are loaded
  }

  return (
      <ImageBackground source={Bg}>
        <View style={styles.view}>
          <View style={styles.input_box}>
            {/* <TextInput style={styles.input}/> */}
            <Text style={{opacity:1, fontWeight:"bold", fontSize:24, textAlign:"center", color:"yellow", fontFamily:"Poppins"}}>
              
            Master Your Time. Shape Your Life.
            </Text>
            <Text style={styles.text2}>
              Every day counts. Even the ones you can't name yet.
            </Text>
            <Button title='Start Now' color={"black"} onPress={() => {}} style={styles.submit_btn}>
            </Button>

          </View>

        </View>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  view: {
    height: 700,
    width: 375,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: 32,
    fontFamily: "Poppins", // Use the loaded font family name here,
    fontWeight: 600
  },
  image: {
    height: 30,
    width: 30,
  },
  input_box : {
    backgroundColor:"black",
    height:250,
    width:300,
    opacity:0.6,
    borderRadius:10,
    marginTop:200,
    flexDirection:"column",
    justifyContent:"space-around"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius:6,
  },
  text2:{
    fontFamily:"Poppins",
    fontSize:16,
    textAlign:"center",
    color:"white"
  },
  submit_btn : {
    width:"60%",
    paddingBottom:30
  }
});

export default Home;
