import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Flex, Text, RadioGroup, Radio, VStack, Progress } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

interface Question {
  skill_area: string;
  question: string;
  options: string[];
  answer: string;
}

const QuizPage: React.FC = () => {
  const toast = useToast();

  // State variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [knowledgeQuestions, setKnowledgeQuestions] = useState<Question[]>([]);
  const [interestQuestions, setInterestQuestions] = useState<Question[]>([]);
  const [knowledgeResponses, setKnowledgeResponses] = useState<{ question: string; answer: string }[]>([]);
  const [interestResponses, setInterestResponses] = useState<{ question: string; answer: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [knowledgeScore, setKnowledgeScore] = useState(0);
  const [interestScore, setInterestScore] = useState(0);
  const [quizType, setQuizType] = useState<'knowledge' | 'interest'>('knowledge');
  const [loading, setLoading] = useState(true);

  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const knowledgeResponse = await axios.get('/api/student/knowledge-assessment');
        const interestResponse = await axios.get('/api/student/interest-assessment');
        setKnowledgeQuestions(knowledgeResponse.data.quiz_questions);
        setInterestQuestions(interestResponse.data.quiz_questions);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        toast({
          title: 'Failed to load questions.',
          description: 'Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchQuestions();
  }, [toast]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    if (timeLeft === 0) {
      handleNext("None");
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle option change
  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  // Handle Next Question
  const handleNext = (defaultAnswer: string = selectedOption) => {
    if (!defaultAnswer) {
      toast({
        title: 'Please select an option before proceeding.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (quizType === 'knowledge') {
      const currentQuestion = knowledgeQuestions[currentQuestionIndex];
      setKnowledgeResponses((prev) => [
        ...prev,
        {
          question: currentQuestion.question,
          answer: defaultAnswer,
        },
      ]);
      // Update score based on selected option
      if (defaultAnswer === currentQuestion.answer) {
        setKnowledgeScore(knowledgeScore + 1);
      }
    } else {
      const currentQuestion = interestQuestions[currentQuestionIndex];
      setInterestResponses((prev) => [
        ...prev,
        {
          question: currentQuestion.question,
          answer: defaultAnswer,
        },
      ]);
      // Update score based on selected option
      if (defaultAnswer === currentQuestion.answer) {
        setInterestScore(interestScore + 1);
      }
    }

    setSelectedOption('');
    setTimeLeft(60);

    if (currentQuestionIndex < (quizType === 'knowledge' ? knowledgeQuestions : interestQuestions).length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (quizType === 'knowledge') {
      setQuizType('interest'); // Switch to interest quiz
      setCurrentQuestionIndex(0); // Reset index for interest quiz
    } else {
      handleSubmit(); // Submit after interest quiz
    }
  };

  const handleSubmit = async () => {
    try {
      // Send both scores to the backend
      await axios.post('/api/submit-quiz-scores', {
        knowledgeScore,
        interestScore,
        knowledgeResponses,
        interestResponses,
      });

      toast({
        title: 'Quiz submitted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to submit quiz.',
        description: 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex direction="column" align="center" justify="center" h="100vh" bg="gray.100">
        <Text fontSize="xl" color="purple.700">
          Loading questions...
        </Text>
        <Progress size="sm" isIndeterminate colorScheme="purple" w="100%" />
      </Flex>
    );
  }

  const currentQuestion =
    quizType === 'knowledge'
      ? knowledgeQuestions[currentQuestionIndex]
      : interestQuestions[currentQuestionIndex];

  return (
    <Flex direction="column" align="center" justify="center" position="relative" h="100vh" bg="gray.100">
      <Text fontSize="xl" fontWeight="bold" color="purple.700" position="absolute" top="20px">
        Time Left: {timeLeft}s
      </Text>
      <Box w="85%" mx="auto" mt="50px" p="6" boxShadow="lg" bg="white" borderRadius="md">
        <Progress value={(timeLeft / 60) * 100} colorScheme="purple" size="sm" borderRadius="md" mb="4" />

        <Text fontSize="2xl" fontWeight="bold" mb="4" color="purple.700">
          {quizType === 'knowledge' ? 'Knowledge Quiz' : 'Interest Quiz'}
        </Text>

        <Text fontSize="lg" mb="2" color="purple.600">
          <strong>{currentQuestionIndex + 1}.</strong> {currentQuestion.question}
        </Text>

        <RadioGroup onChange={handleOptionChange} value={selectedOption}>
          <VStack spacing={4} align="start">
            {currentQuestion.options.map((option, index) => (
              <Radio key={index} value={option} colorScheme="purple">
                {`${index + 1}. ${option}`}
              </Radio>
            ))}
          </VStack>
        </RadioGroup>

        <Box mt="6" textAlign="right">
          <Button colorScheme="purple" onClick={() => handleNext()}>
            {currentQuestionIndex ===
              (quizType === 'knowledge' ? knowledgeQuestions : interestQuestions).length - 1
              ? quizType === 'knowledge'
                ? 'Next Quiz'
                : 'Submit'
              : 'Next'}
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default QuizPage;
