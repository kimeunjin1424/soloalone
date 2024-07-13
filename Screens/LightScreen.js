import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  Platform,
} from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { FontAwesome6 } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import Modal, {
  ModalContent,
  BottomModal,
  ModalTitle,
  SlideAnimation,
  bottom,
} from 'react-native-modals'
import { AuthContext } from '../context/AuthContext'
import { baseUrl } from '../Utils/api'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { useHeaderHeight } from '@react-navigation/elements'
import * as Location from 'expo-location'

const LightScreen = () => {
  const regionData = [
    { id: 1, name: '서울' },
    { id: 2, name: '경기도' },
    { id: 3, name: '충북' },
    { id: 4, name: '충남' },
    { id: 5, name: '강원' },
    { id: 6, name: '광주전남' },
    { id: 7, name: '전북' },
    { id: 8, name: '경남' },
    { id: 9, name: '경북' },
    { id: 10, name: '부산울산' },
    { id: 11, name: '제주' },
  ]

  const [isModalVisible, setModalVisible] = useState(false)
  const [meetingLocation, setMeetingLocation] = useState('')

  const [imageUrl, setImageUrl] = useState('')
  const [light, setLight] = useState([])
  const [region, setRegion] = useState('')
  const [questionModal, setQuestionModal] = useState(false)
  const [location, setLocation] = useState('')
  const [errorMsg, setErrorMsg] = useState(null)

  const { userId, user: userInfo } = useSelector((state) => state.user)

  const navigation = useNavigation()

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
      console.log('Light_location', location)
    })()
  }, [])

  const fetchLight = async () => {
    try {
      await axios
        .get(`${baseUrl}/api/light/`)
        .then((res) => {
          setLight(res.data.light)
        })
        .catch((err) => console.log('fetch Light Error', err))
    } catch (err) {
      console.log('fetch Light', err)
    }
  }

  const deletePress = (deleteId) => {
    Alert.alert('확인', '번개 신청을 삭제하시겠습니까?', [
      {
        text: '네',
        onPress: () => deleteLight(deleteId),
      },
      {
        text: '아니오',

        style: 'cancel',
      },
    ])
  }

  const deleteLight = async (deleteId) => {
    try {
      await axios
        .post(`${baseUrl}/api/light/delete-light`, { deleteId })
        .then((res) => {
          console.log('delete', res.data)
          fetchLight()
        })
        .catch((err) => console.log('delete Light Error111', err))
    } catch (err) {
      console.log('delete Light', err)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchLight()
    }
  }, [userId])

  const createLight = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/light/create-light`, {
          meetingLocation,
          userId,
          username: userInfo.name,
          region: userInfo.region,
          timeData: Date.now(),
          imageUrl: userInfo.imageUrls[0],
          location: {
            lat: location?.coords.latitude,
            lng: location?.coords.longitude,
          },
        })
        .then((res) => {
          if (res.data.status == true) {
            setModalVisible(false)
            fetchLight()
          }
        })
        .catch((err) => console.log('light create Error', err))
    } catch (err) {
      console.log('light create Error', err)
    }
  }

  const displayCreateAt = (createdAt) => {
    const date = new Date(createdAt)
    const now = Date.now()
    const milliSeconds = now - date

    const seconds = milliSeconds / 1000
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24
    const months = days / 30
    const years = months / 12

    if (seconds < 60) {
      return '방금 전'
    } else if (minutes < 60) {
      return `${Math.floor(minutes)}분 전`
    } else if (hours < 24) {
      return `${Math.floor(hours)}시간 전`
    } else if (days < 30) {
      return `${Math.floor(days)}일 전`
    } else if (months < 12) {
      return `${Math.floor(months)}달 전`
    } else {
      return `${Math.floor(years)}년 전`
    }
  }

  const secondSearch = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/light/search`, {
          region,
        })
        .then((res) => {
          setQuestionModal(false)
          setLight(res.data.light)
        })
        .catch((err) => {
          console.log('search err', err)
        })
    } catch (err) {
      console.log('second Search error', err)
    }
  }

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371 // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1) // deg2rad below
    var dLon = deg2rad(lon2 - lon1)
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c // Distance in km
    return roundToTwoDecimals(d)
  }

  const roundToTwoDecimals = (num) => {
    return +(Math.round(num + 'e+2') + 'e-2')
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }

  const height = useHeaderHeight()

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
      <View style={{}}>
        <View style={{ marginHorizontal: 'auto' }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              borderWidth: 1,
              borderRadius: 15,
              borderColor: 'yellow',
              paddingHorizontal: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'yellow',
              paddingVertical: 10,
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <FontAwesome6 name="bolt" size={30} color="lightgray" />
              <Text style={{ fontSize: 35, fontFamily: 'Se-Hwa' }}>
                우리지금만나!!
              </Text>
              <FontAwesome6 name="bolt" size={30} color="lightgray" />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ justifyContent: 'flex-end', marginLeft: 1 }}
              >
                <View style={{ padding: 10 }}>
                  <AntDesign name="pluscircleo" size={30} color="gray" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setQuestionModal(true)}
                style={{ justifyContent: 'flex-end', marginLeft: 1 }}
              >
                <View style={{ padding: 10 }}>
                  <Feather name="search" size={30} color="gray" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <ScrollView>
        {light?.map((i, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 2,
              marginBottom: 5,
              marginTop: 5,
              backgroundColor: 'white',
              borderRadius: 15,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProfileDetail', { userId: i.userId })
              }
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 10,
                alignItems: 'center',
              }}
            >
              <View>
                <Image
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                  source={{ uri: i.imageUrl }}
                />
              </View>
              <View style={{ marginLeft: 5, alignSelf: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    color: 'black',
                    fontSize: 20,
                  }}
                >
                  {i.username}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    color: 'gray',
                    fontSize: 20,
                  }}
                >
                  {i.region}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 5,
                  backgroundColor: 'yellow',
                  borderRadius: 25,
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  marginVertical: 3,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    color: 'black',
                    fontSize: 20,
                  }}
                >
                  {i.meetingLocation}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    color: 'gray',
                    fontSize: 20,
                  }}
                >
                  {displayCreateAt(i.timeData)}
                </Text>
                <Text style={{ fontFamily: 'Se-Hwa', fontSize: 20 }}>
                  {getDistanceFromLatLonInKm(
                    location?.coords?.latitude,
                    location?.coords?.longitude,
                    i?.location?.lat,
                    i?.location?.lng
                  )}
                  Km
                </Text>
              </View>
            </TouchableOpacity>
            {userId === i.userId ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginRight: 15,
                  marginTop: 15,
                  marginLeft: 5,
                }}
              >
                <TouchableOpacity onPress={() => deletePress(i._id)}>
                  <AntDesign name="closecircleo" size={30} color="red" />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginRight: 15,
                  marginTop: 10,
                  marginLeft: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('SendLike', {
                      image: i.imageUrl,
                      name: i.username,
                      likedUserId: i.userId,
                      //likedUserId: item?.id,
                    })
                  }
                  style={{
                    borderWidth: 1,
                    borderRadius: 25,
                    padding: 10,
                    borderColor: 'pink',
                  }}
                >
                  <FontAwesome name="heart" size={20} color="pink" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={100}
          behavior={'padding'}
        >
          <BottomModal
            onBackdropPress={() => setModalVisible(!isModalVisible)}
            onHardwareBackPress={() => setModalVisible(!isModalVisible)}
            swipeDirection={['up', 'down']}
            swipeThreshold={200}
            modalAnimation={
              new SlideAnimation({
                slideFrom: 'bottom',
              })
            }
            onSwipeOut={() => setModalVisible(false)}
            visible={isModalVisible}
            onTouchOutside={() => setModalVisible(!isModalVisible)}
          >
            <ModalContent
              style={{
                width: '100%',
                height: 300,
              }}
            >
              <View>
                <Text style={{ fontFamily: 'Se-Hwa', fontSize: 25 }}>
                  만남을 원하는 장소를 10자 이내로 입력하세요
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 25,
                    padding: 5,
                    borderColor: 'lightgray',
                    marginTop: 20,
                    paddingHorizontal: 20,
                  }}
                >
                  <TextInput
                    style={{ fontFamily: 'Se-Hwa', fontSize: 20 }}
                    //value={meetingLocation}
                    onChangeText={(text) => setMeetingLocation(text)}
                    placeholder=" 서울 강남, 부산 해운대등등.."
                  />
                </View>
                <TouchableOpacity
                  onPress={createLight}
                  style={{
                    borderWidth: 1,
                    borderRadius: 25,
                    paddingVertical: 15,
                    borderColor: 'yellow',
                    marginTop: 20,
                    paddingHorizontal: 20,
                    backgroundColor: 'yellow',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Se-Hwa',
                      fontSize: 25,
                      textAlign: 'center',
                      color: 'gray',
                    }}
                  >
                    번개신청 완료
                  </Text>
                </TouchableOpacity>
              </View>
            </ModalContent>
          </BottomModal>
        </KeyboardAvoidingView>
      </View>
      <Modal
        visible={questionModal}
        onTouchOutside={() => {
          setQuestionModal(false)
        }}
      >
        <ModalContent>
          <View style={{ width: 250 }}>
            <View style={{}}>
              <View
                horizontal={true}
                style={{
                  marginTop: 10,
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  // alignSelf: 'center',
                  //width: '90%',
                  //justifyContent: 'space-around',
                }}
              >
                {regionData.map((i, index) => (
                  <TouchableOpacity
                    onPress={() => setRegion(i.name)}
                    key={index}
                    style={{
                      marginLeft: 10,
                      marginTop: 5,
                      borderWidth: 1,
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                      borderRadius: 25,
                      borderColor: region == `${i.name}` ? 'white' : 'gray',
                      backgroundColor:
                        region == `${i.name}` ? '#3baea0' : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 25,
                        fontFamily: 'Se-Hwa',
                        color: region == `${i.name}` ? 'white' : 'gray',
                      }}
                    >
                      {i.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={secondSearch}
              style={{
                borderWidth: 1,
                borderColor: '#3baea0',
                borderRadius: 25,
                marginTop: 15,
                padding: 10,
                width: '80%',
                alignSelf: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: 'Se-Hwa',
                  color: '#3baea0',
                }}
              >
                {region}, Search...
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 10,
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Se-Hwa',
                color: 'gray',
              }}
            >
              지역을 골라주세요.
            </Text>
          </View>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  )
}

export default LightScreen

const styles = StyleSheet.create({})
