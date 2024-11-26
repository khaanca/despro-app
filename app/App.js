import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import Toggle from "react-native-toggle-element";
import { dataStatic, dataCalc } from "../assets/locale/data";
import { SwipeButton } from "react-native-expo-swipe-button";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import ecg from "../assets/images/ecgGraph.png";

export default App = () => {
  const [toggleValue, setToggleValue] = useState(false);
  const language = toggleValue ? "ID" : "EN";
  const text = dataStatic[language];
  const [connectButton, setConnectButton] = useState(false);
  const [ecgBase, setEcgBase] = useState(ecg);

  const handleConnectButton = () => {
    setConnectButton(true);
  };

  const html = `
    <html>
      <body>
        <h1>Heart Rate: ${dataCalc.hr} BPM</h1>
        <h1>Blood Oxygen: ${dataCalc.oxygen}%</h1>
        <h1>Respiratory Rate: ${dataCalc.rr} BPM</h1>
        <img src="${ecgBase}" alt="ECG Graph" style="width:100%; height:auto; max-width:400px;" />      </body>
    </html>
  `;

  let generatePdf = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: true,
    });

    await shareAsync(file.uri);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.icon}
          />
          <Text style={styles.smallBold}>{text.appName}</Text>
        </View>
        <View style={styles.toggleWrapper}>
          <Toggle
            value={toggleValue}
            onPress={(newState) => setToggleValue(newState)}
            thumbActiveComponent={
              <View style={styles.thumbColor}>
                <Text style={styles.smallBold}>ID</Text>
              </View>
            }
            thumbInActiveComponent={
              <View style={styles.thumbColor}>
                <Text style={styles.smallBold}>EN</Text>
              </View>
            }
            trackBar={{
              activeBackgroundColor: "transparent",
              inActiveBackgroundColor: "transparent",
              borderActiveColor: "transparent",
              borderInActiveColor: "transparent",
              borderWidth: 1,
              width: 80,
            }}
          />
        </View>
      </View>
      <Text style={styles.xlTitle}>{text.title}</Text>
      <View style={styles.row}>
        <View style={styles.startButton}>
          <Text style={styles.title}>{text.press}</Text>
          <Text style={styles.subtitle}>{text.toStart}</Text>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/fingerprint.png")}
              style={styles.startImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rate}>
          <View style={styles.rateContainer}>
            <Image
              source={require("../assets/images/heartRate.png")}
              style={{ width: 12, height: 12 }}
            />
            <Text style={[styles.smallBold, styles.redFont]}>
              {text.heartRate}
            </Text>
          </View>
          <View style={styles.countContainer}>
            <Text style={styles.hrCount}>{dataCalc.hr}</Text>
            <Text style={styles.countUnits}>BPM</Text>
          </View>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.greyBubble}>
          <Image source={dataCalc.ecg} style={styles.graphSize} />
          <Text style={styles.title}>{text.ecg}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.rate}>
          <View style={styles.rateContainer}>
            <Image
              source={require("../assets/images/spo2.png")}
              style={{ width: 15, height: 15 }}
            />
            <Text style={[styles.smallBold, styles.redFont]}>
              {text.oxygen}
            </Text>
          </View>
          <View style={styles.countContainer}>
            <Text style={styles.rateCount}>{dataCalc.oxygen}</Text>
            <Text style={styles.countUnits}>%</Text>
          </View>
        </View>
        <View style={styles.rate}>
          <View style={styles.rateContainer}>
            <Image
              source={require("../assets/images/respiration-rate.png")}
              style={{ width: 15, height: 15 }}
            />
            <Text style={styles.smallBold}>{text.respiratoryRate}</Text>
          </View>
          <View style={styles.countContainer}>
            <Text style={styles.rateCount}>{dataCalc.rr}</Text>
            <Text style={styles.countUnits}>BPM</Text>
          </View>
        </View>
      </View>
      <View style={styles.row}>
        <View>
          <SwipeButton
            Icon={
              <Image
                source={require("../assets/images/bluetooth.png")}
                style={{ width: 50, height: 50 }}
              />
            }
            onComplete={handleConnectButton}
            title={text.bluetoothCon}
            titleStyle={{ color: "black", fontWeight: "bold" }}
            borderRadius={100}
            containerStyle={{
              backgroundColor: "#F7E391",
            }}
            underlayStyle={{ backgroundColor: "#F7E391" }}
            underlayTitle={text.bluetoothDone}
            underlayTitleStyle={{ color: "black", fontWeight: "bold" }}
            circleBackgroundColor="#F7E391"
            width={550}
          />
        </View>
        <View>
          <TouchableOpacity onPress={generatePdf}>
            <View style={styles.shareWrapper}>
              <View style={styles.shareButton}>
                <Image
                  source={require("../assets/images/share.png")}
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    width: 30,
    height: 32.86,
  },
  toggleWrapper: {
    backgroundColor: "#D3E9C4",
    borderRadius: 100,
  },
  thumbColor: {
    backgroundColor: "white",
    borderRadius: 100,
    padding: 16,
  },
  startButton: {
    backgroundColor: "#D3E9C4",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  greyBubble: {
    backgroundColor: "#EAEAEA",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderRadius: 10,
    alignItems: "center",
    flexGrow: 1,
  },
  graphSize: {
    width: "100%",
    height: 300,
    marginBottom: 10,
    borderRadius: 10,
  },
  startImage: {
    marginTop: 10,
    width: 100,
    height: 100,
  },
  rate: {
    backgroundColor: "#C3E5F0",
    paddingTop: 15,
    paddingBottom: 30,
    borderRadius: 10,
    flexGrow: 1,
  },
  rateContainer: {
    flex: 0,
    flexDirection: "row",
    gap: 15,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  rateImage: {
    width: 20,
    height: 20,
  },
  countContainer: {
    flex: 0,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    marginTop: 10,
  },
  hrCount: {
    fontSize: 80,
    fontWeight: "bold",
  },
  rateCount: {
    fontSize: 60,
    fontWeight: "bold",
  },
  countUnits: {
    fontSize: 20,
    color: "rgba(0,0,0,0.5)",
  },
  shareContainer: {
    flexGrow: 1,
  },
  smallImage: {
    marginTop: 10,
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  shareWrapper: {
    backgroundColor: "#EAEAEA",
    padding: 10,
    borderRadius: 15,
  },
  shareButton: {
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 10,
    borderRadius: 10,
  },
  xlTitle: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "left",
    lineHeight: 38,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#38434D",
  },
  subBold: {
    color: "black",
    fontSize: 17,
    fontWeight: "bold",
  },
  small: {
    color: "black",
    fontSize: 14,
  },
  smallBold: {
    color: "black",
    fontSize: 12,
    fontWeight: "bold",
  },
  redFont: {
    color: "#E00000",
  },
  center: {
    textAlign: "center",
    alignItems: "center",
  },
});
