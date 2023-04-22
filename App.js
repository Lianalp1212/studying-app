// used lab9 as a base
// question one reference - https://colorcodedlyrics.com/2022/12/30/ateez-halazia/
// question two refercne - https://colorcodedlyrics.com/2021/12/09/xdinary-heroes-egseudineoli-hieolojeu-happy-death-day/
// question three reference  - https://colorcodedlyrics.com/2021/12/23/stray-kids-broken-compass-gojangnan-nachimban/

import { StyleSheet, View, FlatList } from 'react-native';
import { Button, CheckBox, Input, Text, ButtonGroup } from '@rneui/themed';
import { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator()

const QUESTION1_SCREEN = "Question1"
const QUESTION2_SCREEN = "Question2"
const QUESTION3_SCREEN = "Question3"
const SUMMARY_SCREEN = "Summary"

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  let questions = [
    {
      "prompt": "Q1: Select the best answer: Who are you?",
      "type": "multiple-choice",
      "index": 0,
      "key": "0",
      "choices": [
        "It's just me, myself and I",
        "거울 속 비친 넌 누구인가",
        "기대 안에 기대 이 길의 뒤에",
        "All of the above",
    ],
      "correct": 3
    },
    {
      "prompt": "Q2: Fill in the blank: Happy ______ day",
      "type": "multiple-answer",
      "index": 1,
      "key": "1",
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
      "index": 2,
      "key": "2",
        "choices": [
        "True",
        "False",
    ],
      "correct": 0
    },
  ]
    return (
      <NavigationContainer>{
        <Stack.Navigator initialRouteName={QUESTION1_SCREEN}>
          <Stack.Screen name="Question1" component={Question1Screen} initialParams={{questions: questions, currentQuestionIndex: currentQuestionIndex, 
            answeredCount: answeredCount}} options={{headerShown: false}}></Stack.Screen>
          <Stack.Screen name="Question2" component={Question2Screen} initialParams={{questions: questions, currentQuestionIndex: currentQuestionIndex, 
            answeredCount: answeredCount}} options={{headerShown: false}}></Stack.Screen>
          <Stack.Screen name="Question3" component={Question3Screen} initialParams={{questions: questions, currentQuestionIndex: currentQuestionIndex, 
            answeredCount: answeredCount}} options={{headerShown: false}}></Stack.Screen>
          <Stack.Screen name="Summary" component={SummaryScreen} initialParams={{questions: questions, currentQuestionIndex: currentQuestionIndex, 
            answeredCount: answeredCount}} options={{headerShown: false}}></Stack.Screen>
        </Stack.Navigator>
    }</NavigationContainer>
  );
}

function check({currentQuestion, prevAnsweredCount, selectedIndex, setAnsweredCount}) {
  if (selectedIndex === currentQuestion.correct) {
    setAnsweredCount(prevAnsweredCount => prevAnsweredCount + 1)
  } else {
    setAnsweredCount(prevAnsweredCount)
  }
}

function check2({currentQuestion, prevAnsweredCount, selectedIndexes, setAnsweredCount}) {
  if (selectedIndexes.includes(currentQuestion.correct)) {
    setAnsweredCount(prevAnsweredCount => prevAnsweredCount + 1)
  } else {
    setAnsweredCount(prevAnsweredCount)
  }
}


function Question1Screen({route, navigation}) {
  const { questions, currentQuestionIndex, answeredCount } = route.params
  let currentQuestion = questions[currentQuestionIndex]
  const [selectedIndex, setSelectedIndex] = useState()
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      navigation.push(QUESTION2_SCREEN, {questions, 
        currentQuestionIndex: currentQuestionIndex + 1, 
        selectedIndex, answeredCount, selectedIndex})
    } else {
      check({currentQuestion, prevAnsweredCount: answeredCount, selectedIndex})
    }    
  }
  console.log("one " + answeredCount)
     return (
    <SafeAreaView>
      <View>
        <Text style={styles.heading}>Quiz</Text>
        <Text style={styles.subheading}>{currentQuestion.prompt}</Text>
        <ButtonGroup buttons={currentQuestion.choices}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            setSelectedIndex(value)
          }}
          containerStyle={{ marginBottom: 20 }}
          vertical>
        </ButtonGroup>
        <Button title="Next Question" testID="next-question" style={styles.button} onPress={handleNextQuestion}></Button>
      </View>
    </SafeAreaView>
  ) 
}

function Question2Screen({route, navigation}) {
  const { questions, currentQuestionIndex, answeredCount } = route.params
  let currentQuestion = questions[currentQuestionIndex]
  const [selectedIndexes, setSelectedIndexes] = useState([])
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      navigation.push(QUESTION3_SCREEN, {questions, 
        currentQuestionIndex: currentQuestionIndex + 1, 
        selectedIndexes, answeredCount})
    } else {
      check2({currentQuestion, prevAnsweredCount: answeredCount, selectedIndexes})
    }    
  }
  console.log("two " + answeredCount)
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.heading}>Quiz</Text>
        <Text style={styles.subheading}>{currentQuestion.prompt}</Text>
        <ButtonGroup buttons={currentQuestion.choices}
          selectMultiple
          selectedIndexes={selectedIndexes}
          onPress={(value) => {
            setSelectedIndexes(value)
          }}
          containerStyle={{ marginBottom: 20 }}>
        </ButtonGroup> 
        <Button title="Next Question" testID="next-question" style={styles.button} onPress={handleNextQuestion}></Button>
      </View>
    </SafeAreaView>
  ) 
}

function Question3Screen({route, navigation}) {
  const { questions, currentQuestionIndex, answeredCount} = route.params
  let currentQuestion = questions[currentQuestionIndex]
  const [selectedIndex, setSelectedIndex] = useState()
  const handleFinish = () => {
    // check({currentQuestion, prevAnsweredCount: answeredCount, selectedIndex})
    navigation.push(SUMMARY_SCREEN, {questions, answeredCount})
  }    
  console.log("three " + answeredCount)
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.heading}>Quiz</Text>
        <Text style={styles.subheading}>{currentQuestion.prompt}</Text>
        <ButtonGroup buttons={currentQuestion.choices}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            setSelectedIndex(value)
          }}
          containerStyle={{ marginBottom: 20 }}>
        </ButtonGroup>  
        <Button title="Finish" style={styles.button} onPress={handleFinish}></Button>
      </View>
    </SafeAreaView>
  ) 
}

function SummaryScreen({route, navigation}) {
  const { questions, answeredCount, prompt, choices } = route.params
  return (
    <View>
      <Text style={styles.heading}>Summary</Text>
      <Text testID="total" style={styles.subheading}>Quiz Score: {answeredCount}/{questions.length}</Text>
      <Text style={styles.summary}>{questions[0].prompt}</Text>
      <Text style={styles.summaryAnd}>{questions[0].choices[0]}</Text>
      <Text style={styles.summaryAnd}>{questions[0].choices[1]}</Text>
      <Text style={styles.summaryAnd}>{questions[0].choices[2]}</Text>
      <Text style={styles.summaryAnd}>{questions[0].choices[3]}</Text>
      <Text style={styles.space}></Text>
      <Text style={styles.summary}>{questions[1].prompt}</Text>
      <Text style={styles.summaryAnd}>{questions[1].choices[0]}</Text>
      <Text style={styles.summaryAnd}>{questions[1].choices[1]}</Text>
      <Text style={styles.summaryAnd}>{questions[1].choices[2]}</Text>
      <Text style={styles.summaryAnd}>{questions[1].choices[3]}</Text>
      <Text style={styles.space}></Text>
      <Text style={styles.summary}>{questions[2].prompt}</Text>
      <Text style={styles.summaryAnd}>{questions[2].choices[0]}</Text>
      <Text style={styles.summaryAnd}>{questions[2].choices[1]}</Text>
      <Button title="Restart" style={styles.button} onPress={() => navigation.push(QUESTION1_SCREEN, {questions})}></Button>
    </View>
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
    marginBottom : 10
  },
  space: {
    height: 10
  },
  heading: {
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20
  },
  subheading: {
    fontSize: 25,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20
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
  }
})