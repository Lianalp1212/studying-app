// used lab9 as a base
// question one reference - https://colorcodedlyrics.com/2022/12/30/ateez-halazia/
// question two refercne - https://colorcodedlyrics.com/2021/12/09/xdinary-heroes-egseudineoli-hieolojeu-happy-death-day/
// question three reference  - https://colorcodedlyrics.com/2021/12/23/stray-kids-broken-compass-gojangnan-nachimban/

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import { Button, CheckBox, Input, Text, ButtonGroup } from '@rneui/themed';
import * as Font from 'expo-font';
import { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Unorderedlist from 'react-native-unordered-list';

const Stack = createNativeStackNavigator()

async function cacheFonts(fonts) {
  return fonts.map(async (font) => await Font.loadAsync(font))
}

const QUESTIONS_SCREEN = "Questions"
const SUMMARY_SCREEN = "Summary"

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
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
        Sail across the world, this is our time\n
        Stray Kids, STAY or none, we're gonna cross the finish line\n
        No stopping time when all we see are goals in our sights\n
        No turning back, push forward, rise above the light`,
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
        <Stack.Navigator initialRouteName={QUESTIONS_SCREEN}>
          <Stack.Screen name="Questions" component={QuestionsScreen} initialParams={{questions: questions, currentQuestionIndex: currentQuestionIndex}}></Stack.Screen>
          <Stack.Screen name="Summary" component={SummaryScreen} initialParams={{questions: questions, currentQuestionIndex: currentQuestionIndex}}></Stack.Screen>
        </Stack.Navigator>
    }</NavigationContainer>
  );
}

function QuestionsScreen({route}) {
  const { questions, currentQuestionIndex,  } = route.params
  let currentQuestion = questions[currentQuestionIndex]
  const [selectChoice, setSelectChoice] = useState(0)
  const [selectedChoices, setSelectedChoices] = useState([0, 1, 2, 3])
  
  const handleSelectChoice = (value) => {
    setSelectChoice(value)
  }
  const handleSelectedChoices = (value) => {
    setSelectedChoices(value)
  }

  const handleNextQuestion = () => {
    setSelectChoice((prevSelectChoice) => [
      ...prevSelectChoice,
      selectChoice
    ])
    setSelectChoice(null)
    if (currentQuestionIndex + 1 < questions.length) {
      navigation.push(QUESTIONS_SCREEN, {questions, currentQuestionIndex: currentQuestionIndex + 1})
    } else {
      navigation.push(SUMMARY_SCREEN, { questions, selectedChoices })
    }
  }
  
  let renderQuestion = ({item, index}) => {
    if (index !== currentQuestionIndex) {
      return null
    }
    <View key={index}>
     <Text style={styles.heading}>{item.prompt}</Text>
      <ButtonGroup buttons={item.choices}
        selectChoice={selectChoice}
        onPress={(value) => {
          setSelectChoice(value)
        }}
        containerStyle={{ marginBottom: 20 }}>
      </ButtonGroup>
     <Button title="Next Question" testID="next-question" style={styles.button}
      ></Button>
    </View>
  }
     return (
    <SafeAreaView>
      <View>
        <Text style={styles.heading}>{currentQuestion.prompt}</Text>
          <FlatList data={questions}
            renderItem={renderQuestion}
            indexExtractor={(index) => index.toString()}>
          </FlatList>
      </View>
    </SafeAreaView>
  ) 
}

function SummaryScreen({navigation, route, exerciseList}) {
    let [count, setCount] = useState(0)
    let currentExercise = route.params
    console.log(route.params.exerciseList)
    let relatedExercise = exerciseList.find(ex => ex.name === currentExercise.related)
    let navRelatedExercise = useCallback(() => {
      navigation.push(relatedExercise.type === DURATION_EXERCISE ? DURATION_EXERCISE : REPITITION_EXERCISE, {exerciseKey: route.params.key, name: route.params.name})
    }, [relatedExercise])
    return <View>
      <Text style={styles.heading}>{route.params.name}</Text>
      <Text style={{fontSize: "3em", textAlign: 'center', padding: 10}}>{count}</Text>
      <Button title="Add" style={styles.exerciseButton} onPress={()=>setCount(count=>count+1)}></Button>
      <Button title="Reset" style={styles.exerciseButton} onPress={()=>setCount(0)}></Button>
      <Button title="Home" style={styles.exerciseButton} onPress={() => navigation.goBack()}></Button>
      <Text>Related Exercise:</Text>
      <Button title={relatedExercise.name} style={styles.button}
      onPress={navRelatedExercise} />
    </View>
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
  }
})






// used lab9 as a base
// question one reference - https://colorcodedlyrics.com/2022/12/30/ateez-halazia/
// question two refercne - https://colorcodedlyrics.com/2021/12/09/xdinary-heroes-egseudineoli-hieolojeu-happy-death-day/
// question three reference  - https://colorcodedlyrics.com/2021/12/23/stray-kids-broken-compass-gojangnan-nachimban/

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import { Button, CheckBox, Input, Text, ButtonGroup } from '@rneui/themed';
import * as Font from 'expo-font';
import { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Unorderedlist from 'react-native-unordered-list';

const Stack = createNativeStackNavigator()

async function cacheFonts(fonts) {
  return fonts.map(async (font) => await Font.loadAsync(font))
}

const QUESTIONS_SCREEN = "Questions"
const SUMMARY_SCREEN = "Summary"

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
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
        Sail across the world, this is our time\n
        Stray Kids, STAY or none, we're gonna cross the finish line\n
        No stopping time when all we see are goals in our sights\n
        No turning back, push forward, rise above the light`,
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
        <Stack.Navigator initialRouteName={QUESTIONS_SCREEN}>
          <Stack.Screen name="Questions" component={QuestionsScreen} initialParams={{questions: questions, currentQuestionIndex: currentQuestionIndex, setCurrentQuestionIndex: setCurrentQuestionIndex}}></Stack.Screen>
          <Stack.Screen name="Summary" component={SummaryScreen} initialParams={{questions: questions, currentQuestionIndex: currentQuestionIndex, setCurrentQuestionIndex: setCurrentQuestionIndex}}></Stack.Screen>
        </Stack.Navigator>
    }</NavigationContainer>
  );
}

function questionOneThree() {
  const { questions, currentQuestionIndex, setCurrentQuestionIndex } = route.params
  let currentQuestion = questions[currentQuestionIndex]
  const [selectChoice, setSelectChoice] = useState(0)
  return (
    <View>
     <Text style={styles.subheading}>{currentQuestion.prompt}</Text>
      <ButtonGroup buttons={currentQuestion.choices}
        selectChoice={selectChoice}
        onPress={(value) => {
            setSelectChoice(value)
          }}
        containerStyle={{ marginBottom: 20 }}>
      </ButtonGroup>
     <Button title="Next Question" testID="next-question" style={styles.button}
      onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}></Button>
    </View>
  )
}

function questionTwo() {
  const { questions, currentQuestionIndex, setCurrentQuestionIndex } = route.params
  let currentQuestion = questions[currentQuestionIndex]
  const [selectedChoices, setSelectedChoices] = useState([0, 1, 2, 3])
  return (
    <View>
     <Text style={styles.subheading}>{currentQuestion.prompt}</Text>
      <ButtonGroup buttons={currentQuestion.choices}
        selectedChoices={selectedChoices}
        onPress={(value) => {
            setSelectedChoices(value)
          }}
        containerStyle={{ marginBottom: 20 }}>
      </ButtonGroup>
     <Button title="Next Question" testID="next-question" style={styles.button}
      onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}></Button>
    </View>
  )
}

function QuestionsScreen({ route }) {
  const { questions, currentQuestionIndex, setCurrentQuestionIndex } = route.params
  let currentQuestion = questions[currentQuestionIndex]
  const [selectChoice, setSelectChoice] = useState(0)
  const [selectedChoices, setSelectedChoices] = useState([0, 1, 2, 3])

  let renderQuestion = ({item, index}) => (
    <View>
     <Text style={styles.subheading}>{item.prompt}</Text>
      <ButtonGroup buttons={item.choices}
        selectChoice={selectChoice || selectedChoices}
        onPress={(value) => {
          if(item.type === "multiple-answer") {
            setSelectedChoices(value)
          } else {
            setSelectChoice(value)
          }}}
        containerStyle={{ marginBottom: 20 }}>
      </ButtonGroup>
     <Button title="Next Question" testID="next-question" style={styles.button}
      onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}></Button>
    </View>
    )
     return (
    <SafeAreaView>
      <View>
        <Text style={styles.heading}>Quiz</Text>
          <FlatList data={questions}
            renderItem={renderQuestion}
            keyExtractor={(exercise) =>exercise.key}>
          </FlatList>
      </View>
    </SafeAreaView>
  ) 
}

function SummaryScreen({navigation, route, exerciseList}) {
    let [count, setCount] = useState(0)
    let currentExercise = route.params
    console.log(route.params.exerciseList)
    let relatedExercise = exerciseList.find(ex => ex.name === currentExercise.related)
    let navRelatedExercise = useCallback(() => {
      navigation.push(relatedExercise.type === DURATION_EXERCISE ? DURATION_EXERCISE : REPITITION_EXERCISE, {exerciseKey: route.params.key, name: route.params.name})
    }, [relatedExercise])
    return <View>
      <Text style={styles.heading}>{route.params.name}</Text>
      <Text style={{fontSize: "3em", textAlign: 'center', padding: 10}}>{count}</Text>
      <Button title="Add" style={styles.exerciseButton} onPress={()=>setCount(count=>count+1)}></Button>
      <Button title="Reset" style={styles.exerciseButton} onPress={()=>setCount(0)}></Button>
      <Button title="Home" style={styles.exerciseButton} onPress={() => navigation.goBack()}></Button>
      <Text>Related Exercise:</Text>
      <Button title={relatedExercise.name} style={styles.button}
      onPress={navRelatedExercise} />
    </View>
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
  }
})

{/* 
    const numCorrectAnswers = questions.reduce((numcorrect, question, index) => {
    const isCorrect = question.correct === route.params.answered[index]
    return isCorrect ? numcorrect + 1 : numcorrect
  }, 0)   
    {questions.map((question, index) => {
        <View key={index}>
          <Text>{questions.prompt}</Text>
          <Text>{questions.choices[route.params.answered[index]]}</Text>
        </View>
      })}
      
*/}