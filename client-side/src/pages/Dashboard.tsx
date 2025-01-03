import React, { useState,useEffect } from 'react';
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
    VStack,
    HStack,
    List,
    ListItem,
    ListIcon,
    Table,
    SlideFade,
    Grid,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Center,
    Avatar,
    Icon,
} from '@chakra-ui/react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import { CheckCircleIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Navbar } from '../components/navbar';
import RecommendedCard from '../components/RecommendedCard';


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

const recommendedCourses = [
    {
        source: "upGrad",
        title: "PG Diploma in Data Science",
        link: "https://www.upgrad.com/data-science-pgd-iiitb/",
    },
    {
        source: "Coursera",
        title: "Generative AI: Elevate Your",
        link: "https://www.coursera.org/learn/generative-ai-elevate-your-data-science-career",
    }
];

const jobRoles = [
    { role: 'Machine Learning Engineer', skills: ['Python', 'Tensorflow', 'Machine Learning'] },
    { role: 'Frontend Developer', skills: ['JavaScript', 'React', 'CSS'] },
    { role: 'Backend Developer', skills: ['Java', 'Flask', 'APIs'] },
];

const jobMarketData = [
    { skill: 'Machine Learning', demand: 85 },
    { skill: 'Python', demand: 90 },
    { skill: 'React', demand: 80 },
    { skill: 'Data Science', demand: 70 },
];

const userInfo = {
    name: 'John Doe',
    age: 30,
    gender: 'Male',
    email: 'johndoe@example.com',
};

const careerPaths = [
    { year: 1, skillLevel: 20, milestone: 'Started Learning Basics' },
    { year: 2, skillLevel: 40, milestone: 'Completed First Internship' },
    { year: 3, skillLevel: 60, milestone: 'Landed First Job' },
    { year: 4, skillLevel: 80, milestone: 'Promoted to Mid-Level Position' },
    { year: 5, skillLevel: 100, milestone: 'Achieved Expertise' },
];

const strengthsAndWeaknesses = {
    strengths: ['Time Management', 'Prioritization', 'Delegation'],
    weaknesses: ['Communication', 'Stress Management', 'Articulation'],
    improvementAreas: ['Confidence Building', 'Presentation Skills', 'Risk Assessment'],
};

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


const renderActiveShape = (props) => {
    const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value,
    } = props;
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Score: ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 20} textAnchor={textAnchor} fill="#999">
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];



const SkillAsses = () => {
    const [activeIndex, setActiveIndex] = useState(0);
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

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };
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
                            <Bar dataKey="Score">
                                {knowledgeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                <Box borderWidth="1px" borderRadius="lg" p={4} flex="1" boxShadow="lg">
                    <Heading size="sm" mb={2} color="purple.600">
                        Interest-Based Assessment
                    </Heading>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={interestData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="Score"
                                onMouseEnter={onPieEnter}
                            >
                                {interestData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
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

const UserProfile = () => (
    <Box>
        <Center>
            <Heading size="xl" mb={4}>
                User Profile
            </Heading>
        </Center>
        <Box borderWidth="1px" borderRadius="lg" p={6} mb={6} boxShadow="lg" mb={20} bg="purple.50">
            <HStack spacing={6} align="center">
                <Avatar name={userInfo.name} size="xl" />
                <VStack align="start">
                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">{userInfo.name}</Text>
                    <Text fontSize="md" color="purple.600"><b>Age:</b> {userInfo.age}</Text>
                    <Text fontSize="md" color="purple.600"><b>Gender:</b> {userInfo.gender}</Text>
                    <Text fontSize="md" color="purple.600"><b>Email:</b> {userInfo.email}</Text>
                </VStack>
            </HStack>
        </Box>

        <Heading size="lg" mb={4} mt={8} color="purple.700">
            Strengths, Weaknesses & Areas for Improvement
        </Heading>
        <HStack align="start" spacing={8} mb={20}>
            <VStack align="start">
                <Heading size="sm" color="purple.600">
                    Strengths
                </Heading>
                <List spacing={2}>
                    {strengthsAndWeaknesses.strengths.map((strength, index) => (
                        <ListItem key={index}>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            {strength}
                        </ListItem>
                    ))}
                </List>
            </VStack>

            <VStack align="start">
                <Heading size="sm" color="purple.600">
                    Weaknesses
                </Heading>
                <List spacing={2}>
                    {strengthsAndWeaknesses.weaknesses.map((weakness, index) => (
                        <ListItem key={index}>
                            <ListIcon as={ArrowRightIcon} color="red.500" />
                            {weakness}
                        </ListItem>
                    ))}
                </List>
            </VStack>

            <VStack align="start">
                <Heading size="sm" color="purple.600">
                    Areas for Improvement
                </Heading>
                <List spacing={2}>
                    {strengthsAndWeaknesses.improvementAreas.map((area, index) => (
                        <ListItem key={index}>
                            <ListIcon as={ArrowRightIcon} color="blue.500" />
                            {area}
                        </ListItem>
                    ))}
                </List>
            </VStack>
        </HStack>

        {/* AI Skill Matcher */}
        <Heading size="lg" mb={5} color="purple.700">
            AI Skill Matcher
        </Heading>
        <VStack align="start" spacing={4} mb={20}>
            {jobRoles.map((role, index) => (
                <Box
                    key={index}
                    borderWidth="1px"
                    borderRadius="lg"
                    p={4}
                    width="100%"
                    bg="purple.50"
                    boxShadow="lg"
                >
                    <Heading size="sm" color="purple.600" mb={2}>
                        {role.role}
                    </Heading>
                    <Text>
                        <b>Skills Matched:</b> {role.skills.join(', ')}
                    </Text>
                </Box>
            ))}
        </VStack>

        {/* Job Market Analysis */}
        <Heading size="lg" mb={5} color="purple.700">
            Job Market Analysis
        </Heading>
        <Box borderWidth="1px" borderRadius="lg" p={4} mb={20} boxShadow="lg" bg="purple.50">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobMarketData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="demand" fill="#805AD5" />
                </BarChart>
            </ResponsiveContainer>
        </Box>

        {/* Career Path Visualization */}
        <Heading size="lg" mb={4} mt={8} color="purple.700">
            Career Path Visualization
        </Heading>
        <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="lg" mb={20} bg="purple.50">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={careerPaths}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <XAxis dataKey="year" label={{ value: "Years", position: "insideBottomRight", offset: -5 }} />
                    <YAxis label={{ value: "Skill Level (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value, name, props) => `${value}%`} />
                    <Line
                        type="monotone"
                        dataKey="skillLevel"
                        stroke="#805AD5"
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                        animationDuration={1500} // Smooth animation for drawing the line
                        isAnimationActive={true} // Enable animation
                    />
                </LineChart>
            </ResponsiveContainer>
            <VStack align="start" spacing={2} mt={4}>
                {careerPaths.map((path, index) => (
                    <Text key={index} color="purple.700">
                        <b>Year {path.year}:</b> {path.milestone}
                    </Text>
                ))}
            </VStack>
        </Box>
    </Box>
);

const RecommendCourses = () => {

    return (
        <>
        <Center><Heading mb={4}>Top Recommendations for You</Heading></Center>
        <Grid templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
          {recommendedCourses.map((course, index) => (
            <SlideFade in={true} transition={{ enter: { duration: 0.7 } }} offsetY='50px' key={index}>
              <RecommendedCard
                source={course.source}
                title={course.title}
                link={course.link}
              />
            </SlideFade>
          ))}
        </Grid>
      </>
    );
};
const Dashboard = () => (
    <ChakraProvider theme={purpleTheme}>
        <Navbar />
        <Box mx="auto" p={4}>
            <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                    <Tab _selected={{ bgColor: 'purple.500', color: 'white' }}>User Profile</Tab>
                    <Tab _selected={{ bgColor: 'purple.500', color: 'white' }}>Skill Assesments</Tab>
                    <Tab _selected={{ bgColor: 'purple.500', color: 'white' }}>Recommended Courses</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>

                        <UserProfile />
                    </TabPanel>
                    <TabPanel>
                        <SkillAsses />
                    </TabPanel>
                    <TabPanel>
                        <RecommendCourses/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </ChakraProvider>
);

export default Dashboard;
