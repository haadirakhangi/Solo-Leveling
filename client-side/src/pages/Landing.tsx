import { Box, Flex, Heading, Text, Button, Image, VStack, HStack, Link } from '@chakra-ui/react';
import { Navbar } from '../components/navbar';

export default function LandingPage() {
  return (
    <Box bg={"purple.200"} minHeight={'100vh'}> {/* Change to minHeight for better responsiveness */}
      <Navbar />
      <VStack spacing={4} align="center" py={5} px={4}> {/* Add padding for smaller screens */}
        <Box textAlign="center" mt={3}>
          {/* <Heading as="h1" size={['2xl', '3xl']} color="white" display="inline">
            Welcome to{' '}
          </Heading> */}
          <Heading as="h1" size={['4xl', '4xl']} style={{ fontFamily: "Jost" }} color="purple.800" display="inline" letterSpacing={20}>
            Solo Leveling
          </Heading>
        </Box>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          flexDirection={['column', 'column', 'row']}
        >
          <Box flex={1} bg={'white'} p={'10'} m={2} borderRadius={20} style={{ boxShadow: "20px 20px 20px rgba(0, 0, 0, 0.5)" }}>
            <Heading as="h2" style={{ "fontFamily": "Rajdhani" }} size={['xl', '2xl']} mb={8} color="purple.600">
              Level Up Your Skills, Unlock Your Future.
            </Heading>
            <Text color="black" className='main-heading' textAlign="justify" size={"10px"}>
              Welcome to Solo Leveling – the ultimate AI-powered platform designed to help you rise from novice to expert in your chosen career path. Whether you're unsure of where to begin or want to refine what you already know, we guide you step by step. Just like the hero who starts from scratch and becomes unstoppable, this platform helps you discover your strengths, sharpen new skills, and unlock better opportunities. Your journey to greatness starts here – ARISE and level up today!
            </Text>
            <HStack spacing={2} mt={5} justifyContent={['center', 'flex-start']}> {/* Center buttons on small screens */}
              <Link href='/login'>
                <Button colorScheme="purple" _hover={{ bg: "purple.800", transform: 'scale(1.05)' }} size="lg" width={['150px', '200px']} variant="solid" mr={5}>
                  Sign In
                </Button>
              </Link>
              <Link href='/register'>
                <Button colorScheme="purple" _hover={{ bg: "purple.800", transform: 'scale(1.05)' }} size="lg" width={['150px', '200px']} variant="solid" mr={5}>
                  Get Started
                </Button>
              </Link>
            </HStack>
          </Box>
          <Box flexShrink={0} mt={[8, 0]}> {/* Add margin on top for smaller screens */}
            <Image
              src="./src/assets/wobg.png"
              alt="Right-aligned image"
              maxWidth={['300px', '400px', '500px']} // Responsive image sizing
              mx={['auto', 0]} // Center image on small screens
            />
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
}
