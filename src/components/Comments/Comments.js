import React, { useEffect, useState } from 'react';
import s from './Comments.s';
import { View, Text, Image } from 'react-native';
import { appColors } from '../../styles/global';
import star from '../../../assets/star.png';

export default ({ comment }) => {
  const [stars, setStars] = useState();
  useEffect(() => {
    let starsCopy = [];
    for (let i = 0; i < comment.numberOfStars; i++) {
      starsCopy.push(<Image key={i} source={star} style={s.star} />);
    }
    setStars(<View style={s.starContainer}>{starsCopy}</View>);
  }, []);
  return (
    <View style={{ ...s.commentContainer, backgroundColor: appColors.main }}>
      <View style={s.commentBody}>
        <Text style={s.text}>{comment.body}</Text>
        <Text style={s.author}>{comment.author}</Text>
      </View>
      <View style={s.commentInfo}>
        <Text>{comment.date}</Text>
        {stars}
      </View>
    </View>
  );
};
