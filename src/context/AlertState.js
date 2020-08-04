import React, { useState } from 'react';
import AlertModal from '../components/AlertModal/AlertModal';

export const AlertContext = React.createContext();
export default AlertState = ({ children }) => {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const defaultModalData = {
    title: '',
    description: '',
    buttons: [{ text: '', onPress: () => {} }],
  };
  const [alertModalData, setAlertModalData] = useState(defaultModalData);
  const openAlert = (data = defaultModalData) => {
    setAlertModalData(data);
    setAlertVisible(true);
  };
  const Alert = () => (
    <AlertModal closeModal={closeAlertModal} isVisible={isAlertVisible} {...{ alertModalData }} />
  );
  const closeAlertModal = () => setAlertVisible(false);
  return (
    <AlertContext.Provider
      value={{
        isAlertVisible,
        setAlertVisible,
        alertModalData,
        setAlertModalData,
        openAlert,
        closeAlertModal,
        Alert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
