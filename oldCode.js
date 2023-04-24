// used lab9 as a base
// question one reference - https://colorcodedlyrics.com/2022/12/30/ateez-halazia/
// question two refercne - https://colorcodedlyrics.com/2021/12/09/xdinary-heroes-egseudineoli-hieolojeu-happy-death-day/
// question three reference  - https://colorcodedlyrics.com/2021/12/23/stray-kids-broken-compass-gojangnan-nachimban/

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import { Button, Input, Text, ButtonGroup } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import * as Font from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';

async function cacheFonts(fonts) {
  return fonts.map(async (font) => await Font.loadAsync(font))
}
const Stack = createNativeStackNavigator()

const questions = [
  {
    "prompt": "Q1: Select the best answer: Who are you?",
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
    "prompt": "Q2: Fill in the blank: Happy ______ day",
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
]

function Question({navigation, route}) {
  console.log(route.params)
  const { questionNumber, userChoices, data } = route.params
  let { choices, prompt, type } = data[questionNumber]
  let [selectedIndex, setSelectedIndex] = useState(0)
  let [selectedIndexes, setSelectedIndexes] = useState([])
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
      })
    } else {
      navigation.navigate('SummaryScreen', {
        questionNumber: nextQuestion,
        questions,
        userChoices,
      })
    }
  }
  return (
  <View style={styles.container}>
    <Text>{prompt}</Text>
    {type !== 'multiple-anser' ? (
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
        selectedIndex={selectedIndexes}
        onPress={(value) => {
          setSelectedIndexes(value)
        }}
        containerStyle={{marginBottom: 20, width: '70'}}
      />
    )}
    <Button 
      testId="next-question"
      onPress={nextQuestion}
      title="Submit"
    ></Button>
  </View>
  )
}

function SummaryScreen({route}) {
  let calculateCorrect = (userSelected, correct, type) => {
    let userCorrect = false 
    if (type == 'multiple-answer') {
      userCorrect = userSelected.sort().toString() === correct.sort().toString()
      userCorrect = userSelected == correct 
    }
    return userCorrect
  }
  let calculateCorrectSet = (userSelected, correct, type) => {
    let userCorrect = false 
    if (type == 'multiple-answer') {
      userCorrect = correct.every((item) => userSelected.includes(item)) &&
      userSelected.every((item) => correct.includes(item))
    } else {
      userCorrect = userSelected == correct 
    }
    return userCorrect
  }
  let totalScore = 0
  for (let i = 0; i < route.params.data.length; i++) {
    if (calculateCorrect(
      route.params.userChoices[i],
      route.params.data[i].correct,
      route.params.data[i].type
      )
    ) {
      totalScore++
    }
  }
return (
  <View style={styles.container}>
    <FlatList
    data={route.params.data}
    renderItem={({item, index}) => {
      let { choices, prompt, type, correct } = item
      let userSelected = route.params.userChoices[index]
      let userCorrect = calculateCorrect(userSelected, correct, type)
      return (
        <View key={index}>
          <Text>{prompt}</Text>
          {choices.map((value, choiceIndex) => {
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
                  : 'gray'
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
          })}
        </View>
        )
      }}
    ></FlatList>
    <Text>Score: {totalScore}</Text>
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
            userChoices: [3, [1, 3], 0],
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






















// used lab9 as a base
// question one reference - https://colorcodedlyrics.com/2022/12/30/ateez-halazia/
// question two refercne - https://colorcodedlyrics.com/2021/12/09/xdinary-heroes-egseudineoli-hieolojeu-happy-death-day/
// question three reference  - https://colorcodedlyrics.com/2021/12/23/stray-kids-broken-compass-gojangnan-nachimban/

import { StyleSheet, View, FlatList } from 'react-native';
import { Button, Input, Text, ButtonGroup } from '@rneui/themed';
import { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';

async function cacheFonts(fonts) {
  return fonts.map(async (font) => await Font.loadAsync(font))
}

const Stack = createNativeStackNavigator()

const QUESTION1_SCREEN = "Question1"
const QUESTION2_SCREEN = "Question2"
const QUESTION3_SCREEN = "Question3"
const SUMMARY_SCREEN = "Summary"

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

export default function App() {
  cacheFonts([FontAwesome.font])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
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
            answeredCount: answeredCount, selectedAnswer: [3, [1, 3], 0]}} options={{headerShown: false}}></Stack.Screen>
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
  const { questions, currentQuestionIndex, answeredCount, selectedAnswer } = route.params
  let currentQuestion = questions[currentQuestionIndex]
  const [selectedIndex, setSelectedIndex] = useState(0)
  const handleNextQuestion = ({type}) => {
    let nextQuestion = currentQuestionIndex + 1
    if ( type !== 'multiple-answer') {
      selectedAnswer.push(selectedIndex)
    }
    if (nextQuestion < questions.length) {
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
  const handleNextQuestion = ({type}) => {
    let nextQuestion = currentQuestionIndex + 1
    if ( type == 'multiple-answer') {
      selectedAnswer.push(selectedIndexes)
    }
    if (nextQuestion < questions.length) {
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
  const { questions, currentQuestionIndex, answeredCount, selectedAnswer} = route.params
  let currentQuestion = questions[currentQuestionIndex]
  const [selectedIndex, setSelectedIndex] = useState(0)
  const handleFinish = ({type}) => {
    let nextQuestion = currentQuestionIndex + 1
    if ( type !== 'multiple-answer') {
      selectedAnswer.push(selectedIndex)
    }
    if (nextQuestion < questions.length) {
      navigation.push(SUMMARY_SCREEN, {questions, answeredCount, selectedAnswer})
    }
    
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
  const { questions, answeredCount, selectedAnswer } = route.params
  let calculateCorrect = (userAnswer, correct, type) => {
    let userCorrect = false 
    if (type == 'multiple-answer') {
      userCorrect = userAnswer.sort().toString() === correct.sort().toString()
      userCorrect = userAnswer == correct 
    }
    return userCorrect
  }
  let calculateCorrectSet = (userAnswer, correct, type) => {
    let userCorrect = false 
    if (type == 'multiple-answer') {
      userCorrect = correct.every((item) => userAnswer.includes(item)) &&
      userAnswer.every((item) => correct.includes(item))
    } else {
      userCorrect = userAnswer == correct 
    }
    return userAnswer
  }
  let totalScore = 0
  for (let i = 0; i < route.params.data.length; i++) {
    if (calculateCorrect(
      route.params.selectedAnswer[i],
      route.params.data[i].correct,
      route.params.data[i].type
      )
    ) {
      totalScore++
    }
  }
  return (
    <View style={styles.container}>
    <FlatList
    data={route.params.data}
    renderItem={({item, index}) => {
      let { choices, prompt, type, correct } = item
      let userAnswer = route.params.selectedAnswer[index]
      let userCorrect = calculateCorrect(userAnswer, correct, type)
      return (
        <View key={index}>
          <Text>{prompt}</Text>
          {choices.map((value, choiceIndex) => {
            let incorrect = false
            let userDidSelect = false 
            if (type == 'multiple-answer') {
              userDidSelect = userAnswer.includes(choiceIndex)
              incorrect = userDidSelect && !correct.includes(choiceIndex)
            } else {
              userDidSelect = userAnswer == choiceIndex
              incorrect = userDidSelect && userAnswer !== correct
            }
            return (
              <CheckBox
              containerStyle={{
                backgroundColor: userDidSelect ? incorrect == false
                  ? 'lightgreen'
                  : 'gray'
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
          })}
        </View>
        )
      }}
    ></FlatList>
    <Text>Score: {totalScore}</Text>
  </View>
  )
}
{/* <View>
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
    </View> */}
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





if (type == 'drop-down') {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{prompt}</Text>
      <SelectDropdown
          data={questions[4].choices}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index)
            setDropDown(true)
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem.choice
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item
          }}
          onPress={(value) => {
            setSelectedIndex(value)
          }}
      />
      <Button 
        testId="next-question"
        onPress={nextQuestion}
        title="Next"
      ></Button>
    </View>
  )
}


<Listbox value={dropDown} onChange={setDropDown}>
          <Listbox.Button style={styles.listbox}>
            {dropDown || "Choose an answer..."}
          </Listbox.Button>    
          <Listbox.Options>
            {questions4.map((choice, index) => (
              <Listbox.Option
                key={index}
                value={choice}
                as={Fragment}
              >
                  <Unorderedlist bulletUnicode={none}>
                    <Text>{choice}</Text>
                  </Unorderedlist>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>