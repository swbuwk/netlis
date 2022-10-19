import React, { useEffect } from 'react'
import { Variants } from 'framer-motion'
import { Box, Button, Center, Heading, HStack, Icon } from '@chakra-ui/react'
import { FaHeadphonesAlt } from '@react-icons/all-files/fa/FaHeadphonesAlt';
import Link from 'next/link';
import { useAppSelector } from '../hooks/redux';
import { useRouter } from 'next/router';
import { ChakraBox } from './_app';

const NAME = "NETLIS"

const index = () => {
    const user = useAppSelector(state => state.user)
    const router = useRouter()

    const headphonesVariants: Variants = {
      hidden: {
        opacity: 0,
        scale: 0.5,
        y: 0,
      },
      visible: {
        y: -200, 
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.25,
          delay: 0.1 * NAME.length + 1.7,
        }
      },
      pulse: {
        scale: [1, 1.1, 1],
        transition: {
          duration: 0.5,
          repeat: Infinity
        }
      }
    }

    const beatsVariants: Variants = {
      hidden: {
        height: 0,
        opacity: 0
      },
      visible: {
        opacity: 1,
        height: 10,
        transition: {
          duration: 0.25,
          delay: 0.1 * NAME.length + 1.7,
        }
      },
      pulse: mult => ({
        height: [10, mult*10 , 10],
        transition: {
          duration: 0.5,
          repeat: Infinity
        }
      })
    }

    const bgVariants: Variants = {
        visible: {
            opacity: 1,
            rotateZ: [0, 0, 60],
            scaleX: [0.1, 0.1, 1],
            scaleY: [0, 1, 1],
            transition: {
                duration: 1,
                delay: 0.1 * NAME.length + 0.8
            }
        },
        hidden: {
            opacity: 0.3,
            rotateZ: 0,
            scaleX: 0,
            scaleY: 0,
        }
    }

    const letterVariants: Variants = {
        visible: i => ({
          y: 0,
          opacity: 1,
          transition: {
            delay: i * 0.1 + 1,
          },
        }),
        hidden: { y: -100, opacity: 0 },
      }

      useEffect(() => {
        if (user.signedIn) router.push("/home")
      }, [user])

  return (
    <Center h="100vh" w="100vw" bgColor="#202838" zIndex={50} overflow="hidden" pos="absolute">
      <ChakraBox
          initial="hidden"
          animate="visible"
          variants={bgVariants}
          custom={-1}
          pos="absolute" bgColor="#1A202C" h="200vw" w="100vh" zIndex={0}
          overflow="hidden"
          display="flex" alignItems="center" justifyContent="center"
          >
      </ChakraBox>
      <Box display="flex" flexDir="column" alignItems="center" justifyContent="center" zIndex={1} pos="relative">
        <ChakraBox
          w={200} h={200}
          pos="absolute"
          variants={headphonesVariants}
          initial="hidden"
          animate={["visible", "pulse"]}
          zIndex={5}
          drag
          dragConstraints={{left: -25, right: 25, top: -225, bottom: -175}}
        >
            <Icon
                as={FaHeadphonesAlt}
                w={200} h={200} color={"#ffa300"}
                pos="absolute"
                />  
        </ChakraBox>
          <HStack spacing={"20px"}>
              {NAME.split("").map((char, i) => (
                  <ChakraBox
                      custom={i}
                      zIndex={i%2 === 1 ? 5 : 4}
                      initial="hidden"
                      animate="visible"
                      variants={letterVariants}
                      >
                        <Heading fontSize={"9xl"} color="white">{char}</Heading>
                  </ChakraBox>
                ))}
          </HStack>
          <ChakraBox pos="absolute"
            initial={{
              y: 0
            }}
            animate={{
              y: 200
            }}
            //@ts-ignore
            transition={{
              duration: 0.25,
              delay: 0.1 * NAME.length + 1.7,
            }}
            >
            <HStack spacing="3px" display="flex" justifyContent="center">
              <ChakraBox pos="absolute" zIndex={10}
                    initial={{
                      y: 0,
                      opacity: 0
                    }}
                    animate={{
                      y: -95,
                      opacity: 1
                    }}
                    //@ts-ignore
                    transition={{
                      duration: 0.25,
                      delay: 0.1 * NAME.length + 1.7,
                    }}
                    >
                <Link href={"/authorization"}>
                    <Button bgColor={"#ffa300"} size="lg">
                      Get started!
                    </Button>
                </Link>
              </ChakraBox>
              {(new Array(30)).fill(0).map(() => 
              <ChakraBox
                initial="hidden"
                animate={["visible", "pulse"]}
                variants={beatsVariants}
                w={3}
                custom={Math.random()*5 + 1}
                borderRadius="6px"
                bgColor={"#ffa300"}
              />
              )}
            </HStack>
          </ChakraBox>
      </Box>
    </Center>
  )
}

export default index