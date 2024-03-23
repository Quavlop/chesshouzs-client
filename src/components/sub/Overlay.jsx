import Head from 'next/head'
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import styles from '@/styles/Home.module.css'
import { Text, Heading, Container, Flex, Box, Image } from '@chakra-ui/react'
import { useState, useEffect } from 'react'


export default function Overlay(){
    return (
        <Box 
            position='fixed'
            w='100vw'
            h='100vh'
            top='0'
            left='0'
            backgroundColor='black'
            opacity='.8'
            zIndex={10}
        >
        </Box>
    )
}