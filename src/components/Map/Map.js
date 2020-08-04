import React, { forwardRef, useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import Car from '../Car/Car';
import { View, TouchableOpacity, Text } from 'react-native';
import { observer } from 'mobx-react';
import { useStore } from '../../stores/createStore';
import darkMap from '../../styles/darkMap.json';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import s from './Map.s';

const Map = forwardRef(
  (
    {
      marker,
      nextCarPosition,
      order,
      isCarVisible,
      style,
      onMapLayout,
      centerMapByUser,
      iconsVisible,
      isCenterIconVisible,
      selectPlace,
      ...rest
    },
    ref,
  ) => {
    const [isMapRendered, setMapRendered] = useState(false);
    const [mapType, setMapType] = useState('standard');
    const onLayout = async () => {
      await onMapLayout();
      setMapRendered(true);
    };
    const switchMapType = () =>
      setMapType((prev) => (prev === 'standard' ? 'satellite' : 'standard'));
    const { theme } = useStore((store) => store.viewer);
    return (
      <>
        <MapView
          ref={ref}
          {...{ onLayout }}
          style={style}
          {...rest}
          provider="google"
          {...{ mapType }}
          showsMyLocationButton={false}
          customMapStyle={theme.type == 'lightTheme' ? [] : darkMap}
        >
          {!!marker && isMapRendered && <Marker coordinate={marker} />}
          {isCarVisible && isMapRendered && (
            <Car marker={marker} nextCarPosition={nextCarPosition} order={order} />
          )}
        </MapView>
        {iconsVisible && (
          <View style={s.buttonsContainer}>
            {isCenterIconVisible && (
              <TouchableOpacity
                onPress={centerMapByUser}
                style={{ ...s.iconContainer, backgroundColor: theme.main }}
              >
                <FontAwesome5Icon color={theme.text} name="street-view" size={30} style={s.icon} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={switchMapType}
              style={{
                ...s.iconContainer,
                backgroundColor: theme.main,
                marginTop: isCenterIconVisible ? 20 : 0,
              }}
            >
              <FontAwesome5Icon
                name={mapType === 'satellite' ? 'map-marked-alt' : 'satellite-dish'}
                style={s.icon}
                color={theme.text}
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  },
);

export default observer(Map);
