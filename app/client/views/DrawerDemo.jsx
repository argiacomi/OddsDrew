import {
  AppBar,
  Box,
  Divider,
  Drawer,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from '@components';
import React from 'react';
import styled from '@styles';
import EvDash from './EvDash';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transition.create('width', {
    easing: theme.transition.easing.sharp,
    duration: theme.transition.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme) => ({
  transition: theme.transition.create('width', {
    easing: theme.transition.easing.sharp,
    duration: theme.transition.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  minHeight: theme.spacing(8)
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transition.create(['width', 'margin'], {
    easing: theme.transition.easing.sharp,
    duration: theme.transition.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transition.create(['width', 'margin'], {
      easing: theme.transition.easing.sharp,
      duration: theme.transition.duration.enteringScreen
    })
  })
}));

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .Drawer-Paper': openedMixin(theme)
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .Drawer-Paper': closedMixin(theme)
    })
  })
);

function MiniDrawer() {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box css={{ margin: 0, display: 'flex' }}>
      <StyledAppBar position='fixed' open={open}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            css={{
              marginRight: 5,
              ...(open && { display: 'none' })
            }}
            icon='MdMenu'
          />
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer variant='permanent' open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} icon='MdChevronLeft' />
        </DrawerHeader>
        <Divider />
        <List>
          {['Positive EV'].map((text, index) => (
            <ListItem key={text} disablePadding css={{ display: 'block' }}>
              <ListItemButton
                css={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center'
                }}
              >
                <ListItemIcon
                  css={{
                    minWidth: 0,
                    marginRight: open ? 8 : 'none',
                    justifyContent: 'center'
                  }}
                >
                  {index % 2 === 0 ? <Icon icon='MdAutoGraph' /> : <Icon icon='MdMail' />}
                </ListItemIcon>
                <ListItemText
                  primaryTextProps={{ fontWeight: 'bold' }}
                  primary={text}
                  css={{
                    display: open ? 'block' : 'none'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </StyledDrawer>
      <Box component='main' sx={{ flexGrow: 1, mt: 8 }}>
        <EvDash />
      </Box>
    </Box>
  );
}

export default MiniDrawer;
