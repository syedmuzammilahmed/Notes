import {View , TextInput, TouchableOpacity,Text, StyleSheet} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const SearchPage=()=>{
  return(
    <View style={{flex:1}}>
        <View style={styles.ViewStyle}>
            <View style={{width:'15%'}}> 
                <TouchableOpacity>
                    <View style={styles.button}>
                       <Text style={styles.buttonText}>Back</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{width:'85%',}}>
              <TextInput 
              style={{color:'black'}}
              placeholder='Search For Notes'
              placeholderTextColor="#888"
              ></TextInput>
            </View>
            
        </View>

        <View>
              <Ionicons name='albums-sharp' size={50} />
        </View>
       
    </View>
  )
}

const styles = StyleSheet.create({
    ViewStyle:{
        width:'100%',
        height:50,
        flexDirection:'row'
    },
    buttonText:{
        fontSize:15,
        fontWeight:'600',
        color:'black'
    },
    button:{
        alignItems:'center',
        top:12
    }
})

export default SearchPage;