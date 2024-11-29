import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Toggle from "react-native-toggle-element";
import { dataStatic, dataCalc } from "../assets/locale/data";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

export default App = () => {
  const [toggleValue, setToggleValue] = useState(false);
  const language = toggleValue ? "ID" : "EN";
  const text = dataStatic[language];
  const [connectButton, setConnectButton] = useState(false);
  const [connectValue, setConnectValue] = useState(text.bluetoothCon);
  const [quote, setQuote] = useState("Loading...");
  const [author, setAuthor] = useState("Loading...");
  const [imageSrc, setImageSrc] = useState("Loading...");

  const fetchQuote = () => {
    fetch("https://quotes-api-self.vercel.app/quote")
      .then((response) => response.json())
      .then((data) => {
        setQuote(data.quote || "No quote available");
        setAuthor(data.author || "No author available");
      })
      .catch((error) => {
        console.error(error);
        setQuote("Failed to load quote");
      });
  };

  const refreshContent = async () => {
    const uniqueUrl = `https://random-image-pepebigotes.vercel.app/api/random-image?${Date.now()}`;
    setImageSrc(uniqueUrl);
    fetchQuote();
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    setConnectValue(connectButton ? text.bluetoothDone : text.bluetoothCon);
  }, [text, connectButton]);

  const handleConnectButton = () => {
    setConnectButton((prev) => !prev); // Toggle connectButton state
  };

  const html = `
    <html>
      <body>
        <h1>Heart Rate: ${dataCalc.hr} BPM</h1>
        <h1>Blood Pressure: ${dataCalc.sistole}/${dataCalc.diastole}</h1>
        <h1>Blood Oxygen: ${dataCalc.oxygen}%</h1>
        <h1>Respiratory Rate: ${dataCalc.rr} BPM</h1>
      </body>
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
        <View style={[styles.greenBubble, styles.gap]}>
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
          <View style={styles.rateContainer}>
            <Image
              source={require("../assets/images/heartRate.png")}
              style={{ width: 12, height: 12 }}
            />
            <Text style={[styles.smallBold, styles.redFont]}>{text.bp}</Text>
          </View>
          <View style={styles.bpContainer}>
            <View style={styles.bpWrapper}>
              <Text style={styles.hrCount}>{dataCalc.sistole}</Text>
              <Text style={styles.countUnits}>SYS</Text>
            </View>
            <View style={styles.bpWrapper}>
              <Text style={styles.hrCount}>{dataCalc.diastole}</Text>
              <Text style={styles.countUnits}>DIA</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.greenBubble} onPress={refreshContent}>
          <View style={styles.quoteImage}>
            <Image
              style={{
                width: 250,
                height: 200,
                borderRadius: 10,
              }}
              source={{
                uri: imageSrc,
              }}
            />
          </View>
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{quote}"</Text>
            <Text style={styles.quoteAuthorText}>- {author}</Text>
          </View>
        </TouchableOpacity>
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
        <View style={styles.connectWrapper}>
          <TouchableOpacity onPress={handleConnectButton}>
            <View
              style={
                connectButton ? styles.connectButtonDone : styles.connectButton
              }
            >
              <Text style={[styles.title, styles.connectText]}>
                {connectValue}
              </Text>
            </View>
          </TouchableOpacity>
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
    alignItems: "stretch",
    gap: 10,
    width: "100%",
    marginBottom: 20,
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
  greenBubble: {
    backgroundColor: "#D3E9C4",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    height: "100%",
    maxHeight: 380,
  },
  greyBubble: {
    backgroundColor: "#EAEAEA",
    paddingTop: 15,
    paddingBottom: 30,
    borderRadius: 10,
    flexGrow: 1,
  },
  quoteContainer: {
    flex: 0,
    flexDirection: "column",
    gap: 10,
    justifyContent: "start",
    alignItems: "start",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  bpContainer: {
    flex: 0,
    flexDirection: "column",
    gap: 10,
    justifyContent: "start",
    alignItems: "start",
    backgroundColor: "white",
    padding: 10,
    marginTop: 10,
  },
  quoteText: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
    maxWidth: 250,
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
  bpContainer: {
    flex: 0,
    flexDirection: "column",
    gap: 10,
    justifyContent: "start",
    alignItems: "start",
    backgroundColor: "white",
    padding: 10,
    marginTop: 10,
  },
  bpWrapper: {
    flex: 0,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
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
  connectWrapper: {
    width: 550,
    borderRadius: 100,
    backgroundColor: "#F7E391",
    padding: 10,
  },
  connectButton: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 100,
    width: "100%",
    height: 55,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  connectButtonDone: {
    backgroundColor: "rgba(226, 199, 66, 0.5)",
    borderRadius: 100,
    width: "100%",
    height: 55,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  connectText: {
    textAlign: "center",
    width: "100%",
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
