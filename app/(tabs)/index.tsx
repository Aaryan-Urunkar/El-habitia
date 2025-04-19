import { View, Text } from 'react-native'
import React from 'react'
import Habit from "@/components/Habit.jsx"

const index = () => {
  return (
    <View>
      <Text style={{color:"white" , fontSize:32}}>index</Text>
      <Habit />
    </View>
  )
}

export default index
