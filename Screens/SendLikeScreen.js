import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  useWindowDimensions,
} from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PreFinalScreen from './PreFinalScreen'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { baseUrl } from '../Utils/api'
import { AntDesign } from '@expo/vector-icons'
import { UserContext } from '../context/UserContext'
import { useDispatch, useSelector } from 'react-redux'
import { addToLike } from '../slices/userSlice'

const SendLikeScreen = () => {
  const route = useRoute()
  const [comment, setComment] = useState('')
  const [userInfo, setUserInfo] = useState()
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const { height, width } = useWindowDimensions()

  const { userId, user } = useSelector((state) => state.user)

  const likeProfile = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/user/like-profile`, {
          userId,
          likedUserId: route.params.likedUserId,
          image: user?.imageUrls[0],
          comment: comment,
          name: user?.name,
        })
        .then((res) => {
          if (res.status === 200) {
            Alert.alert(
              '성공',
              `${route.params.name}님께 하트가 전달되었습니다.`,
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            )
            dispatch(addToLike(route.params.likedUserId))
            //setLikedPeople((prev) => [...prev, route.params.likedUserId])
          } else {
            Alert.alert('실패', `하트를 다 사용하셨습니다.`, [
              { text: '충전하러가기', onPress: () => navigation.goBack() },
            ])
          }
        })
        .catch((err) => {
          console.log(err)
          Alert.alert('실패', `하트를 다 사용하셨습니다.`, [
            { text: '충전하러가기', onPress: () => navigation.goBack() },
          ])
        })
    } catch (error) {
      console.log('send Like Error', error)
    }
  }

  // const fetchUserInfo = async () => {
  //   await axios
  //     .post(`${baseUrl}/api/user/user-profile`, { userId })
  //     .then((res) => {
  //       setUserInfo(res.data.user)
  //     })
  //     .catch((err) => console.log('profile Error', err))
  // }

  // useEffect(() => {
  //   if (userId) fetchUserInfo()
  // }, [userId])

  return (
    <View
      style={[
        {
          backgroundColor: '#ffcbcb',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <View
        style={{
          backgroundColor: 'rgba(255,255,255,0.6)',
          height: height * 1.2,
          width: width,
          paddingVertical: 170,
        }}
      >
        <View>
          <View
            style={{
              //borderWidth: 2,
              borderRadius: 25,
              //borderColor: '#af05aa',
              padding: 10,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 3,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 20,
              width: width * 0.8,
              marginHorizontal: 'auto',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: 'Se-Hwa',
                  color: '#af05aa',
                  fontSize: 30,
                  textAlign: 'center',
                }}
              >
                {user?.name}의{' '}
              </Text>
            </View>
            <View style={{ marginLeft: 7, marginRight: 10, marginTop: 8 }}>
              <AntDesign name="heart" size={30} color="pink" />
            </View>
            <Text
              style={{
                marginLeft: 5,
                fontFamily: 'Se-Hwa',
                fontSize: 30,
                textAlign: 'center',
              }}
            >
              {' '}
              : {user?.heartCount} 개
            </Text>
          </View>
          <View
            style={{
              marginBottom: 'auto',
              marginHorizontal: 'auto',
              borderRadius: 20,
              padding: 10,
              width: '80%',
              padding: 10,
              marginTop: 20,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 3,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 20,
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ marginLeft: 7, marginRight: 10, marginTop: 8 }}>
                <AntDesign name="heart" size={30} color="pink" />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 30,
                    fontFamily: 'Se-Hwa',
                    color: 'gray',
                  }}
                >
                  {route.params?.name}
                </Text>
              </View>
              <View style={{ marginLeft: 7, marginRight: 10, marginTop: 8 }}>
                <AntDesign name="heart" size={30} color="pink" />
              </View>
            </View>
            <View>
              <Image
                style={{
                  width: '100%',
                  height: 300,
                  resizeMode: 'center',
                  borderRadius: 20,
                  marginTop: 20,
                }}
                source={{
                  uri: route?.params?.image,
                }}
              />
            </View>
            <TextInput
              value={comment}
              onChangeText={(text) => setComment(text)}
              placeholder="Add a comment..."
              style={{
                padding: 5,
                backgroundColor: 'white',
                borderRadius: 8,
                marginTop: 14,
                fontSize: comment ? 25 : 25,
                fontFamily: 'Se-Hwa',
                borderWidth: 1,
                borderColor: 'gray',
                paddingHorizontal: 5,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFC0CB',
                paddingHorizontal: 5,

                paddingVertical: 5,
                gap: 4,
                borderRadius: 22,
                marginTop: 20,
              }}
            >
              <Pressable
                onPress={likeProfile}
                style={{
                  backgroundColor: '#FFFDD0',
                  borderRadius: 20,
                  padding: 10,
                  // marginHorizontal: 'auto',
                  flex: 1,
                  flexDirection: 'row',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    color: '#FFC0CB',
                    textAlign: 'center',
                    fontSize: 22,
                    marginRight: 5,
                  }}
                >
                  {route.params?.name}님께 하트 보내기
                </Text>
                <Ionicons name="heart-outline" size={30} color="#FFC0CB" />
              </Pressable>
            </View>
            <View>
              <Text style={{ fontFamily: 'Se-Hwa', color: 'gray' }}>
                하트를 보낼때마다, 하트갯수가 하나 줄어듭니다.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SendLikeScreen

const styles = StyleSheet.create({})
