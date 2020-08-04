import React, { useRef } from 'react';
import s from './CropImageModal.s';
import { useStore } from '../../stores/createStore';
import { Modal, View, TouchableWithoutFeedback, TouchableOpacity, Text } from 'react-native';
import { CropView } from 'react-native-image-crop-tools';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { observer } from 'mobx-react';

const CropImageModal = ({ closeModal, onSave, cropPhoto, visible, otherButtons = [], ...rest }) => {
  const { theme } = useStore((store) => store.viewer);
  const cropRef = useRef();
  return (
    <Modal {...{ visible }} transparent={true} animationType="slide">
      <View style={s.cropContainer}>
        <View style={{ ...s.cropHeader, backgroundColor: theme.main }}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <FontAwesome5Icon color={theme.text} name="times-circle" size={30} />
          </TouchableWithoutFeedback>
        </View>
        <CropView
          sourceUrl={cropPhoto.uri}
          style={s.crop}
          ref={cropRef}
          onImageCrop={onSave}
          {...rest}
        />
        <View style={{ ...s.cropFooter, backgroundColor: theme.main }}>
          <TouchableOpacity style={s.saveButton}>
            <Text
              onPress={() => cropRef.current.saveImage(true, 90)}
              style={{ ...s.saveText, color: theme.text }}
            >
              Зберегти
            </Text>
          </TouchableOpacity>
          {/* <FontAwesome5Icon
            onPress={() => cropRef.current.saveImage(true, 90)}
            color={theme.text}
            name="save"
            size={40}
          /> */}
          {!!otherButtons.length &&
            otherButtons.map(({ icon, onPress, text }, i) =>
              icon ? (
                <FontAwesome5Icon name={icon} {...{ onPress }} color={theme.text} size={40} />
              ) : (
                <TouchableOpacity {...{ onPress }}>
                  <Text style={s.buttonText}>{text}</Text>
                </TouchableOpacity>
              ),
            )}
        </View>
      </View>
    </Modal>
  );
};

export default observer(CropImageModal);
