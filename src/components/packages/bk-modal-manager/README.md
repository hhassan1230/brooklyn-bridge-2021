# IAC Modal Manager Module

A manager to display modals within the page in an intelligent way allowing consumers to avoid repeated positioning code and only worry about the contents of the modal.

For a full up to date list of props look at the propTypes of ModalManager.jsx

Modal Manager needs to be plugged on the `foreground` outlet. Use it in any other outlet at your own risk.

```
dispatch(openModal({
    type: 'modal'|'tooltip',
    id: 'myAwesomeModal', //A unique identifier for your modal,
    title: 'The title',
    icon: 'icon-name', // this will add a <i className="icon icon-name" /> to the header
    width: 300, // the width, for tooltips is required, for modals if not specified it will accomodate the content
    height: 300, // the height - not required
    anchorElementID: 'weather', // required for tooltips, the ID of the element that the tooltip should be anchored to
    tooltipAlignment: 'left'|'right'|'center', // Center is the default, this will align the tooltip and the arrow to the left or right of the anchor element
    showHeader: true, // wether to show the header or not
    showBackdrop: true, // wether to show a backdrop or not
    closeOnClickOutside: true, // wether to allow click on the backdrop to close the modal
    component: (props) => { return <div />; }, // the component to render, it can be a props function or a class just like a react component.
    moduleName: 'iac-weather-tooltip-ui/tooltip', // the name of a plug to render with PlugLoader
    contentProps: { // a props object to pass to either the component or the PlugLoader render function
        ...thePropsForTheComponent,
    overridePositions: { top: 0, right: '100%'},
    },
}));
```

Example of resizing of opened modal, which keeps current state and avoids re-init the module code
```
dispatch(updateModal({
    width: 310, // new width,
    height: 310, // new height
}));
```

You can do "onClose" by adding something to the componentWillUnmount method of the component being rendered inside the modal.

Modal manager doesn't provide a lot of default CSS on purpose, is up to the consumer to provide positioning and look and feel for the modals.

## Modules/products using modal manager include:
* App store
* Settings
* Sticky notes modules and config
* and many many more...

## Styling

You can either use the base generic modal manager and provide your own styles OR you can choose the sub-module `iac-modal-manager/styled` to inherit a consistent styling across products.

Of course, you can also use the sub-module and overwrite or extend the styles as you see fit.
