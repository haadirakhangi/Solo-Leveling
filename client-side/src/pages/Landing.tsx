import { Box, Flex, Heading, Text, Button, Image, VStack, HStack, Link } from '@chakra-ui/react';
import { Navbar } from '../components/navbar';
import { FaArrowRightLong } from "react-icons/fa6";

export default function LandingPage() {
  return (
    <Box bg={"white"} minHeight={'100vh'} overflowX="hidden"> {/* Change to minHeight for better responsiveness */}
      <Navbar />
      <VStack spacing={4} align="center" py={5} px={4}> {/* Add padding for smaller screens */}
        <Box textAlign="center" mt={3}>
          {/* <Heading as="h1" size={['2xl', '3xl']} color="white" display="inline">
            Welcome to{' '}
          </Heading> */}
          {/* <Heading as="h1" size={['4xl', '4xl']} style={{ fontFamily: "Jost" }} color="purple.800" display="inline" letterSpacing={20}>
            Solo Leveling
          </Heading> */}
        </Box>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          flexDirection={['column', 'column', 'row']}
        >
          <Box flex={1} bg={'white'} p={'10'} m={2} borderRadius={20}>
            <Heading as="h2" style={{ "fontFamily": "Rajdhani" }} size={['xl', '2xl']} mb={8} color="purple.600">
              Level Up Your Skills, Unlock Your Future.
            </Heading>
            <Text color="black" className='main-heading' textAlign="justify" size={"10px"}>
              Welcome to Solo Leveling – the ultimate AI-powered platform designed to help you rise from novice to expert in your chosen career path. Whether you're unsure of where to begin or want to refine what you already know, we guide you step by step. Just like the hero who starts from scratch and becomes unstoppable, this platform helps you discover your strengths, sharpen new skills, and unlock better opportunities. Your journey to greatness starts here – ARISE and level up today!
            </Text>
            <HStack spacing={2} mt={5} justifyContent={['center', 'flex-start']}> {/* Center buttons on small screens */}
              <Link href='/register'>
                <Button colorScheme="purple" _hover={{ bg: "purple.800", transform: 'scale(1.05)' }} size="lg" width={['150px', '200px']} variant="solid" mr={5}>
                  Get Started <FaArrowRightLong  style={{'margin':'6px'}}/>
                </Button>
              </Link>
            </HStack>
          </Box>
          <Box flexShrink={0} mt={[8, 0]} position="relative" display="flex" justifyContent="center" alignItems="center">
            <Box
              bg="blue.50" // Adjust the color shade as needed
              borderRadius="50%" // Makes the box a circle
              marginLeft={'200px'}
              marginTop={'-210px'}
              width={['700px', '800px', '900px']} // Circle size responsive to match image sizes
              height={['700px', '800px', '900px']} // Same as width for a perfect circle
              display="flex"
              justifyContent="center"
              alignItems="center"
              position="absolute" // Allows layering the circle behind the image
            />
            <Image
              src="./src/assets/women.png"
              alt="Right-aligned image"
              maxWidth={['640px', '650px', '660px']} // Increased size for the image
              position="relative" // Ensures positioning is relative to the parent
              zIndex={1} // Ensure the image appears above the circle
              marginTop={'20px'} // Adjust top margin if needed
            />
            <Image
            src='./src/assets/triangle.png'
            zIndex={1}
            marginTop={'-540px'}
            marginLeft={'-40px'}
            style={{
              animation: `float-0 4s ease-in-out infinite`,
              animationDelay: `${0 * 0.5}s`,
            }}
             />
            <Image
            src='./src/assets/circle.png'
            zIndex={1} 
            style={{
              animation: `float-0 4s ease-in-out infinite`,
              animationDelay: `${0 * 0.5}s`,
            }}
            />
            {/* <Image
            src='./src/assets/square.png'
            zIndex={1}
            marginBottom={'-340px'} 
            style={{
              animation: `float-0 4s ease-in-out infinite`,
              animationDelay: `${0 * 0.5}s`,
            }}/> */}

<style>
    {`
      @keyframes float-0 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes float-1 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      @keyframes float-2 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
    `}
  </style>
           
          </Box>


        </Flex>
      </VStack>
    </Box>
  );
}
