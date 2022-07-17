import React, { createContext, useContext, useState }  from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../context/ThemeProvider';

let ModalContext = createContext();


//Function for creating context for interior components
function useModal() {
    const context = React.useContext(ModalContext);
    if (!context) {
      throw new Error("useModal must be used in or within a Modal Component");
    }
    return context;
  }

/*Parent Function for modal component

Parameters: 
    @param {string (%) | number } height -- percent size of modal (or pixel size) 
    @param {string (color | hex) } color -- background color of modal 
    @param {string ('default' | 'small') } barSize -- depending on the size of the modal, determine the size of toggle bar

    children -- components inside component; 

props --
    **NOTE: must include normal modal props in the props of the BottomSheetModal such as:
        isVisible={isModalVisible} 
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete = {toggleModal} 
*/ 
const BottomSheetModal = ({ height = '50%', color = '#565656', barSize = 'default', children, ...props}) => {
    {
      const {theme} = useTheme();
      return (
        <ModalContext.Provider value={{}}>
            <Modal
                style={styles(theme).BottomModalView}
                swipeDirection={['down']}
                {...props}
            >
                <View style={[styles(theme).ModalContainer, {height: height, backgroundColor:color}]}>
                    {barSize == 'default' ? (<View style={styles(theme).modalBar}></View>) : 
                        (<View style={styles(theme).modalSmallBar}></View>)}

                        {children}
                </View>
            </Modal>
        </ModalContext.Provider>
      );
    }
  };

/*      Component for adding a second bottom layer on modal

    Parameters: 
        @param {string (color | hex) } color -- background color of modal ; 
        @param {string ('default' | 'small') } size -- depending on the size of the modal, determine the size of second layer
        
        children -- components inside component; 
*/
  const ModalSecondContainer = ({ children, color='#757575', size = 'default'}) => {
    let height;
    {size == 'default' ? height = '85%': height='70%'}
    const {theme} = useTheme();
    let context = useModal();
    return(
        <View style={[styles(theme).ModalSecondaryView, {backgroundColor: color, height: height}]}>
            {children}
        </View>
    )
  };
  BottomSheetModal.SecondContainer = ModalSecondContainer;


/*      Component for adding a top header

    Parameters: 
        @param {number} verticalMargin -- depending on the size of the modal, determine the margin of text 
        @param {number} fontSize -- depending on the size of the modal, determine the fontSize of text
        
        children -- text of header; 
*/
  const ModalHeader = ({ children, verticalMargin = 10, fontSize = 20}) => {
    const {theme} = useTheme();
    let context = useModal();
    return(
        <Text style={[styles(theme).ModalHeader,{marginVertical: verticalMargin, fontSize: fontSize}]}>{children}</Text>
    )
  };
  BottomSheetModal.Header = ModalHeader;


  
  const styles = (theme) => StyleSheet.create({
    BottomModalView:{
        margin: 0,
        justifyContent: 'flex-end',
      },
      ModalContainer: {
        width: '100%',
        height: '45%',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        alignItems: 'center',
        justifyContent: 'space-between',

        shadowColor: '#171717',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 5,
      },
      modalSmallBar:{
        height: 2,
        marginTop: 4,
        width: '15%',
        borderRadius: 25,
        backgroundColor: 'white',
      },
      modalBar:{
        height: 4,
        marginTop: 8,
        width: '22%',
        borderRadius: 25,
        backgroundColor: 'white', //theme.grey1,
      },
      ModalHeader: {
        //style for text at the top of the popup
        fontWeight: '700',
        color:'white', 
        textAlign: 'center',
        fontSize: 20,
      },
      ModalSecondaryView: {
        width: '100%',
        height: '85%',
        paddingHorizontal: 35,
        paddingVertical: 20,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        marginBottom: 0,
      },
      ModalText: {
        color:'white', 
        marginVertical: 5,
        textAlign: 'left',
        fontSize: 16,
      },
  });
  
  
  export { BottomSheetModal };