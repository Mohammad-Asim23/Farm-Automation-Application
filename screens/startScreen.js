import { View, Text,Image} from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';



const StartScreen = ({ navigation }) => {

  return (
    <LinearGradient 
    style={{flex:1}}
    colors={['#C463DA','#7E51D1']}
    >
      <View className='my-10 justtify-center items-center'>
          <Text className='text-4xl font-bold ' 
          style={{color:'white'}} >
            Hey! Welcome</Text>
        </View>
      <View className='flex flex-1 justify-around items-center'>
        <Image source={require('../assets/farm.png')}
        style={{height:400, width: 350}}
        />
        
        <View className=''>
          <TouchableOpacity className='w-80 p-3  rounded-lg flex-row  justify-between shadow-md shadow-[#E1F3EF]'
          onPress={()=>navigation.navigate('Signup')}
          style={{backgroundColor:'#50DA8E'}}>
            <Text  className='text-base font-bold '
            style={{color:'white'}} >
              Get Started
            </Text>
            <AntDesign name='arrowright' size={22} color="white"/>
          </TouchableOpacity>

          <TouchableOpacity className='my-3 rounded-lg p-3 items-center shadow-lg shadow-[#61319F]'
          onPress={()=>navigation.navigate('Login')}
          style={{backgroundColor:'#7E51D1'}}>
            <Text className='text-white font-bold '
            style={{color:'white'}} >
              I already have an account
            </Text>
            
          </TouchableOpacity>
        </View>
      </View>

    </LinearGradient>
      
 
  )
}

export default StartScreen