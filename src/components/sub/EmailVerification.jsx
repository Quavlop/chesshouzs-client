import Head from 'next/head'
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import styles from '@/styles/Home.module.css'
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';
import { Text, Heading, Container, Flex, Box, Image, Button, Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

export default function EmailVerification({resendEmailVerificationLink, emailVerificationResendMessage, resendLoading, responseType}){
  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL } = publicRuntimeConfig;    

  const {light, dark} = colorScheme;  

  const primaryColor = useColorModeValue(light.primary, dark.primary);
  const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
  const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
  const secondaryColor = useColorModeValue(light.secondary, dark.secondary);
  const secondaryHover = useColorModeValue(light.secondaryHover, dark.secondaryHover)  

  const [triggerNotificationBox, setTriggerNotificationBox] = useState(false);

  useEffect(() => {
    setTriggerNotificationBox(true);
  }, [resendLoading]);

  return (
    <Flex
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        position='fixed'
        left='0'
        right='0'
        top='0'
        bottom='0'
        margin='auto'
        w='100%'
        h='350px'
        px='1.5rem'
        py='1.5rem'
        maxW='500px'
        textAlign={'center'}
        bgColor={'white'}
        zIndex={11}
    >

        {triggerNotificationBox && 
          <Box
            bgColor={!resendLoading && (responseType === 200 ? '#b8f0c5' : (responseType === 401 ? '#ffccd1' : 'none'))}
            border={!resendLoading && (responseType === 200 ? '1px solid #28a745' : (responseType === 401 ? '1px solid #dc3545' : 'none'))}            
            color={!resendLoading && (responseType === 200 ? 'green' : (responseType === 401 ? 'red' : 'none'))}              
            h={'auto'}
            py={'1rem'}
            px={'1rem'}

          >
            {resendLoading
              ? <Spinner color={secondaryColor} thickness='4px' speed='0.8s' w={'60px'} h={'60px'} size="xl" /> 
              : <Text>{emailVerificationResendMessage}</Text>        
            }
          </Box>       
        }
 

        <Heading
          lineHeight={'2.2rem'}
          fontSize={'1.5rem'}
        >
          Horay! Your account is created successfully.
        </Heading>
        <Text
          fontSize={'1rem'}
        >
        We've sent you an email verification link. Please check your email to proceed.
        </Text>
        <Button
           bgColor='none' 
           border={!resendLoading ? `1px solid ${secondaryColor}` : '1px solid grey'}
           color={!resendLoading ? secondaryColor : 'grey'}
           onClick={resendEmailVerificationLink}
           h='auto'
           py='1rem'
           px='.4rem'
           width='50%'
           maxW='300px'
           mt='20px'
           _hover={!resendLoading && {
            color : 'white',
            bg : secondaryColor            
           }}
           disabled={resendLoading}
        >
            Resend Verification Link
        </Button>
        
    </Flex>
  )


}