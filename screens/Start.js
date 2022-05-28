import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useFonts, NovaCut_400Regular } from "@expo-google-fonts/nova-cut";
import AppLoading from "expo-app-loading";
import coachk from "../assets/coachk.png";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { useDispatch } from "react-redux";
import { setGroupCode, setGroupName } from "../redux/reducers/userSlice";

require("firebase/firestore");

/* let GROUPS = [
  {
    code: 'r7seg1xy',
    name: 'stinkyalvintest'
  },
  {
    code: '12345',
    name: 'testerdude'
  }
  ]; */

let GROUPS = new Array();

//const for list Items of Groups List
const Group = ({ name, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.listItem}>
    <Text style={styles.listText}>{name}</Text>
  </TouchableOpacity>
);

export default function Start({ navigation }) {
  let [fontsLoaded] = useFonts({
    NovaCut_400Regular,
  });

  const [loaded, setLoaded] = useState(false); // for checking if firebase is read before rendering

  const dispatch = useDispatch();
  //for rendering list items of Groups
  const renderGroup = ({ item }) => {
    return (
      <Group
        name={item.name}
        onPress={() => {
          navigation.navigate("GroupInfo", {
            //pass groupcode and group name parameters
            code: item.code,
            name: item.name,
          });
          dispatch(setGroupCode(item.code));
          dispatch(setGroupName(item.name));
        }}
      />
    );
  };

  //firebase reference to current user
  const userRef = firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid);

  useEffect(() => {
    let mounted = true;
    //Accesses Names of Members from firebase and adds them to the array
    userRef
      .get()
      .then((doc) => {
        let currGroup = doc.data().groupCode; //will eventually probably be an array
        console.log(currGroup);


        if (!(currGroup.length === 0)){
          currGroup.forEach((group) => {
          let current = {
            code: group.groupCode,
            name: group.name,
          };
          let codeExists;
          if (GROUPS.length === 0) codeExists = false;
          else {
            codeExists = GROUPS.some((e) => e.code === group.code);
          }


          if (mounted && !codeExists) {
            GROUPS.push(current);
          }
          });
        }
        
        /*  console.log ("current name:", currCode);
        //add condition here:

        let current = {
          code: currCode,
          name: 'stinkyalvintester'
        };

        let codeExists;
        if (GROUPS.length === 0) codeExists = false;
        else {
          codeExists = (GROUPS.some(e => e.code === currCode));
        }
        console.log(GROUPS);

        if (mounted && !codeExists){
          GROUPS.push(current);
        } */
        return doc;
      })
      .then((doc) => {
        setLoaded(true);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    return () => (mounted = false);
  }, []);

  if (!fontsLoaded || !loaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.startContainer}>
        {/* <View style={styles.header}>
          <Text style={styles.banner}>Krzyzewskiville</Text>
        </View> */}
        <Image source={coachk} style={styles.image} />
        <SafeAreaView>
          <FlatList
            data={GROUPS}
            renderItem={renderGroup}
            keyExtractor={(item) => item.code}
          />
        </SafeAreaView>
        <View style={styles.textContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("JoinGroup")}
          >
            <Text style={styles.buttonText}>Join Group</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CreateGroup")}
          >
            <Text style={styles.buttonText}>Create New Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  startContainer: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#1f509a",
    alignItems: "center",
    marginTop: "0%",
  },
  header: {
    left: "0%",
    width: "100%",
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
  banner: {
    color: "#fff",
    fontFamily: "NovaCut_400Regular",
    fontSize: 36,
    left: "0%",
  },
  image: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    width: "65%",
    textAlign: "center",
    borderRadius: 15,
    //height: "7%",
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
  },
  listItem: {
    backgroundColor: "green",
    padding: 8,
    marginVertical: 4,
    borderRadius: 7,
    width: 300,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  listText: {
    fontSize: 16,
    fontFamily: "sans-serif",
    fontWeight: "550",
    color: "white",
  },
});
