import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons'
import LottieView from 'lottie-react-native'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import { FontAwesome } from '@expo/vector-icons'
import { useSelector } from 'react-redux'

const ChargeHeart = () => {
  const route = useRoute()
  const { userId, user } = useSelector((state) => state.user)

  const [price, setPrice] = useState('')
  const [count, setCount] = useState('')
  const [userData, setUserData] = useState()
  const [chargeModal, setChargeModal] = useState(false)

  const navigation = useNavigation()

  useEffect(() => {
    setUserData(user)
  }, [user])

  const fetchUser = async () => {
    await axios
      .post(`${baseUrl}/api/user/user-profile`, { userId: user._id })
      .then((res) => {
        setUserData(res.data.user)
      })
      .catch((err) => console.log('profile Error', err))
  }

  const updateHeartCount = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-heartCount`, {
        userId: user._id,
        count,
      })
      .then((res) => {
        if (res.data.status == true) {
          Alert.alert('성공', '하트갯수가 성공적으로 업데이트 되었습니다')

          fetchUser()
          navigation.navigate('Profile')
        }
      })
      .catch((err) => console.log('heart count update Errro', err))
  }

  console.log('user', count, price)

  return (
    <SafeAreaView
      style={{ backgroundColor: 'white', flex: 1, alignItems: 'center' }}
    >
      <View>
        <View
          style={{
            marginHorizontal: 20,
            borderBottomWidth: 1,
            paddingVertical: 5,
            marginTop: 20,
            borderBottomColor: 'gray',
          }}
        >
          <Text style={{ fontFamily: 'Se-Hwa', fontSize: 27 }}>
            <Text style={{ color: '#ff7e67' }}>{userData?.name}</Text>님의 남의
            하트갯수 :{' '}
            <Text style={{ color: '#ff7e67' }}>{userData?.heartCount}개</Text>
          </Text>
        </View>
        <View>
          <LottieView
            source={require('../assets/heart.json')}
            style={{
              height: 300,
              width: 200,
              alignSelf: 'center',
              marginTop: 2,
              //justifyContent: 'center',
            }}
            autoPlay
            loop={true}
            speed={1}
          />
        </View>
        <View style={{ marginTop: -60 }}>
          <Text style={{ fontFamily: 'Se-Hwa', fontSize: 25, color: 'gray' }}>
            결제할 상품을 골라 주세요.
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              setPrice(1500)
              setCount(10)
            }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              borderWidth: 1,
              borderColor: price == 1500 ? '#ff7e67' : 'gray',
              marginTop: 30,
              paddingVertical: 10,
              borderRadius: 15,
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <AntDesign
                name="hearto"
                size={30}
                color={price == 1500 ? '#ff7e67' : 'gray'}
              />
              <Text
                style={{
                  fontFamily: 'Se-Hwa',
                  color: price == 1500 ? '#ff7e67' : 'gray',
                  fontSize: 30,
                }}
              >
                {' '}
                X 10개
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontFamily: 'Se-Hwa',
                  color: price == 1500 ? '#ff7e67' : 'gray',
                  fontSize: 30,
                }}
              >
                1500원
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPrice(3000)
              setCount(25)
            }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              borderWidth: 1,
              borderColor: price == 3000 ? '#ff7e67' : 'gray',
              marginTop: 30,
              paddingVertical: 10,
              borderRadius: 15,
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <AntDesign
                name="hearto"
                size={30}
                color={price == 3000 ? '#ff7e67' : 'gray'}
              />
              <Text
                style={{
                  fontFamily: 'Se-Hwa',
                  color: price == 3000 ? '#ff7e67' : 'gray',
                  fontSize: 30,
                }}
              >
                {' '}
                X 25개
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontFamily: 'Se-Hwa',
                  color: price == 3000 ? '#ff7e67' : 'gray',
                  fontSize: 30,
                }}
              >
                3000원
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPrice(4000)
              setCount(40)
            }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              borderWidth: 1,
              borderColor: price == 4000 ? '#ff7e67' : 'gray',
              marginTop: 30,
              paddingVertical: 10,
              borderRadius: 15,
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <AntDesign
                name="hearto"
                size={30}
                color={price == 4000 ? '#ff7e67' : 'gray'}
              />
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: 'Se-Hwa',
                  color: price == 4000 ? '#ff7e67' : 'gray',
                }}
              >
                {' '}
                X 40개
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: 'Se-Hwa',
                  color: price == 4000 ? '#ff7e67' : 'gray',
                }}
              >
                4000원
              </Text>
            </View>
          </TouchableOpacity>
          {price && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                borderColor: 'gray',
                marginTop: 30,
                paddingVertical: 10,
                backgroundColor: '#ff7e67',
                borderRadius: 15,
              }}
            >
              <TouchableOpacity onPress={() => setChargeModal(true)}>
                <Text
                  style={{ color: 'white', fontFamily: 'Se-Hwa', fontSize: 30 }}
                >
                  결제하기
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Modal
          contentContainerStyle={{ marginBottom: 30 }}
          visible={chargeModal}
          onTouchOutside={() => {
            setChargeModal(false)
          }}
          animationType="slide"
          transparent={true}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 22,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                margin: 10,
                borderRadius: 20,
                width: 300,
                height: 400,
                padding: 15,
                alignItems: 'center',
                shadowColor: 'white',
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.55,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  paddingBottom: 20,
                }}
              >
                <Text style={{ fontFamily: 'Se-Hwa', fontSize: 30 }}>
                  하트를 충전하시겠습니까?
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 30,
                    fontFamily: 'Se-Hwa',
                    color: 'gray',
                    marginTop: 10,
                  }}
                >
                  충전갯수 :{' '}
                </Text>
                <AntDesign
                  name="hearto"
                  size={30}
                  color="#ff7e67"
                  style={{ marginTop: 10 }}
                />
                <Text
                  style={{
                    fontSize: 40,
                    fontFamily: 'Se-Hwa',
                    color: '#ff7e67',
                  }}
                >
                  {' '}
                  X {count}개
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 30,
                    fontFamily: 'Se-Hwa',
                    color: 'gray',
                    marginTop: 10,
                  }}
                >
                  결제금액 :{' '}
                </Text>

                <Text
                  style={{
                    fontSize: 40,
                    fontFamily: 'Se-Hwa',
                    color: '#ff7e67',
                    marginBottom: 10,
                  }}
                >
                  {' '}
                  {price}원
                </Text>
              </View>
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: 'gray',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 15,
                }}
              >
                <TouchableOpacity
                  onPress={updateHeartCount}
                  style={{
                    borderRadius: 25,
                    paddingVertical: 5,
                    backgroundColor: 'pink',
                    marginTop: 20,
                    marginHorizontal: 2,
                    paddingHorizontal: 20,

                    alignSelf: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Se-Hwa',
                      fontSize: 30,
                      textAlign: 'center',
                      color: 'white',
                    }}
                  >
                    결제하기
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setChargeModal(false)}
                  style={{
                    borderRadius: 25,
                    paddingVertical: 5,
                    backgroundColor: 'gray',
                    marginTop: 20,
                    marginHorizontal: 2,
                    paddingHorizontal: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Se-Hwa',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: 30,
                    }}
                  >
                    취소하기
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

export default ChargeHeart

const styles = StyleSheet.create({})
