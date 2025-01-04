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
    useToast
} from '@chakra-ui/react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import { CheckCircleIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Navbar } from '../components/navbar';
import axios from 'axios';
import RecommendedCard from '../components/RecommendedCard';

interface UserData {
    full_name: string;
    age: string;
    gender: string;
    email: string;
    soft_skill_assessment: {
        quiz : {
            summary: string;
            observations: { [key: string]: string };
            recommendations: { [key: string]: string };
        },
        roleplay: {}[];
    };
    technical_assessment: {
        knowledgeScores: { [key: string]: { score: number; maxScore: number } };
        interestScores: { [key: string]: { score: number; maxScore: number } };
    }
}

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

const careerPaths = [
    { year: 1, skillLevel: 20, milestone: 'Started Learning Basics' },
    { year: 2, skillLevel: 40, milestone: 'Completed First Internship' },
    { year: 3, skillLevel: 60, milestone: 'Landed First Job' },
    { year: 4, skillLevel: 80, milestone: 'Promoted to Mid-Level Position' },
    { year: 5, skillLevel: 100, milestone: 'Achieved Expertise' },
];




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



const SkillAssess = ({userData} : {userData: UserData}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedSoftSkillSection, setSelectedSoftSkillSection] = useState('mcq');
    // Transforming hard skills data for bar charts
    const knowledgeData = Object.keys(userData.technical_assessment.knowledgeScores).map((skill) => ({
        name: skill,
        Score: (userData.technical_assessment.knowledgeScores[skill].score / userData.technical_assessment.knowledgeScores[skill].maxScore) * 100,
    }));

    const interestData = Object.keys(userData.technical_assessment.interestScores).map((skill) => ({
        name: skill,
        Score: (userData.technical_assessment.interestScores[skill].score / userData.technical_assessment.interestScores[skill].maxScore) * 100,
    }));


    const onPieEnter = (_:number, index:number) => {
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
                    Scenario-based Quiz Results
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
                    Roleplay Exercise Results
                </Box>
            </HStack>

            {/* Render Selected Section */}
            {selectedSoftSkillSection === 'mcq' ? (
                <Box borderWidth="1px" boxShadow={"dark-lg"} borderRadius="lg" p={4} mb={6} bg="purple.50">
                    <Text mb={4}>
                        <b>Summary:</b> {userData.soft_skill_assessment.quiz.summary}
                    </Text>
                    <Heading size="sm" mb={2} color="purple.600">
                        Observations:
                    </Heading>
                    <VStack align="start" spacing={3}>
                        {Object.entries(userData.soft_skill_assessment.quiz.observations).map(([key, value]) => (
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
                        {Object.entries(userData.soft_skill_assessment.quiz.recommendations).map(([key, value]) => (
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
                        {userData.soft_skill_assessment.roleplay
                            .filter(skill => skill.score !== "None")
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

interface StrengthsAndWeaknesses {
    strengths: string[];
    weaknesses: string[];
    improvementAreas: string[];
}

const UserProfile = ({name, age, gender, email, strengthsAndWeaknesses}: {name: string, age: string, gender: string, email: string, strengthsAndWeaknesses: StrengthsAndWeaknesses}) => (
    <Box>
        <Center>
            <Heading size="xl" mb={4}>
                User Profile
            </Heading>
        </Center>
        <Box borderWidth="1px" borderRadius="lg" p={6} mb={6} boxShadow="lg" mb={20} bg="purple.50">
            <HStack spacing={6} align="center">
                <Avatar name={name} size="xl" />
                <VStack align="start">
                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">{name}</Text>
                    <Text fontSize="md" color="purple.600"><b>Age:</b> {age}</Text>
                    <Text fontSize="md" color="purple.600"><b>Gender:</b> {gender}</Text>
                    <Text fontSize="md" color="purple.600"><b>Email:</b> {email}</Text>
                </VStack>
            </HStack>
        </Box>

        <Heading size="lg" mb={4} mt={8} color="purple.700">
            Performance Insights
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
const Dashboard = () => {
    
    const toast = useToast();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const strengthsAndWeaknesses = {
        strengths: ['Time Management', 'Prioritization', 'Delegation'],
        weaknesses: ['Communication', 'Stress Management', 'Articulation'],
        improvementAreas: ['Confidence Building', 'Presentation Skills', 'Risk Assessment'],
    };

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/student/user-dashboard', { withCredentials: true });
                setUserData(response.data);
                setLoading(false);
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
        fetchUserData();
    }, [toast]);

    if (loading) {
        return <Center><Text>Loading...</Text></Center>;
    }

    if (error) {
        return <Center><Text>{error}</Text></Center>;
    }

    return (
        <ChakraProvider theme={purpleTheme}>
            <Navbar />
            <Box mx="auto" p={4}>
                <Tabs isFitted variant="enclosed">
                    <TabList mb="1em">
                        <Tab _selected={{ bgColor: 'purple.500', color: 'white' }}>User Profile</Tab>
                        <Tab _selected={{ bgColor: 'purple.500', color: 'white' }}>Skill Assessments</Tab>
                        <Tab _selected={{ bgColor: 'purple.500', color: 'white' }}>Recommended Courses</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {userData && (
                                <UserProfile name={userData.full_name} age={userData.age} gender={userData.gender} email={userData.email} strengthsAndWeaknesses={strengthsAndWeaknesses} />
                            )}
                        </TabPanel>
                        <TabPanel>
                            {userData && <SkillAssess userData={userData} />}
                        </TabPanel>
                        <TabPanel>
                            <RecommendCourses />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </ChakraProvider>
    );
};

export default Dashboard;
