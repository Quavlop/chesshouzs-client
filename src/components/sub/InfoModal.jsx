import Head from 'next/head';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import styles from '@/styles/Home.module.css';
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode';
import { colorScheme, responsiveConfig } from '@/helpers/theme.ts';
import { Text, Heading, Container, Flex, Box, Image, Button, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export default function InfoModal({ title, message }) {
    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            position="fixed"
            left="0"
            right="0"
            top="0"
            bottom="0"
            margin="auto"
            w="100%"
            h="350px"
            px="1.5rem"
            py="1.5rem"
            maxW="500px"
            textAlign="center"
            bgColor="white"
            zIndex={11}
        >
            <Heading lineHeight="2.2rem" fontSize="1.5rem">
                {title}
            </Heading>

            <Text fontSize="1rem">
                {message}
            </Text>
        </Flex>
    );
}
