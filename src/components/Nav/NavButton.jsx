import React from 'react'
import { Button } from '@mui/material'

const NavButton = React.forwardRef(({ children, ...props }, ref) => {
    return (
        <Button
            ref={ref}
            {...props}
            color="inherit"
            sx={{
                fontSize: '18px',
                color: 'btnDark',
                fontFamily: 'circular-bold'
            }}>{children}</Button>
    )
})


export default NavButton