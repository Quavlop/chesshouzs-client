import getConfig from 'next/config';
import { cookies } from "next/headers";
import { useRouter } from 'next/router';
import { useContext } from 'react';
import UserContext from '@/contexts/UserContext';
import { useEffect, useState, useRef } from 'react';
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';
import getCsrfToken from '@/helpers/getCsrfToken';
import { Text, Heading, Box, Card,Flex, Image, Button } from '@chakra-ui/react'
import DropdownCard from "@/components/sub/DropdownCard";

export default function ProfileSection({ width, handler, dropdownToggle, profileDropdown, premiumRef, elementRef, togglerRef }){

    const router = useRouter();    

    const config = getConfig();
    const { publicRuntimeConfig } = config;
    const { API_URL } = publicRuntimeConfig;    
    
    // const cookieStore = cookies();

    const {light, dark} = colorScheme;    

    const {user, setUser} = useContext(UserContext);    

    const [csrfToken, setCsrfToken] = useState('');    

    const primaryColor = useColorModeValue(light.primary, dark.primary);
    const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
    const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
    const secondaryColor = useColorModeValue(light.secondary, dark.secondary);
    const secondaryHover = useColorModeValue(light.secondaryHover, dark.secondaryHover);       

    const navigate = (destination) => {
        router.push(destination);
    }

    const logOut = async () => {
        try {
            const response = await fetch(API_URL + '/auth/logout', {
                method : "POST",
                headers : {
                  'Content-Type' : 'application/json',
                  'X-CSRF-Token' : csrfToken,          
                },
                credentials : 'include',
              })        
    
            const data = await response.json();
    
            if (data.code === 200){
                // if (cookieStore.has("__SESS_TOKEN")){
                //     cookies().set('__SESS_TOKEN', '');
                // }
                setUser(null);
                router.push('/');
            } 

        } catch (err) {}
    }

    const profileDropdownData = [
        {
            icon : '/icons/test.png',
            description : 'Profile',
            href : '/profile', 
            redirect : true, 
            handler : null
        },        
        {
            icon : '/icons/test.png',
            description : 'Log Out',
            href : '/logout', 
            redirect : false,
            handler : () => logOut()
        }        
    ]


    useEffect(() => {
        try {
            const setCSRFToken = async () => {
              const token = await getCsrfToken(API_URL);
              setCsrfToken(token);
            }
            setCSRFToken();
          } catch (err) {
            return;     
          }
    }, []);

    return (
        <>
            <Flex
            w={width > 768 ? '25rem' : "10rem"}
            h='85%'
            alignItems={"center"}
            justifyContent={"center"}
            position='relative'
            gap='1rem'
            ref={togglerRef}
            onClick={dropdownToggle}
            // bg='red'
            >
                
                {
                    !user.is_premium
                    && 
                        <Button 
                            onClick={handler} 
                            ref={premiumRef} 
                            variant="navbarAuthButton" 
                            bg={secondaryColor}
                            color='white'
                            _hover={{backgroundColor : secondaryHover}}
                            fontSize="sm"
                            >
                            Go Premium
                        </Button>                            
                }
        

                <Image
                borderRadius='full'
                boxSize='auto'
                h='2.5rem'
                w='2.5rem'
                src={user.profile_picture ? user.profile_picture : '/images/profile_picture.jpg'}
                border={`.5px solid ${secondaryColor}`}
                />
                {width > 768 && <Text>{user?.username}</Text>}



                {
                    profileDropdown && 
                        <Card 
                            height='auto'
                            width='150px'
                            borderRadius='3px'
                            boxShadow={`0 0 10px 3px ${primaryShaderColor}`}
                            bg={primaryColor} 
                            position='absolute'
                            ref={elementRef}
                            top="50px"
                            left={width > 768 
                                    ? (!user.is_premium ? "25%" : '45%')
                                    : (!user.is_premium ? "-100%" : '-75%')
                            }
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            px='2px'
                            py='2px'
                            zIndex={2}
                            >
                            {
                                profileDropdownData.map((content) => {
                                    return <Flex onClick={content.redirect ? () => navigate(content.href) : content.handler} borderRadius="3px" alignItems='center' _hover={{backgroundColor : primaryHover}} w='100%'>
                                        <Image src={content.icon} h="30px" w="30x" mr="10px"/>                        
                                        <Text>{content.description}</Text>
                                    </Flex>
                                })               
                            }
                        </Card> 
                }
  


            </Flex> 

        </>
    )
}