import React, { Component, Fragment } from 'react'
// import Link from 'react-router-dom/Link'
import Typography from '@material-ui/core/Typography';

// MUI stuff
import Button from '@material-ui/core/Button';
import {
    AppBar,
    Toolbar,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Container
  } from "@material-ui/core";
  import { makeStyles } from "@material-ui/core/styles";
  import { Home } from "@material-ui/icons";

const Link = require("react-router-dom").Link

const useStyles = makeStyles({
    navbarDisplayFlex: {
        display: `flex`,
        justifyContent: `space-between`,
        padding: 0,
        height: "65px",
        alignItems: "center"
    },
    navDisplayFlex: {
      display: `flex`,
      justifyContent: `space-between`
    },
    linkText: {
      textDecoration: `none`,
      textTransform: `uppercase`,
      color: `white`
    },
    Nav: {
        backgroundColor: "#844865",
        height: "65px",
        padding: 0,
    }
  });

// second nav class-based component
const navLinks = [
    { title: `home`, path: `/` },

    { title: `about us`, path: `/about-us` },
    { title: `escape room`, path: `/experience` },
    { title: `create your own`, path: `/create` },
    { title: `contact`, path: `/contact` },
    { title: `faq`, path: `/faq` }
  ];
const Nav = () => {
    const classes = useStyles();
    return (
        <Fragment>
            <AppBar position="relative" className={classes.Nav}>
                <Toolbar>
                    {navLinks.map(({ title, path }) => (
                        <Typography variant="h6" key={path}>
                            <Button color="inherit" component={Link} to={path} ><h4>{title}</h4></Button>
                        </Typography>
                    ))}
                </Toolbar>
            </AppBar>
        </Fragment>
    )
    
}



export default (Nav);