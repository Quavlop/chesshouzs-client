const dropdownNavigation = [
    {   
        id : 1,
        title : "Play",
        main_icon : '/icons/test.png',
        open : false,
        data : [
            {
                icon : '/icons/test.png',
                description : 'Play Online',
                href : '/play'
            },        
            {
                icon : '/icons/test.png',
                description : 'Play Computer',
                href : '/play/computer'                
            }
        ],
    },
    {
        id : 2,
        title : "Social",
        main_icon : '/icons/test.png',
        open : false,
        data : [
            {
                icon : '/icons/test.png',
                description : 'Friends',
                href : '/'                
            },        
            {
                icon : '/icons/test.png',
                description : 'Clubs',
                href : '/'                     
            },
            {
                icon : '/icons/test.png',
                description : 'Forums',
                href : '/'                     
            }            
        ],
    },
    

]

export default dropdownNavigation;