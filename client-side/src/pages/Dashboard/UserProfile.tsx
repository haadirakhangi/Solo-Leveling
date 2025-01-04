import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    List,
    ListItem,
    ListIcon,
    Center,
    Avatar,
} from '@chakra-ui/react';
import { CheckCircleIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

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

interface StrengthsAndWeaknesses {
    strengths: string[];
    weaknesses: string[];
    improvementAreas: string[];
}


export const UserProfile = ({name, age, gender, email, strengthsAndWeaknesses}: {name: string, age: string, gender: string, email: string, strengthsAndWeaknesses: StrengthsAndWeaknesses}) => (
    <Box>
        <Center>
            <Heading size="xl" mb={4}>
                User Profile
            </Heading>
        </Center>
        <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="lg" mb={20} bg="purple.50">
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
                    <Tooltip formatter={(value, _name, _props) => `${value}%`} />
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