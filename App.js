import { StyleSheet, View, FlatList, TextInput } from 'react-native';
import { Button, Input, Text, ButtonGroup } from '@rneui/themed';
import { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import * as Font from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import { Listbox } from '@headlessui/react';
import Unorderedlist from 'react-native-unordered-list';

async function cacheFonts(fonts) {
  return fonts.map(async (font) => await Font.loadAsync(font))
}
const Stack = createNativeStackNavigator()

const questions = [
  {
    "prompt": `Q1: Select the best answer:\n "Who are you?"`,
    "type": "multiple-choice",
    "choices": [
      "It's just me, myself and I",
      "거울 속 비친 넌 누구인가",
      "기대 안에 기대 이 길의 뒤에",
      "All of the above",
    ],
    "correct": 3
  },
  {
    "prompt": `Q2: Fill in the blank:\n "Happy ______ day"`,
    "type": "multiple-answer",
    "choices": [
      "Birthday",
      "Death",
      "Best",
      "Worst",
    ],
    "correct": [1,3]
  },
  {
    "prompt": `Q3: Is the following statment true or false?\n
      Stray Kids, STAY or none, we're gonna cross the finish line`,
    "type": "true-false",
    "choices": [
      "True",
      "False",
    ],
    "correct": 0
  },
  {
    "prompt": `Q4: What does ZB1 stand for?`,
    "type": "open-response",
    "choices": [
    ],
    "correct": "zerobaseone"
  },
  {
    "prompt": `Q5: Complete the quote:\n
      "We the best ___"`,
    "type": "drop-down",
    "choices": [
      "Boyz",
      "Boys",
      "Fruits",
      "Kids",
      "Adults",
      "Girlz",
      "Girls",
    ],
    "correct": 0
  }
]

function Question({navigation, route}) {
  console.log(route.params)
  const { questionNumber, userChoices, data } = route.params
  let { choices, prompt, type } = data[questionNumber]
  let [selectedIndex, setSelectedIndex] = useState(0)
  let [selectedIndexes, setSelectedIndexes] = useState([])
  let [openResponse, setOpenResponse] = useState("")
  let [dropDown, setDropDown] = useState(false)
  let nextQuestion = () => {
    let nextQuestion = questionNumber + 1
    if ( type !== 'multiple-answer') {
      userChoices.push(selectedIndex)
    } else {
      userChoices.push(selectedIndexes)
    }
    if (nextQuestion < questions.length) {
      console.log("next question")
      navigation.navigate('Question', {
        questionNumber: nextQuestion,
        questions,
        userChoices,
        openResponse,
      })
    } else {
      navigation.navigate('SummaryScreen', {
        questionNumber: nextQuestion,
        questions,
        userChoices,
        openResponse,
      })
    }
  }
  if (type == 'open-response') {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>{prompt}</Text>
        {/* <Input
          testID="choices"
          placeholder='Your answer...'
          onChangeText={setOpenResponse}
          value={openResponse}
        /> */}
        <TextInput testID="choices" 
          placeholder="Your answer..."
          style={styles.input}
          onChangeText={(text) => setOpenResponse(text)}
          value={openResponse}>
        </TextInput>
        <Button 
          testId="next-question"
          onPress={nextQuestion}
          title="Next"
        ></Button>
      </View>
    )
  }
  if (type == 'drop-down') {
    const questions4 = questions[4].choices
    const MyListBoxOption = React.forwardRef((props, ref) => {
      return <Unorderedlist {...props} ref={ref} />
    })
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>{prompt}</Text>
        <Listbox value={dropDown} onChange={setDropDown}>
          <Listbox.Button style={styles.listbox}>
            {dropDown || "Choose an answer..."}
          </Listbox.Button>    
          <Listbox.Options>
            {questions4.map((choice, index) => (
              <Listbox.Option
                key={index}
                value={choice}
              >
                <MyListBoxOption>
                  <Text style={styles.choices}>{choice}</Text>
                </MyListBoxOption>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
        <Button 
          testId="next-question"
          onPress={nextQuestion}
          title="Next"
        ></Button>
      </View>
    )
  }
  return (
  <View style={styles.container}>
    <Text style={styles.heading}>{prompt}</Text>
    {type !== 'multiple-answer' ? (
      <ButtonGroup
        testID="choices"
        buttons={choices}
        vertical
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value)
        }}
        containerStyle={{marginBottom: 20, width: '70'}}
        />
    ):(
      <ButtonGroup
        testID="choices"
        buttons={choices}
        vertical
        selectMultiple
        selectedIndexes={selectedIndexes}
        onPress={(value) => {
          setSelectedIndexes(value)
        }}
        containerStyle={{marginBottom: 20, width: '70'}}    
      />
    )}
    <Button 
      testId="next-question"
      onPress={nextQuestion}
      title="Next"
    ></Button>
  </View>
  )
}

function SummaryScreen({route, openResponse}) {
  let calculateCorrect = (userSelected, correct, type) => {
    let userCorrect = false 
    if (type == 'multiple-answer') {
      userCorrect = userSelected.sort().toString() === correct.sort().toString()
    } else {
      userCorrect = userSelected == correct 
    }
    return userCorrect
  }
  let totalScore = 0
  let openResLower = route.params.openResponse.toLowerCase()
  for (let i = 0; i < route.params.data.length; i++) {
    if (calculateCorrect(
      route.params.userChoices[i],
      route.params.data[i].correct,
      route.params.data[i].type
      )
    ) {
      totalScore++
    } else if (route.params.data[i].type == 'open-response' && 
      openResLower == route.params.data[i].correct) {
      totalScore++
    }
  }
return (
  <View style={styles.container}>
    <View>
      <Text style={styles.heading}>Summary</Text>
      <Text style={styles.subheading}>Score: {totalScore}</Text>
    </View>
    <FlatList
    data={route.params.data}
    renderItem={({item, index}) => {
      let { choices, prompt, type, correct } = item
      let userSelected = route.params.userChoices[index]
      let openAnswer = ""
      if (type == 'open-response') {
        openAnswer = correct
      }
      let isCorrect = openResLower === correct
        if (openResLower == correct) {
          <Text style={{backgroundColor: 'lightgreen', textAlign: 'center', fontSize: 20}}>Correct</Text>
        } else {
          <Text style={{backgroundColor: 'lightgray', textAlign: 'center', fontSize: 20}}>Incorrect</Text>
        }
      console.log("index " + index)
      console.log("userSelected " + userSelected)
      console.log("openResponse " + openResponse)
      console.log("isCorrect " + isCorrect)
      return (
        <View key={index}>
          <Text style={styles.subheading}>{prompt}</Text>
          { type == 'open-response' ? (
            <View>
              <Text style={styles.openRes}>Your answer: {route.params.openResponse}</Text>
              <Text style={styles.openRes}>Correct answer: {openAnswer}</Text>
              {isCorrect ? (
                <Text style={{backgroundColor: 'lightgreen', textAlign: 'center', fontSize: 20}}>Correct</Text>
              ) : (
                <Text style={{backgroundColor: 'lightgray', textAlign: 'center', fontSize: 20}}>Incorrect</Text>
              )}
            </View>
          ) : (
          choices.map((value, choiceIndex) => {
            let incorrect = false
            let userDidSelect = false 
            if (type == 'multiple-answer') {
              userDidSelect = userSelected.includes(choiceIndex)
              incorrect = userDidSelect && !correct.includes(choiceIndex)
            } else {
              userDidSelect = userSelected == choiceIndex
              incorrect = userDidSelect && userSelected !== correct
            }
            return (
              <CheckBox
              containerStyle={{
                backgroundColor: userDidSelect ? incorrect == false
                  ? 'lightgreen'
                  : 'lightgray'
                : undefined,
              }}
              checked = {
                type == 'multiple-answer'
                  ? correct.includes(choiceIndex)
                  : correct == choiceIndex
              }
              textStyle={{
                textDecorationLine: incorrect
                  ? 'line-through'
                  : undefined,
              }}
              key={value}
              title={value}
              ></CheckBox>
            )
          })
        )}
        </View>
        )
      }}
    ></FlatList>
    <Button title="Restart" style={styles.button} onPress={() => navigation.navigate('Question')}></Button>
  </View>
  )  
}

export default function App() {
  cacheFonts([FontAwesome.font])
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Question">
        <Stack.Screen
          name="Question"
          initialParams={{
            questionNumber: 0,
            data: questions,
            userChoices: []
          }}
          options={{headerShown: false}}>
          {(props) => <Question {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="SummaryScreen"
          initialParams={{
            questionNumber: questions.length - 1,
            data: questions,
            userChoices: [3, [1, 3], 0, "zonebaseone", 0],
          }}
          options={{headerShown: false}}
          component={SummaryScreen}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    alignItems: 'center',
    padding: 10,
  },
  buttonGroup: {
    backgroundColor : "#2089dc",
    color : "white",
    textAlign : "center",
    paddingVertical : 5,
    marginBottom : 10,
  },
  space: {
    height: 10
  },
  heading: {
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 10
  },
  subheading: {
    fontSize: 25,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingBottom: 20
  },
  summary: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 15
  },
  summaryAnd: {
    fontSize: 17,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 10
  },
  choices: {
    margin: 6,
    padding: 6,
    textAlign: 'center',
    fontStyle: 'semibold',
    backgroundColor: '#DFEDFF',
  },
  listbox: {
    margin: 15,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#9FCBFF'
  },
  openRes: {
    fontSize: 20,
    textAlign: 'center',
    margins: 10  
  },
  input: {
    backgroundColor: "#D5D5D5",
    fontSize: 20,
    alignItems: 'center',
    padding: 10,
    margin: 15
  },
})