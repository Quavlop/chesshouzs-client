import { FcGoogle } from 'react-icons/fc';
import { Button, Center, Text } from '@chakra-ui/react';

export default function GoogleButton({onClick}) {
  return (
    <Center w='100%' p={0}>
      <Button
        border={'1px solid #c7c5c5'}
        type='button'
        w={'100%'}
        h='2.5rem'
        maxW={'md'}
        variant={'outline'}
        leftIcon={<FcGoogle />}
        onClick={onClick}
        >
        <Center>
          <Text>Sign in with Google</Text>
        </Center>
      </Button>
    </Center>
  );
}