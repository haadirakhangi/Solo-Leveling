import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  Flex,
  Spinner,
  Tabs,
  TabList,
  TabPanel,
  Tab,
  TabPanels,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import { Navbar } from '../../components/navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { keyframes } from "@emotion/react";

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translate(5px, -7px);
  }
  to {
    opacity: 0.9;
    transform: translate(0, 0);
  }
`;
type Lesson = {
  [key: string]: string;
};

type ButtonTextList = string[];

type LessionIds = Number[];

type LabManual = { id: number; markdown_content: string, exp_aim: string, exp_number: string };

const LessonsGrid = () => {
  const [lessons, setLessons] = useState<Lesson>({});
  const [buttonTexts, setButtonTexts] = useState<ButtonTextList>([]);
  const [lessionIds, setLessionIds] = useState<LessionIds>([]);
  const [labIds, setLabIds] = useState<LessionIds>([]);
  const [labManuals, setLabManuals] = useState<LabManual[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [maxHeight, setMaxHeight] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  localStorage.removeItem('lesson_id');
  localStorage.removeItem('lab_manual_id');
  localStorage.removeItem('lesson_name');
  localStorage.removeItem('exp_aim');
  localStorage.removeItem('exp_num');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const course_id = localStorage.getItem('course_id');
        const response = await axios.post('/api/teacher/fetch-lessons', { course_id: course_id });
        const lessonData = response.data.lessons || {};
        const buttonData: ButtonTextList = response.data.lesson_statuses || [];
        const lessonidData: LessionIds = response.data.lesson_ids || [];
        const labidData: LessionIds = response.data.manual_ids || [];
        const labManualData: LabManual[] = response.data.lab_manuals || [];
        setLessons(lessonData);
        setButtonTexts(buttonData);
        setLessionIds(lessonidData);
        setLabManuals(labManualData);
        setLabIds(labidData);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  useEffect(() => {
    if (Object.keys(lessons).length > 0) {
      setLoading(false);
      const heights = cardRefs.current.map((card) => card?.clientHeight || 0);
      setMaxHeight(Math.max(...heights));
    }
  }, [lessons]);

  const handleViewLesson = (buttonText: string, name: string, id: Number) => {
    if (buttonText === "Generate") {
      localStorage.setItem('lesson_name', name);
      navigate('/teacher/create-lesson');
    } else if (buttonText === "View") {
      localStorage.setItem('lesson_id', id.toString());
      navigate('/teacher/course');
    }
  };

  const handleViewLabMnaual = (id: string) => {
    localStorage.setItem('lab_manual_id', id);
    navigate('/teacher/lab-manual');
  };

  const handleCreateLabManual = () => {
    navigate('/teacher/lab-manual-create');
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="90vh">
        <Spinner size="xl" color="purple.500" />
        <Heading ml={4}>Fetching Lessons...</Heading>
      </Flex>
    );
  }

  return (
    <div>
      <Navbar />
      <Tabs mt={3} isFitted variant="enclosed" colorScheme="purple">
        <TabList>
          <Tab _selected={{ bg: "purple.500", color: "white" }} >Lessons</Tab>
          <Tab _selected={{ bg: "purple.500", color: "white" }}>Lab Manuals</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>

            <Box p={5}>
              <Heading textAlign="center" mb={6} color="purple.600">
                Lesson Modules
              </Heading>
              <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
                {Object.entries(lessons).map(([key, description], index) => (
                  <Flex
                    key={key}
                    direction="column"
                    p={5}
                    pt={7}
                    pb={7}
                    maxWidth="350px"
                    borderWidth="1px"
                    borderRadius="lg"
                    bg={useColorModeValue('gray.100', 'gray.700')}
                    color={useColorModeValue('gray.700', 'gray.100')}
                    boxShadow="lg"
                    ref={(el) => (cardRefs.current[index] = el)}
                    minHeight={`${maxHeight}px`}
                    position="relative"
                    _hover={{
                      '.delete-icon': {
                        opacity: 0.95,
                        animation: `${slideIn} 0.6s ease-in-out`,
                      },
                    }}
                  >
                    {/* Delete Icon */}
                    <IconButton
                      aria-label="Delete lesson"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      borderRadius="full"
                      position="absolute"
                      top={2}
                      right={2}
                      opacity={0}
                      className="delete-icon"
                    />

                    <VStack align="start" spacing={3} flex="1">
                      <Text fontWeight="bold" fontSize="lg" color="purple.500">
                        {index + 1}. {key}
                      </Text>
                      <Text fontSize="sm" justifyContent={"center"}>
                        {description}
                      </Text>
                    </VStack>
                    <Button
                      size="sm"
                      width="100%"
                      bg={useColorModeValue('purple.600', 'purple.300')}
                      color="white"
                      onClick={() => handleViewLesson(buttonTexts[index], key, lessionIds[index])}
                      _hover={{ bg: 'purple.500' }}
                      mt={3}
                    >
                      {buttonTexts[index]}
                    </Button>
                  </Flex>
                ))}
              </Grid>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Heading textAlign="center" mb={6} color="purple.600">
                Lab Manuals
              </Heading>
              {labManuals.length > 0 ? (
                <Grid templateColumns="repeat(auto-fit, minmax(250px, 0.2fr))" gap={6}>
                  {labManuals.map((manual, index) => (
                    <Flex
                      key={manual.id}
                      direction="column"
                      p={5}
                      maxWidth="350px"
                      borderWidth="1px"
                      borderRadius="lg"
                      minHeight="180px"
                      bg={useColorModeValue('gray.100', 'gray.700')}
                      color={useColorModeValue('gray.700', 'gray.100')}
                      boxShadow="lg"
                    >
                      <VStack align="start" spacing={3} flex="1">
                        <Text fontWeight="bold" fontSize="lg" color="purple.500">
                          {manual.exp_number} : {manual.exp_aim}
                        </Text>
                      </VStack>
                      <Button
                        size="sm"
                        width="100%"
                        bg={useColorModeValue('purple.600', 'purple.300')}
                        color="white"
                        onClick={() => handleViewLabMnaual(labIds[index])}
                        _hover={{ bg: 'purple.500' }}
                        mt={3}
                      >
                        View
                      </Button>
                    </Flex>
                  ))}
                </Grid>
              ) : (
                <Text textAlign="center" color="gray.500">
                  No Lab Manuals available.
                </Text>
              )}
              <Button
                mt={4}
                colorScheme="purple"
                onClick={handleCreateLabManual}
              >
                Create Lab Manual
              </Button>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default LessonsGrid;
