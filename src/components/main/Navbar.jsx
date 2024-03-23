import {Flex, Heading, Text, Button, Image, Box} from '@chakra-ui/react';
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import {Link} from "next/link";
import { useEffect, useState, useRef } from 'react';
import { useContext } from 'react';
import UserContext from '@/contexts/UserContext';
import { useRouter } from 'next/router';
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';
import ProfileSection from "@/components/main/ProfileSection.jsx";
import DropdownCard from '@/components/sub/DropdownCard';
import MobileDropdownList from '@/components/sub/MobileDropdownList';
import dropdownNavigation from '@/helpers/navbar_dropdown_navigation';

export default function Navbar(){

    const {user, setUser} = useContext(UserContext);

    const {colorMode, toggleColorMode} = useColorMode();
    const router = useRouter();
    const {light, dark} = colorScheme;
    const {maxContentWidth, mobileBreakPoint} = responsiveConfig;
    

    const [width, setWidth] = useState();
    const [dropdowns, setDropdowns] = useState(dropdownNavigation);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileDropdown, setShowMobileDropdown] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const dropdown = useRef([]);
    const button = useRef([]);
    const mobileDropdown = useRef(null);
    const dropdownOpenButton = useRef(null);
    const profileDropdownRef = useRef(null);
    const profileDropdownTogglerRef = useRef(null);    
    const premiumButtonRef = useRef(null);

    const primaryColor = useColorModeValue(light.primary, dark.primary);
    const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
    const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
    const secondaryColor = useColorModeValue(light.secondary, dark.secondary);
    const secondaryHover = useColorModeValue(light.secondaryHover, dark.secondaryHover);        

    const updateDimension = () => {
        if (typeof window !== "undefined"){
            setWidth(window.innerWidth);
        }
        if (width == mobileBreakPoint) {
            const defaultSetup = dropdowns.map(component => {
                return {...component, open : false}
            });
            setDropdowns(defaultSetup);
        }        
    }

    const closeDropdown = (event) => {
        if (button.current.includes(event.target) || dropdown.current.includes(event.target) || width <= mobileBreakPoint){
            return;
        }      
        setShowDropdown(false); 
    }

    const profileDropdownToggler = (e) => { 
        if (user.is_premium){
            setProfileDropdown(!profileDropdown);            
            return;
        }
        if (premiumButtonRef && premiumButtonRef.current && !premiumButtonRef.current.contains(e.target))
        setProfileDropdown(!profileDropdown);
    }

    const toggleDropdown = (nav) => {
        if (width <= mobileBreakPoint) return;
        setShowDropdown(true);        
        const newDropdownState = dropdowns.map(component => {
            if (component.title == nav.title) return {...component, open : true}
            else return {...component, open : false}
        });
        setDropdowns(newDropdownState);       
    }

    const toggleMobileDropdownCard = (nav) => {
        setShowMobileDropdown(true);        
        const newDropdownState = dropdowns.map(component => {
            if (component.title == nav.title) return {...component, open : true}
            else return {...component, open : false}
        });
        setDropdowns(newDropdownState);       
    }

    const toggleMobileDropdown = (e) => {
        setShowMobileDropdown(true);
    }

    const closeMobileDropdown = (event) => {
        if (mobileDropdown && mobileDropdown.current && !mobileDropdown.current.contains(event.target) &&
        dropdownOpenButton && dropdownOpenButton.current && !dropdownOpenButton.current.contains(event.target)
           ){
            setShowMobileDropdown(false);
        }
    }

    const closeProfileDropdown = (event) => {
        if (profileDropdownRef && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target) &&
            profileDropdownTogglerRef && profileDropdownTogglerRef.current && !profileDropdownTogglerRef.current.contains(event.target)
            ){
            setProfileDropdown(false);
        }
    }

    useEffect(() => {
        updateDimension();

        window.addEventListener("resize", updateDimension);
        window.addEventListener("click", closeDropdown);
        window.addEventListener("click", closeMobileDropdown);        
        window.addEventListener("click", closeProfileDropdown);
        return () => {
            window.removeEventListener("resize", updateDimension);          
            window.removeEventListener("click", closeDropdown);
            window.removeEventListener("click", closeMobileDropdown);               
            window.removeEventListener("click", closeProfileDropdown);
        }
    }, []);

    useEffect(() => {
        button.current = button.current.slice(0, dropdowns.length);
        dropdown.current = dropdown.current.slice(0, dropdowns.length);
    }, [dropdowns]);

    return (
        <Flex w="100%" 
              justifyContent='center' 
              bg={primaryColor}
              borderTop={`2px solid ${secondaryColor}`}
              sx={{boxShadow : `0 0 4px 1px ${secondaryColor}`}}>
            <Flex w="100%" 
                h="3rem" 
                maxWidth={maxContentWidth}
                px={{lg : '6rem', md : '1rem'}} // md (768) move to dropdown
                justifyContent='space-between'>
                <Flex alignItems='center'>
                    {
                        width > mobileBreakPoint 
                            ? (<>
                                <Image mr="2rem" w="auto" h="90%" src="/logo/logo.png"></Image>      

                                {
                                    dropdowns.map((nav, index) => { // element disini nge reference ke button , diassignnya langsung , gk kayak setState
                                        return <Button 
                                                    ref={element => button.current[index] = element} 
                                                    key={nav.id} 
                                                    variant='navbarCategory' 
                                                    position='relative'
                                                    borderBottom={(nav.open && showDropdown) && `2px solid ${secondaryColor}`}     
                                                    color={(nav.open && showDropdown) && secondaryColor}          
                                                    onClick={() => toggleDropdown(nav)}>
                                            {nav.title}
                                            {(nav.open && showDropdown) && <DropdownCard key={nav.id} dropdownRef={element => dropdown.current[index] = element} nav={nav}/>}
                                        </Button>                                           
                                    })
                                }                                        
                        
                      
                            </>)
                            : (<>
                                <Button ref={dropdownOpenButton} onClick={toggleMobileDropdown} h="100%" w="3.5rem" borderRadius='none' display='flex' flexDirection='column' gap=".3rem" position="relative">
                                    <Box bg={secondaryColor} w="40%" h=".15rem" borderRadius="5px"></Box>
                                    <Box bg={secondaryColor} w="40%" h=".15rem" borderRadius="5px"></Box>
                                    <Box bg={secondaryColor} w="40%" h=".15rem" borderRadius="5px"></Box>                                                                        
                                    {showMobileDropdown && <MobileDropdownList toggleMobileDropdownCard={toggleMobileDropdownCard} navs={dropdowns} dropdownRef={mobileDropdown}/>}
                                </Button>
                                {width > 300 && <Image mr="2rem" w="auto" h="90%" src="/logo/logo.png"></Image>}   
                            </>)
                    }
 
                </Flex>
                <Flex alignItems='center' gap={width > 336 ? '1.5rem' : '.5rem'} mr={{sm : '1rem', ssm : '0.2rem'}}>
                    {user
                        ? 
                            <ProfileSection 
                                handler={() => router.push('/premium')}
                                premiumRef={premiumButtonRef} 
                                togglerRef={profileDropdownTogglerRef} 
                                elementRef={profileDropdownRef} 
                                width={width} 
                                dropdownToggle={profileDropdownToggler}
                                profileDropdown={profileDropdown}
                            />
                        :
                            <>
                            <Button onClick={() => router.push('/login')} variant="navbarAuthButton" bg={primaryShaderColor} _hover={{backgroundColor : primaryHover}} fontSize="sm" w={width > 446 ? null : '3.6rem'}>Log In</Button>
                            <Button onClick={() => router.push('/register')} variant="navbarAuthButton" bg={secondaryColor} color='white' _hover={{backgroundColor : secondaryHover}} fontSize="sm" w={width > 446 ? null : '3.6rem'}>Sign Up</Button>
                            </>                        
                    }
   
                </Flex>
            </Flex>
        </Flex>        
    )
}