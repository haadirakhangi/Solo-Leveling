import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Flex, Text, RadioGroup, Radio, VStack, Progress } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { questions } from './softskillQuestions';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SoftSkillQuiz: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();

  // State variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [responses, setResponses] = useState<{ question: string; soft_skill: string; answer: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);

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

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

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

    const currentQuestion = questions[currentQuestionIndex];
    setResponses((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        soft_skill: currentQuestion.soft_skill,
        options: currentQuestion.options,
        answer: defaultAnswer,
      },
    ]);
    setSelectedOption('');
    setTimeLeft(60);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/student/submit-soft-skill-quiz', { responses });
      Swal.fire({
        title: 'Congratulations!',
        text: 'Your soft skill assessment has been submitted successfully.',
        icon: 'success',
        confirmButtonText: 'Next',
    }).then((result) =>{
      if (result.isConfirmed){
        navigate('/student/assessment');
      }
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

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Flex direction="column" align="center" justify="center" position="relative" h="100vh" bg="gray.100">
      <Text fontSize="xl" fontWeight="bold" color="purple.700" position="absolute" top="20px">
        Time Left: {timeLeft}s
      </Text>
      <Box w="85%" mx="auto" mt="50px" p="6" boxShadow="lg" bg="white" borderRadius="md">
        <Progress value={(timeLeft / 60) * 100} colorScheme="purple" size="sm" borderRadius="md" mb="4" />

        <Text fontSize="2xl" fontWeight="bold" mb="4" color="purple.700">
          Soft Skill Quiz
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

        <Box mt="6" textAlign="center">
          <Button colorScheme="purple" onClick={() => handleNext()}>
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default SoftSkillQuiz;
