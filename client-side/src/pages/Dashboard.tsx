import React,{useState} from 'react';
import {
    ChakraProvider,
    Box,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    theme,
    extendTheme,
    Heading,
    Text,
    Table,
    Thead,
    Center,
    Tbody,
    Tr,
    Th,
    Td,
    VStack,
    HStack,
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Navbar } from '../components/navbar';

const purpleTheme = extendTheme({
    ...theme,
    colors: {
        ...theme.colors,
        purple: {
            ...theme.colors.purple,
            500: '#805AD5',
        },
    },
});

const userData = {
    hardSkills: {
        knowledgeBased: {
            Javascript: { score: 2, maxScore: 4 },
            Python: { score: 3, maxScore: 4 },
            Java: { score: 1, maxScore: 4 },
            Tensorflow: { score: 1, maxScore: 4 },
            Flask: { score: 0, maxScore: 4 },
        },
        interestBased: {
            Javascript: { score: 2, maxScore: 4 },
            Python: { score: 3, maxScore: 4 },
            Java: { score: 1, maxScore: 4 },
            Tensorflow: { score: 1, maxScore: 4 },
            Flask: { score: 0, maxScore: 4 },
        },
    },
    softSkills: {
        mcqAnalysis: '',
        interviewAnalysis: [
            { Confidence: "The user appears nervous, exhibiting hesitant speech, frequent pauses, and minimal eye contact. This suggests a lack of self-assurance and potentially insufficient preparation for the interview.", score: 3 },
            { BodyLanguage: "Body language is somewhat stiff and constrained. The user shows limited use of hand gestures and minimal movement, which may convey a lack of engagement and confidence.", score: 4 },
            { Communication: "Communication is hampered by frequent filler words ('um', 'uh'), halting speech, and a lack of fluency. The message is understandable but could be significantly improved with better pacing and reduced hesitations.", score: 5 },
            { Articulation: "Articulation is inconsistent. While the user attempts to explain machine learning concepts, his phrasing is often unclear and repetitive, hindering the precision and ease of understanding.", score: 6 },
            { Presentation: "The presentation lacks energy and presence. The user's nervous demeanor and limited engagement detract from the overall impact of his message. A more confident and enthusiastic delivery would significantly improve his presentation skills.", score: 4 },
            { Vocabulary: "Vocabulary is adequate for the topic but lacks sophistication. The user uses simple terms and phrases, which, while understandable, could be enhanced with more precise and nuanced language.", score: 6 },
            { StressManagement: "The user displays visible signs of nervousness, including fidgeting and hesitant speech. This suggests a need for improvement in stress management techniques to handle pressure situations effectively.", score: 4 },
        ],
    },
};

// Transforming hard skills data for bar charts
const knowledgeData = Object.keys(userData.hardSkills.knowledgeBased).map((skill) => ({
    name: skill,
    Score: (userData.hardSkills.knowledgeBased[skill].score / userData.hardSkills.knowledgeBased[skill].maxScore) * 100,
}));

const interestData = Object.keys(userData.hardSkills.interestBased).map((skill) => ({
    name: skill,
    Score: (userData.hardSkills.interestBased[skill].score / userData.hardSkills.interestBased[skill].maxScore) * 100,
}));

const SkillAsses = () => {
    const [selectedSoftSkillSection, setSelectedSoftSkillSection] = useState('mcq');
    const [mcqAnalysis, setMcqAnalysis] = useState({
        summary: "The user demonstrates a mixed profile of soft skills. While showing strengths in delegation and prioritization, there are areas needing improvement in terms of risk assessment and proactive communication.",
        observations: {
            "Problem-Solving": "The user's response to the problem-solving scenario demonstrates a preference for thoroughness and accuracy over speed and efficiency. While ensuring a foolproof solution is commendable, pausing the entire project to gather more information, especially with a tight deadline and significant potential losses, is a high-risk approach. This approach may not always be feasible or optimal in time-sensitive situations. Better responses would involve breaking down the problem, delegating tasks, and prioritizing solutions while acknowledging the risks.",
            "Time Management": "The user's response to the time management scenario highlights a strength in delegation and prioritization. By delegating less critical tasks to trusted team members, the user effectively manages competing priorities and focuses on high-impact activities. This demonstrates an understanding of resource allocation and efficient workflow management."
        },
        recommendations: {
            "Problem-Solving": "Focus on developing strategies that balance thoroughness with speed and efficiency. Practice breaking down complex problems into smaller, manageable tasks. Consider incorporating risk assessment into the problem-solving process to evaluate the potential consequences of different approaches. Improve communication and collaboration skills to leverage the expertise of others and make more informed decisions.",
            "Time Management": "While the user's approach to delegation is effective, further development could include proactive communication with stakeholders to manage expectations and adjust timelines as needed. Explore time management techniques like time blocking and prioritization matrices to enhance efficiency and prevent future conflicts."
        }
    });

    return (
        <Box>
            <Center>
                <Heading size="xl" mb={4}>
                    Skill Assessment
                </Heading>
            </Center>

            {/* Hard Skills */}
            <Heading size="lg" mb={8} color="purple.700">
                Hard Skills Analysis:
            </Heading>

            <HStack spacing={4} align="stretch" mb={20}>
                <Box borderWidth="1px" borderRadius="lg" p={4} flex="1" boxShadow="lg">
                    <Heading size="sm" mb={2} color="purple.600">
                        Knowledge-Based Assessment
                    </Heading>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={knowledgeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="Score" fill="#805AD5" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                <Box borderWidth="1px" borderRadius="lg" p={4} flex="1" boxShadow="lg">
                    <Heading size="sm" mb={2} color="purple.600">
                        Interest-Based Assessment
                    </Heading>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={interestData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="Score" fill="#A0AEC0" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </HStack>

            {/* Soft Skills */}
            <Heading size="lg" mb={8} color="purple.700">
                Soft Skills Analysis:
            </Heading>

            <HStack spacing={4} mb={6}>
                <Box
                    as="button"
                    p={3}
                    borderWidth="1px"
                    borderRadius="lg"
                    bg={selectedSoftSkillSection === 'mcq' ? 'purple.500' : 'gray.200'}
                    color={selectedSoftSkillSection === 'mcq' ? 'white' : 'black'}
                    onClick={() => setSelectedSoftSkillSection('mcq')}
                >
                    MCQ-Based Analysis
                </Box>
                <Box
                    as="button"
                    p={3}
                    borderWidth="1px"
                    borderRadius="lg"
                    bg={selectedSoftSkillSection === 'interview' ? 'purple.500' : 'gray.200'}
                    color={selectedSoftSkillSection === 'interview' ? 'white' : 'black'}
                    onClick={() => setSelectedSoftSkillSection('interview')}
                >
                    Scenario-Based Analysis
                </Box>
            </HStack>

            {/* Render Selected Section */}
            {selectedSoftSkillSection === 'mcq' ? (
                <Box borderWidth="1px" boxShadow={"dark-lg"} borderRadius="lg" p={4} mb={6} bg="purple.50">
                    <Text mb={4}>
                        <b>Summary:</b> {mcqAnalysis.summary}
                    </Text>
                    <Heading size="sm" mb={2} color="purple.600">
                        Observations:
                    </Heading>
                    <VStack align="start" spacing={3}>
                        {Object.entries(mcqAnalysis.observations).map(([key, value]) => (
                            <Box key={key}>
                                <Text>
                                    <b>{key}:</b> {value}
                                </Text>
                            </Box>
                        ))}
                    </VStack>

                    <Heading size="sm" mt={4} mb={2} color="purple.600">
                        Recommendations:
                    </Heading>
                    <VStack align="start" spacing={3}>
                        {Object.entries(mcqAnalysis.recommendations).map(([key, value]) => (
                            <Box key={key}>
                                <Text>
                                    <b>{key}:</b> {value}
                                </Text>
                            </Box>
                        ))}
                    </VStack>
                </Box>
            ) : (
                <Table variant='striped' shadow={"dark-lg"} colorScheme="purple" textAlign="center">
                    <Thead>
                        <Tr>
                            <Th textAlign="center">Skill</Th>
                            <Th textAlign="center">Description</Th>
                            <Th textAlign="center">Score (Out of 10)</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {userData.softSkills.interviewAnalysis
                            .filter(skill => skill.score !== null)
                            .map((skill, index) => (
                                <Tr key={index}>
                                    <Td textAlign="center" width={"200px"}>
                                        <b>{Object.keys(skill)[0].replace(/([a-z])([A-Z])/g, '$1 $2')}</b>
                                    </Td>
                                    <Td>{Object.values(skill)[0]}</Td>
                                    <Td textAlign="center" width={"170px"}>{skill.score}</Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            )}
        </Box>
    );
};

const Dashboard = () => (
    <ChakraProvider theme={purpleTheme}>
        <Navbar />
        <Box mx="auto" p={4}>
            <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                    <Tab _selected={{ bgColor: 'purple.500', color: 'white' }}>Skill Assesments</Tab>
                    <Tab _selected={{ bgColor: 'purple.500', color: 'white' }}>User Profile</Tab>
                    <Tab _selected={{ bgColor: 'purple.500', color: 'white' }}>Recommended Courses</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <SkillAsses />
                    </TabPanel>
                    <TabPanel>
                        <Box>Coming Soon...</Box>
                    </TabPanel>
                    <TabPanel>
                        <Box>Coming Soon...</Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </ChakraProvider>
);

export default Dashboard;
