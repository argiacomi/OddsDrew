import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling, shouldForwardProp } from '@styles';
import { useSlotProps } from '@utils';
import ButtonBase from '../ButtonBase/ButtonBase';

export const fabClasses = {
  root: 'Fab-Root',
  focusVisible: 'FocusVisible',
  disabled: 'Disabled'
};

const FabRoot = styled(ButtonBase, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes',
  name: 'Fab',
  slot: 'Root'
})(
  ({ theme, ownerState }) => ({
    ...theme.text.typography.button,
    minHeight: 36,
    transition: theme.transition.create(['background-color', 'box-shadow', 'border-color'], {
      duration: theme.transition.duration.short
    }),
    borderRadius: '50%',
    padding: 0,
    minWidth: 0,
    width: 56,
    height: 56,
    zIndex: theme.zIndex.fab,
    boxShadow: theme.boxShadow.fab,
    '&:active': {
      boxShadow: theme.boxShadow.fabActive
    },
    color: theme.alpha.contrastText(theme.color.gray[300]),
    backgroundColor: theme.color.gray[300],
    '&:hover': {
      backgroundColor: theme.color.gray[500],
      '@media (hover: none)': {
        backgroundColor: theme.color.gray[300]
      },
      textDecoration: 'none'
    },
    [`&.${fabClasses.focusVisible}`]: {
      boxShadow: theme.boxShadow.fab
    },
    ...(ownerState.size === 'small' && {
      width: 40,
      height: 40
    }),
    ...(ownerState.size === 'medium' && {
      width: 48,
      height: 48
    }),
    ...(ownerState.variant === 'extended' &&
      {
        large: {
          borderRadius: 48 / 2,
          padding: '0 16px',
          width: 'auto',
          minHeight: 'auto',
          minWidth: 48,
          height: 48
        },
        small: {
          width: 'auto',
          padding: '0 8px',
          borderRadius: 34 / 2,
          minWidth: 34,
          height: 34
        },
        medium: {
          width: 'auto',
          padding: '0 16px',
          borderRadius: 40 / 2,
          minWidth: 40,
          height: 40
        }
      }[ownerState.size]),
    ...(ownerState.color === 'inherit' && {
      color: 'inherit'
    })
  }),
  ({ theme, ownerState }) => ({
    ...(ownerState.color !== 'inherit' &&
      ownerState.color !== 'default' &&
      theme.color[ownerState.color] != null && {
        color: theme.color[ownerState.color].text,
        backgroundColor: theme.color[ownerState.color].body,
        '&:hover': {
          backgroundColor: theme.color[ownerState.color][600],
          '@media (hover: none)': {
            backgroundColor: theme.color[ownerState.color].body
          }
        }
      })
  }),
  ({ theme }) => ({
    [`&.${fabClasses.disabled}`]: {
      color: theme.color.disabled.text,
      boxShadow: theme.boxShadow[0],
      backgroundColor: theme.color.disabled.body
    }
  }),
  ({ ownerState }) => ownerState.cssStyles
);

const Fab = React.forwardRef((props, ref) => {
  const {
    children,
    color = 'default',
    component: componentProp = 'button',
    disabled = false,
    disableFocusRipple = false,
    focusVisibleClassName,
    size = 'large',
    slots = {},
    slotProps = {},
    variant = 'circular',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    color,
    cssStyles,
    disabled,
    disableFocusRipple,
    size,
    variant
  };

  const classes = {
    root: [fabClasses.root, ownerState.disabled && fabClasses.disabled],
    focusVisible: fabClasses.focusVisible
  };

  const component = componentProp || 'button';
  const FabComponent = slots.root || FabRoot;

  const fabRootProps = useSlotProps({
    elementType: FabComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      classes: classes,
      disabled: disabled,
      disableFocusRipple: disableFocusRipple,
      focusVisibleClassName: clsx(slotProps?.focusVisible, focusVisibleClassName),
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <FabComponent component={component} {...fabRootProps}>
      {children}
    </FabComponent>
  );
});

Fab.displayName = 'Fab';

export default Fab;
