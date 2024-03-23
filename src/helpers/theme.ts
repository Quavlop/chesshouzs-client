import { color, extendTheme, ThemeConfig } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools';

const config : ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true,
}

// Color scheme for specific styling
const colorScheme = {
  light : {
      primary : "#F4F4F4",
      primaryShader : "#d1d6e3",
      primaryHover : "#e1e7f5",      
      secondary : "#7B61FF",
      secondaryHover : "#8e78ff",      
      lightSquare : "#E8EDF9",
      darkSquare : "#B7C0D8"
  },
  dark : {
      primary : "#F4F4F4",
      primaryShader : "#d1d6e3",    
      primaryHover : "#e1e7f5",            
      secondary : "#7B61FF",
      secondaryHover : "#8e78ff",  
      lightSquare : "#E8EDF9",
      darkSquare : "#B7C0D8"
  }
}

const responsiveConfig = {
    maxContentWidth : '1536px',
    mobileBreakPoint : 768
}

// global styling for HTML components (body, a, ul, etc...).
const styles = {
  global : props => ({
    body : {
      bg : mode(colorScheme.light.primary, colorScheme.dark.primary)(props),
      fontFamily : 'Arial',
      display : 'flex',
      flexDirection : 'column',
      overflowX : 'hidden'

    },
  }) 
}

const breakpoints = {
  ssm : '200px',
  sm: '320px',
  md: '768px',
  lg: '960px',
  xl: '1200px',
  '2xl': '1536px',
}



const componentStyles = {
  components : {

    Heading : {
      baseStyle: {
        fontSize : '28px'
      },
      sizes: {},
      variants: {},
      defaultProps: {
        size: "",
        variant: "",
      },      
    },

    Text : {
      baseStyle: {
        fontSize : '14px',
        fontWeight : 'light'
      },
      sizes: {},
      variants: {},
      defaultProps: {
        size: "",
        variant: "",
      },     
    },

    Button : {
      baseStyle: {},
      sizes: {},
      variants: {
        navbarCategory : {
          height : '100%',
          borderRadius : 'none',
          width: '4rem',
          _hover : (props) => ({
              borderBottom : `2px solid ${mode(colorScheme.light.secondary, colorScheme.dark.secondary)(props)}`,
              color : mode(colorScheme.light.secondary, colorScheme.dark.secondary)(props)
          })
        },
        navbarAuthButton : {
          height : '70%',
          width : '6rem',
          borderRadius : '3px'
        }
      },
      defaultProps: {
        size: "",
        variant: "",
      },      
    },

    Card : {
      baseStyle: {},
      sizes: {},
      variants: {},
      defaultProps: {
        size: "",
        variant: "",
      },      
    },    
  }
}

const theme = extendTheme({ 
    config, 
    styles,
    ...componentStyles,
    breakpoints
  })



export {theme, colorScheme, responsiveConfig};
