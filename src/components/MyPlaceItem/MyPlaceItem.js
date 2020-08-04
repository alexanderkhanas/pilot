import React from 'react';
import s from './MyPlaceItem.s';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const MyPlaceItem = ({ onPress, theme, deleteItem, openAlert, editItem, item }) => {
  const {
    FAVNAME: name,
    ADDON_INFO: additionalInfo,
    NAMEST: street,
    NAMEHS: house,
    // UID: id,
    LAT: latitude,
    LON: longitude,
    SHNAME: settlement,
  } = item;
  const editItemHandler = () => editItem(item);
  const deleteItemHandler = () => {
    deleteItem(item);
  };
  return (
    <View style={{ ...s.container, backgroundColor: theme.main + '60' }}>
      <View style={{ ...s.row }}>
        <FontAwesome5Icon name="map-marker-alt" color={theme.text} size={30} />
        <View style={s.content}>
          <View style={s.header}>
            <View>
              <Text style={{ ...s.title, color: theme.text }}>{name || settlement}</Text>
              <Text style={{ ...s.additionalInfo, color: theme.text }}>{additionalInfo}</Text>
            </View>
            <FontAwesome5Icon
              onPress={deleteItemHandler}
              color={theme.text}
              name="times-circle"
              size={25}
              style={s.deleteIcon}
            />
          </View>

          <View style={{ ...s.textContainer, borderBottomColor: theme.rare }}>
            <Text style={{ ...s.text, color: theme.text }}>{settlement}</Text>
            <Text style={{ ...s.text, color: theme.text }}>{street}</Text>
            <Text style={{ ...s.text, color: theme.text }}>{house}</Text>
          </View>

          <View style={s.editItemContainer}>
            <FontAwesome5Icon
              onPress={editItemHandler}
              color={theme.text}
              name="pencil-alt"
              size={25}
              style={s.editItemIcon}
            />
            <TouchableOpacity
              onPress={() =>
                onPress(name, {
                  nativeEvent: {
                    coordinate: {
                      latitude,
                      longitude,
                    },
                  },
                })
              }
              style={{ ...s.button, backgroundColor: theme.secondary }}
            >
              <Text style={{ ...s.buttonText, color: theme.text }}>Замовити авто</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MyPlaceItem;
