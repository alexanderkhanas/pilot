import React from 'react';
import s from './AboutDriver.s';
import { View } from 'react-native';
import DriverInfo from '../../components/DriverInfo/DriverInfo';
import Header from '../../components/Header/Header';
import messages from '../../../assets/messages.png';
import GestureWrapper from '../../components/GestureWrapper/GestureWrapper';
import Comments from '../../components/Comments/Comments';
export default ({ navigation, route }) => {
  const driver = route.params.driver;
  return (
    <GestureWrapper onSwipeRight={navigation.openDrawer}>
      <View style={s.container}>
        <Header
          title={'Відгуки про водія'}
          iconSource={messages}
          back={() => navigation.navigate('Головна')}
        />
        <DriverInfo
          driver={{ name: driver.name, carNumber: driver.carNumber }}
        />
        {driver.comments &&
          driver.comments.map((comment, i) => (
            <Comments
              key={i}
              comment={{
                date: comment.date,
                numberOfStars: comment.numberOfStars,
                body: comment.body,
                author: comment.author,
              }}
            />
          ))}
      </View>
    </GestureWrapper>
  );
};
