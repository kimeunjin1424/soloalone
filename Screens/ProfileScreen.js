import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Button,
  TextInput,
  ActivityIndicator,
  Alert,
  TurboModuleRegistry,
} from 'react-native'

import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import 'core-js/stable/atob'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { jwtDecode } from 'jwt-decode'
import Carousel from 'react-native-reanimated-carousel'
import { SimpleLineIcons } from '@expo/vector-icons'
import Modal, {
  ModalContent,
  BottomModal,
  ModalTitle,
  SlideAnimation,
  bottom,
} from 'react-native-modals'

import * as ImagePicker from 'expo-image-picker'
import { useIsFocused } from '@react-navigation/native'
import { FontAwesome6 } from '@expo/vector-icons'
import Animated from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome5 } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { addToUser, removeToken } from '../slices/userSlice'
import { FontAwesome } from '@expo/vector-icons'

const ProfileScreen = () => {
  const dispatch = useDispatch()
  const { token, userId, user } = useSelector((state) => state.user)

  console.log('userId_profilePage', userId)
  const navigation = useNavigation()
  const width = Dimensions.get('window').width
  const isFocused = useIsFocused()

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

  const [image, setImage] = useState()
  const [isModalVisible, setModalVisible] = useState(false)
  const [question, setQuestion] = useState('')
  const [holder, setHolder] = useState('')
  const [age, setAge] = useState('')
  const [region, setRegion] = useState(user.region)
  const [email, setEmail] = useState('')
  const [lookingFor, setLookingFor] = useState(user.lookingFor)
  const [gender, setGender] = useState(user.gender)
  const [images, setImages] = useState([])
  const [pickImages, setPickImages] = useState([])
  const [photoLength, setPhotoLength] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [prompts, setPrompts] = useState('')
  const [questionModal, setQuestionModal] = useState(false)
  const [questionItem, setQuestionItem] = useState('')
  const [questionRe, setQuestionRe] = useState('')
  const [questionId, setQuestionId] = useState('')
  const [updateAnswer, setUpdateAnnswer] = useState('')
  const [updateEmail, setUpdateEmail] = useState('')
  const [updateGender, setUpdateGender] = useState('')
  const [updateRegion, setUpdateRegion] = useState('')
  const [updateLookingFor, setUpdateLookginFor] = useState('')
  const [updateImageUrls, setUpdateImageUrls] = useState('')
  const [updateAge, setUpdateAge] = useState('')
  const [uploadImageButton, setUploadImageButton] = useState(false)
  const [status, setStatus] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')
  const [savePeople, setSavePeople] = useState([])

  //const [userId, setUserId] = useState('')

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    //setPickImages('')
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      // mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    })

    //console.log('uri', result.assets.length)
    setPhotoLength(result.assets.length)

    if (!result.canceled) {
      for (i = 0; i < result.assets.length; i++) {
        setPickImages((prev) => [...prev, result.assets[i].uri])
      }
    }
    //console.log('userImageurl', pickImages)
  }

  const logout = async () => {
    await AsyncStorage.removeItem('hinge_token').then(() => {
      dispatch(removeToken())
      navigation.navigate('AuthStack', { screen: 'Login' })
    })
  }

  const fetchUser = async () => {
    console.log('fetch User')
    await axios
      .post(`${baseUrl}/api/user/user-profile`, { userId })
      .then((res) => {
        dispatch(addToUser(res.data.user))
        setImage(res.data.user.imageUrls[0])
        setImages(res.data.user.imageUrls)
        setPrompts(res.data.user.prompts)
        setSavePeople(res.data.user.saveProfiles)

        //console.log('res', res.data.user)
      })
      .catch((err) => console.log('profile Error_Profile Page', err))
  }

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId, isFocused])

  const openModal = (title, item) => {
    setQuestion(title)
    setHolder(item)
    setModalVisible(!isModalVisible)
  }

  const deletePicture = (url) => {
    setImages(images.filter((i) => i !== url))
  }

  const sendImages = () => {
    let formData = new FormData()
    for (i = 0; i < pickImages.length; i++) {
      const newImageUri = 'file:///' + pickImages[i].split('file:/').join('')
      const sImage = {
        uri: newImageUri,
        type: 'image/*',
        name: newImageUri.split('/').pop(),
      }
      //multiple file을 보낼때는 'file'이라는 동일한 이름에
      //for문을 써서 넣든지, map을 써던지 해야함.
      //이거때메 3일 날림 ㅠ
      formData.append(`images`, sImage)
    }
    //console.log('sendImages', sendImages)
    //formData.append('image', sendImages)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        //Authorization: `Bearer ${token}`,
      },
    }
    setIsLoading(true)
    axios
      .post(`${baseUrl}/api/user/upload-profile-images`, formData, config)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          for (i = 0; i < res.data.imageUrls.length; i++) {
            setImages((prev) => [...prev, res.data.imageUrls[i].url])
            console.log(
              `${res.data.imageUrls[i].url}`,
              res.data.imageUrls[i].url
            )
          }
          setIsLoading(false)
          setUploadImageButton(true)
          // Alert.alert('Success', '이미지가 성공적으로 업데이트 되었습니다.', [
          //   {
          //     text: '확인',
          //     onPress: () => {
          //       console.log('images.....', images)
          //       //imageUrlsUpdate()
          //       setModalVisible(false)
          //       setPickImages('')
          //     },
          //   },
          // ])
        }
      })
      .catch((error) => {
        console.log('Image Upload Failed', error)
      })
  }

  const promptUpdate = async () => {
    console.log('questionId', questionId)
    await axios
      .put(`${baseUrl}/api/user/update-prompts`, {
        questionId,
        updateAnswer,
        userId,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            '질문 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setQuestionModal(false)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const emailUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-email`, {
        updateEmail,
        userId,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            'Email 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setModalVisible(!isModalVisible)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const ageUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-age`, {
        userId,
        updateAge,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            '나이 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setModalVisible(!isModalVisible)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const genderUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-gender`, {
        userId,
        updateGender,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            '성별 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setModalVisible(!isModalVisible)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const statusUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-status`, {
        userId,
        updateStatus,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            '상태 업데이트가 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setModalVisible(!isModalVisible)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const regionUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-region`, {
        userId,
        updateRegion,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            '지역 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setModalVisible(!isModalVisible)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const imageUrlsUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-imageUrls`, {
        userId,
        images,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          setUploadImageButton(false)
          setPickImages('')
          Alert.alert(
            '성공',
            '이미지 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setModalVisible(!isModalVisible)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const lookingForUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-lookingFor`, {
        userId,
        updateLookingFor,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            '데이친 타입 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }

  const deleteSaveProfile = async (selectedUserId) => {
    await axios
      .post(`${baseUrl}/api/user/delete-save-profile`, {
        userId,
        selectedUserId,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert('성공', '삭제가 완료되었습니다. OK를 눌러주세요.', [
            {
              text: 'OK',
              onPress: () => {
                setModalVisible(!isModalVisible)
                fetchUser()
              },
            },
          ])
        }
      })
  }

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          flex: 1,
          marginTop: 50,
          backgroundColor: 'transparent',
        }}
      >
        <View
          style={{
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderRadius: 30,
              padding: 10,
              backgroundColor: 'pink',
              borderColor: 'white',
              gap: 10,
              width: '90%',
              marginHorizontal: 'auto',
            }}
          >
            <Text
              style={{
                fontFamily: 'Ga-Ram',
                fontSize: 40,
                color: 'black',
                textAlign: 'center',
              }}
            >
              나 혼자 솔로
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 10,
            marginTop: 5,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <MaterialCommunityIcons
              name="alarm-light-outline"
              size={24}
              color="gray"
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Singo', { username: user.name })
              }
            >
              <Text style={{ marginTop: 3, color: 'gray' }}>신고하기</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginRight: 10,
              marginLeft: 10,
            }}
          >
            <FontAwesome name="hand-o-up" size={20} color="gray" />
            <TouchableOpacity onPress={() => navigation.navigate('Suggest')}>
              <Text style={{ color: 'gray', marginTop: 3 }}>건의하기</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 1, width: '90%' }}>
          <Carousel
            loop
            width={width}
            height={width}
            autoPlay={true}
            //data={[...new Array(6).keys()]}
            data={images}
            mode="parallax"
            scrollAnimationDuration={2000}
            //onSnapToItem={(index) => console.log(' index:', index)}
            renderItem={({ index, item }) => (
              <View
                style={{
                  justifyContent: 'center',
                  resizeMode: 'cover',
                  borderRadius: 25,
                }}
              >
                <Image
                  style={{ width: '100%', height: '100%' }}
                  source={{ uri: item }}
                />
              </View>
            )}
          />
          <TouchableOpacity
            onPress={() => {
              openModal('Image', user.imageUrls)
            }}
            style={{
              borderWidth: 1,
              borderRadius: 25,
              marginHorizontal: 'auto',
              paddingVertical: 5,
              paddingHorizontal: 35,
              marginTop: -10,
              borderColor: 'gray',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Se-Hwa',
                fontSize: 25,
                color: 'gray',
              }}
            >
              이미지 수정하기
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 10,
            width: width * 0.9,
            marginHorizontal: 'auto',
          }}
        >
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 15,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              이름 : <Text style={{ color: 'black' }}>{user.name}</Text>
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              이메일 :{' '}
              <Text style={{ color: 'black' }}>{email || user.email}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                openModal('Email', user.email)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              나이 :{' '}
              <Text style={{ color: 'black' }}>{age || user.age} 세</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                openModal('Age', user.age)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              사는곳 :{' '}
              <Text style={{ color: 'black' }}>{region || user.region}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                openModal('Region', user.region)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              데이팅 목적 :{' '}
              <Text style={{ color: 'black' }}>
                {lookingFor || user.lookingFor} 를 찾아요
              </Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                openModal('LookingFor', user.lookingFor)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              성별 :{' '}
              <Text style={{ color: 'black' }}>{gender || user.gender}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                openModal('Gender', user.gender)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              남은 하트갯수:{' '}
              <Text style={{ color: 'black' }}>{user.heartCount} 개</Text>
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChargeHeart', { user })}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
                gap: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                display: 'flex',
                alignContent: 'center',
                alignSelf: 'center',
              }}
            >
              <SimpleLineIcons
                style={{ textAlign: 'auto' }}
                name="pencil"
                size={24}
                color="gray"
              />
              <Text
                style={{ color: 'gray', fontSize: 20, fontFamily: 'Se-Hwa' }}
              >
                (충전하기)
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              현재 상태 :{' '}
              <Text style={{ color: 'black' }}>{status || user?.status}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                openModal('Status', user?.status)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              추가질문 수정하기
            </Text>
            <TouchableOpacity
              onPress={() => {
                openModal('Prompts', user.prompts)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              받은 누적 하트 갯수 :
            </Text>
            <View style={{ marginTop: 5 }}>
              <AntDesign name="hearto" size={24} color="gray" />
            </View>
            <Text
              style={{
                fontFamily: 'Se-Hwa',
                fontSize: 25,
                textAlign: 'center',
                marginBottom: 4,
              }}
            >
              {user.receviedHeartCount}개
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              찜한 사람 보기
            </Text>
            <View style={{ marginTop: 5 }}>
              <AntDesign name="hearto" size={24} color="gray" />
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SavePeople', { savePeople })
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              차단 시킨 사람 보기
            </Text>
            <View style={{ marginTop: 5 }}>
              <FontAwesome6 name="face-angry" size={24} color="gray" />
            </View>
            <TouchableOpacity
              onPress={() => {
                openModal('Prompts', user.prompts)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              직업 인증하기
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('JobVerify', { username: user.name })
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        <Pressable
          onPress={logout}
          style={{
            borderColor: 'black',
            marginTop: 10,
            padding: 12,
            borderRadius: 30,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 120,
            marginBottom: 20,
            flexDirection: 'row',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Se-Hwa',
              fontSize: 30,
              fontWeight: '500',
              marginBottom: 5,
            }}
          >
            Log out
          </Text>
        </Pressable>
      </SafeAreaView>
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
            height:
              question === 'Prompts'
                ? 800
                : question === 'Image'
                ? 800
                : question === 'SavePeople'
                ? 800
                : 400,
          }}
        >
          <View style={{ marginVertical: 1 }}>
            <Text
              style={{
                marginTop: 1,
                fontFamily: 'Se-Hwa',
                fontSize: 25,
                fontWeight: '600',
              }}
            >
              {question}을/를 수정할 수 있습니다.
            </Text>
            <KeyboardAvoidingView
              style={{
                borderColor: '#202020',
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                height: question === 'Prompts' && '95%',
                marginVertical: 12,
                borderStyle: 'dashed',
              }}
            >
              {question === 'Email' && (
                <TextInput
                  onChangeText={(text) => {
                    setEmail(text)
                    setUpdateEmail(text)
                  }}
                  placeholder={`${user.email}`}
                />
              )}
              {question === 'Age' && (
                <TextInput
                  onChangeText={(text) => setUpdateAge(text)}
                  placeholder={`${holder}`}
                />
              )}
              {question === 'Region' && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    gap: 5,
                    flexWrap: 'wrap',
                  }}
                >
                  {regionData.map((r, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        flexDirection: 'row',
                        borderColor: '#581845',
                        borderWidth: 1,
                        paddingHorizontal: 3,
                        paddingVertical: 4,
                        borderRadius: 30,
                        backgroundColor:
                          region === r.name ? '#581845' : 'white',
                      }}
                      onPress={() => {
                        setRegion(r.name)
                        setUpdateRegion(r.name)
                      }}
                    >
                      <Text
                        style={{
                          color: region === r.name ? 'white' : '#581845',
                        }}
                      >
                        {r.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {question === 'LookingFor' && (
                <View
                  style={{ marginTop: 5, flexDirection: 'column', gap: 12 }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '500',
                        fontSize: 20,
                        fontFamily: 'Se-Hwa',
                      }}
                    >
                      1. 인생의 동반자를 찾아요.
                    </Text>
                    <Pressable
                      onPress={() => {
                        setLookingFor('인생의 동반자')
                        setUpdateLookginFor('인생의 동반자')
                      }}
                    >
                      <FontAwesome
                        name="circle"
                        size={26}
                        color={
                          lookingFor == '인생의 동반자' ? '#581845' : '#F0F0F0'
                        }
                      />
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '500',
                        fontSize: 20,
                        fontFamily: 'Se-Hwa',
                      }}
                    >
                      2. 애인을 만들고 싶어요.
                    </Text>
                    <Pressable
                      onPress={() => {
                        setLookingFor('애인')
                        setUpdateLookginFor('애인')
                      }}
                    >
                      <FontAwesome
                        name="circle"
                        size={26}
                        color={lookingFor == '애인' ? '#581845' : '#F0F0F0'}
                      />
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '500',
                        fontSize: 20,
                        fontFamily: 'Se-Hwa',
                      }}
                    >
                      3. 썸남/썸녀를 만들고 싶어요.
                    </Text>
                    <Pressable
                      onPress={() => {
                        setLookingFor('썸탈 사람')
                        setUpdateLookginFor('썸탈사람')
                      }}
                    >
                      <FontAwesome
                        name="circle"
                        size={26}
                        color={
                          lookingFor == '썸탈 사람' ? '#581845' : '#F0F0F0'
                        }
                      />
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '500',
                        fontSize: 20,
                        fontFamily: 'Se-Hwa',
                      }}
                    >
                      4. 남자사람친구/여자사람친구 찾아요.
                    </Text>
                    <Pressable
                      onPress={() => {
                        setLookingFor('이성친구')
                        setUpdateLookginFor('이성친구')
                      }}
                    >
                      <FontAwesome
                        name="circle"
                        size={26}
                        color={lookingFor == '이성친구' ? '#581845' : '#F0F0F0'}
                      />
                    </Pressable>
                  </View>
                </View>
              )}

              {question === 'Gender' && (
                <View style={{ marginTop: 30 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginHorizontal: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 25,
                        fontFamily: 'Se-Hwa',
                        fontWeight: 500,
                      }}
                    >
                      남자
                    </Text>
                    <Pressable
                      onPress={() => {
                        setGender('Men')
                        setUpdateGender('Men')
                      }}
                    >
                      <FontAwesome
                        name="circle"
                        size={26}
                        color={gender == 'Men' ? '#581845' : '#F0F0F0'}
                      />
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginVertical: 12,
                      marginHorizontal: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 25,
                        fontFamily: 'Se-Hwa',
                        fontWeight: '500',
                      }}
                    >
                      여자
                    </Text>
                    <Pressable
                      onPress={() => {
                        setGender('Women')
                        setUpdateGender('Women')
                      }}
                    >
                      <FontAwesome
                        name="circle"
                        size={26}
                        color={gender == 'Women' ? '#581845' : '#F0F0F0'}
                      />
                    </Pressable>
                  </View>
                </View>
              )}
              {question === 'Status' && (
                <View style={{ marginTop: 10 }}>
                  <View style={{ marginBottom: 10 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'Se-Hwa',
                        color: 'gray',
                      }}
                    >
                      상태가 커플로 되어 있으면, 다른 상대에게 본인이 추천되지
                      않습니다.
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginHorizontal: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 25,
                        fontFamily: 'Se-Hwa',
                        fontWeight: 500,
                      }}
                    >
                      솔로
                    </Text>
                    <Pressable
                      onPress={() => {
                        setStatus('solo')
                        setUpdateStatus('solo')
                      }}
                    >
                      <FontAwesome
                        name="circle"
                        size={26}
                        color={status == 'solo' ? '#581845' : '#F0F0F0'}
                      />
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginVertical: 12,
                      marginHorizontal: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 25,
                        fontFamily: 'Se-Hwa',
                        fontWeight: '500',
                      }}
                    >
                      커플
                    </Text>
                    <Pressable
                      onPress={() => {
                        setStatus('couple')
                        setUpdateStatus('couple')
                      }}
                    >
                      <FontAwesome
                        name="circle"
                        size={26}
                        color={status == 'couple' ? '#581845' : '#F0F0F0'}
                      />
                    </Pressable>
                  </View>
                </View>
              )}
              {question === 'Image' && (
                <ScrollView style={{ marginTop: -25 }}>
                  <View style={{ marginTop: 20 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',

                        gap: 20,
                      }}
                    >
                      {images.slice(0, 3).map((url, index) => (
                        <Pressable
                          onPress={() => deletePicture(url)}
                          key={index}
                          style={{
                            borderColor: '#581845',
                            borderWidth: url ? 0 : 2,
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderStyle: 'dashed',
                            borderRadius: 10,
                            height: 100,
                          }}
                        >
                          {url ? (
                            <>
                              <Image
                                source={{ uri: url }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: 10,
                                  resizeMode: 'cover',
                                }}
                              />
                              <View
                                style={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                }}
                              >
                                <AntDesign
                                  name="closecircleo"
                                  size={24}
                                  color="white"
                                />
                              </View>
                            </>
                          ) : (
                            <EvilIcons name="image" size={22} color="black" />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: 20,
                      }}
                    >
                      {images.slice(3, 6).map((url, index) => (
                        <Pressable
                          onPress={() => deletePicture(url)}
                          key={index}
                          style={{
                            borderColor: '#581845',
                            borderWidth: url ? 0 : 2,
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderStyle: 'dashed',
                            borderRadius: 10,
                            height: 100,
                          }}
                        >
                          {url ? (
                            <>
                              <Image
                                source={{ uri: url }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: 10,
                                  resizeMode: 'cover',
                                }}
                              />
                              <View
                                style={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                }}
                              >
                                <AntDesign
                                  name="closecircleo"
                                  size={24}
                                  color="white"
                                />
                              </View>
                            </>
                          ) : (
                            <EvilIcons name="image" size={22} color="black" />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      borderWidth: 1,
                      borderColor: 'gray',
                      borderRadius: 25,
                      justifyContent: 'center',
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Se-Hwa',
                        textAlign: 'center',
                        fontSize: 25,
                      }}
                    >
                      이미지 추가하기
                    </Text>
                  </TouchableOpacity>
                  <View style={{ marginTop: 20 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',

                        gap: 20,
                      }}
                    >
                      {pickImages &&
                        pickImages.slice(0, 3).map((url, index) => (
                          <Pressable
                            onPress={() => deletePicture(url)}
                            key={index}
                            style={{
                              borderColor: '#581845',
                              borderWidth: url ? 0 : 2,
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderStyle: 'dashed',
                              borderRadius: 10,
                              height: 100,
                            }}
                          >
                            {url ? (
                              <>
                                <Image
                                  source={{ uri: url }}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 10,
                                    resizeMode: 'cover',
                                  }}
                                />
                                <View
                                  style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                  }}
                                >
                                  <AntDesign
                                    name="closecircleo"
                                    size={24}
                                    color="white"
                                  />
                                </View>
                              </>
                            ) : (
                              <EvilIcons name="image" size={22} color="black" />
                            )}
                          </Pressable>
                        ))}
                    </View>
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: 20,
                      }}
                    >
                      {pickImages &&
                        pickImages.slice(3, 6).map((url, index) => (
                          <Pressable
                            onPress={() => deletePicture(url)}
                            key={index}
                            style={{
                              borderColor: '#581845',
                              borderWidth: url ? 0 : 2,
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderStyle: 'dashed',
                              borderRadius: 10,
                              height: 100,
                            }}
                          >
                            {url ? (
                              <>
                                <Image
                                  source={{ uri: url }}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 10,
                                    resizeMode: 'cover',
                                  }}
                                />
                                <View
                                  style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                  }}
                                >
                                  <AntDesign
                                    name="closecircleo"
                                    size={24}
                                    color="white"
                                  />
                                </View>
                              </>
                            ) : (
                              <EvilIcons name="image" size={22} color="black" />
                            )}
                          </Pressable>
                        ))}
                    </View>
                  </View>
                  {pickImages.length > 0 ? (
                    <TouchableOpacity onPress={sendImages}>
                      <View
                        style={{
                          marginVertical: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 5,
                          borderWidth: 2,
                          borderColor: 'red',
                          justifyContent: 'space-around',
                          borderRadius: 25,
                        }}
                      >
                        <AntDesign name="picture" size={30} color="red" />
                        <Text
                          style={{
                            color: 'red',
                            textAlign: 'center',
                            fontSize: 25,
                            fontFamily: 'Se-Hwa',
                            marginBottom: 8,
                          }}
                        >
                          사진을 업로드 하기
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                  {isLoading && (
                    <View
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.35)',
                        flex: 1,
                      }}
                    >
                      <ActivityIndicator size={100} />
                      <Text
                        style={{
                          fontFamily: 'Se-Hwa',
                          color: 'white',
                          fontSize: 50,
                        }}
                      >
                        다소 시간이 걸릴 수 있습니다.
                      </Text>
                    </View>
                  )}
                  {uploadImageButton && (
                    <View>
                      <TouchableOpacity
                        style={{
                          marginVertical: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 5,
                          borderWidth: 2,
                          borderColor: 'red',
                          justifyContent: 'space-around',
                          borderRadius: 25,
                        }}
                        onPress={imageUrlsUpdate}
                      >
                        <Text
                          style={{
                            color: 'red',
                            textAlign: 'center',
                            fontSize: 25,
                            fontFamily: 'Se-Hwa',
                            marginBottom: 8,
                          }}
                        >
                          이미지 업데이트 완료하기
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </ScrollView>
              )}
              {question === 'SavePeople' && (
                <ScrollView style={{}}>
                  <View style={{}}>
                    {savePeople?.map((i, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginLeft: 1,
                          marginTop: 4,
                          backgroundColor: 'white',
                          borderRadius: 25,
                          borderBottomWidth: 1,
                          borderBottomColor: 'gray',
                          //alignItems: 'center',
                          // shadowColor: '#000',
                          // shadowOffset: {
                          //   width: 0,
                          //   height: 3,
                          // },
                          // shadowOpacity: 0.27,
                          // shadowRadius: 4.65,

                          // elevation: 10,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginLeft: 5,
                            alignItems: 'center',
                          }}
                        >
                          <View>
                            <Image
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                              }}
                              source={{ uri: i.imageUrls[0] }}
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
                              {i.name}
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
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 4,
                            marginRight: 10,
                            alignItems: 'center',
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('ProfileDetail', {
                                userId: i._id,
                              })
                              setModalVisible(!isModalVisible)
                            }}
                          >
                            <FontAwesome5
                              name="user-circle"
                              size={30}
                              color="gray"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => deleteSaveProfile(i._id)}
                          >
                            <AntDesign
                              name="closecircleo"
                              size={30}
                              color="red"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}

              {question === 'Prompts' && (
                <ScrollView>
                  <View style={{ marginTop: 1, marginHorizontal: 1 }}>
                    {prompts
                      ? prompts?.map((item, index) => (
                          <Pressable
                            onPress={() => {
                              setQuestionModal(true)
                              setQuestionItem(item)
                              setQuestionRe(item.question)
                              setQuestionId(item._id)
                            }}
                            style={{
                              marginVertical: 2,
                              borderWidth: 2,
                              borderColor: 'gray',
                              borderRadius: 15,
                            }}
                            key={index}
                          >
                            <Text
                              style={{
                                fontSize: 17,
                                fontFamily: 'Se-Hwa',
                                padding: 2,
                                color: 'gray',
                              }}
                            >
                              {item.question}
                            </Text>
                            <Text
                              style={{
                                fontSize: 17,
                                marginLeft: 30,
                                color: 'red',
                                fontWeight: '500',
                                fontFamily: 'Se-Hwa',
                                marginBottom: 5,
                              }}
                            >
                              {item.answer}
                            </Text>
                          </Pressable>
                        ))
                      : null}
                  </View>
                </ScrollView>
              )}
            </KeyboardAvoidingView>
            {question === 'Email' && (
              <Button onPress={emailUpdate} title="Email 수정하기"></Button>
            )}
            {question === 'Age' && (
              <Button onPress={ageUpdate} title="나이 수정하기"></Button>
            )}
            {question === 'Region' && (
              <Button onPress={regionUpdate} title="지역 수정하기"></Button>
            )}
            {question === 'LookingFor' && (
              <Button
                onPress={lookingForUpdate}
                title="데이팅 목적 수정하기"
              ></Button>
            )}
            {question === 'Gender' && (
              <Button onPress={genderUpdate} title="성별 수정하기"></Button>
            )}
            {question === 'Status' && (
              <Button onPress={statusUpdate} title="상태 수정하기"></Button>
            )}
          </View>
        </ModalContent>
      </BottomModal>
      <Modal
        visible={questionModal}
        onTouchOutside={() => {
          setQuestionModal(false)
        }}
      >
        <ModalContent>
          <View>
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              {questionRe}
            </Text>
            <View
              style={{
                padding: 5,
                borderBottomColor: 'gray',
                marginTop: 30,
                borderBottomWidth: 1,
              }}
            >
              <TextInput
                onChangeText={(text) => setUpdateAnnswer(text)}
                placeholder="답을 입력하시오...."
                multiline={true}
              />
            </View>

            <TouchableOpacity
              style={{
                display: 'flex',

                flexDirection: 'row',
                justifyContent: 'flex-end',
                padding: 5,
                // borderTopColor: 'gray',
                // borderTopWidth: 1,
              }}
            >
              <TouchableOpacity
                onPress={promptUpdate}
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderRadius: 25,
                  color: 'blue',
                  marginTop: 15,
                  padding: 10,
                }}
              >
                <Text style={{ color: 'gray' }}>질문완료</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </ModalContent>
      </Modal>
    </ScrollView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  card: {
    width: 400,
    // height: tinderCardWidth * 1.67,
    aspectRatio: 1 / 1.67,
    borderRadius: 15,
    justifyContent: 'flex-end',
    position: 'absolute',

    // shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  image: {
    borderRadius: 15,
  },
  overlay: {
    top: '10%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  footer: {
    padding: 10,
  },
  name: {
    fontSize: 24,
    color: 'white',
    //fontFamily: 'InterBold',
  },
})
