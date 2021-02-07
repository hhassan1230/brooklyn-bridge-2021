import React, { Component, PropTypes, createFactory } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import shallowequal from 'shallowequal';
import classNames from 'classnames';
import eventListener from 'eventlistener';
import debounce from 'lodash.debounce';
import Utils from 'iac-webtooltab-utils';
import {
    ARROW_HORIZONTAL_GUTTER,
    ESC_KEY_CODE,
    MODAL_HORIZONTAL_GUTTER,
    MODAL_VERTICAL_GUTTER,
} from './constants';
import { closeModal } from './reducers';
import { EventMap, UnifiedLogging } from 'iac-reporting';
import './styles.less';

class ModalManager extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        // The type of the modal.  A standard modal or a tooltip:
        type: PropTypes.oneOf(['modal', 'tooltip']),
        // The React component to load into the modal:
        component: PropTypes.func,
        moduleName: PropTypes.string,
        // The props that the React component needs to function:
        contentProps: PropTypes.object,
        // The id given to the modal:
        id: PropTypes.string,
        // Should we close the modal when hitting escape?
        closeOnEsc: PropTypes.bool,
        // Should we close the modal when clicking outside of the modal?
        closeOnClickOutside: PropTypes.bool,
        // Should we show a dark backdrop behind the modal/tooltip to block clicks?
        showBackdrop: PropTypes.bool,
        // Should the header be shown:
        showHeader: PropTypes.bool,
        // Should the close button be shown:
        showCloseBtn: PropTypes.bool,
        // The title that appears in the header of the modal
        title: PropTypes.string,
        // The icon class name that will show an icon in the header:
        icon: PropTypes.string,
        // The logo image URL that appears in the header of the modal:
        logo: PropTypes.string,
        // The DOM element to which we anchor the tooltip:
        anchor: PropTypes.object,
        // An offset positive or negative to move the modal respective to the anchor
        anchorOffset: PropTypes.number,
        // The alignment of the tooltip container and the tooltip arrow:
        tooltipAlignment: PropTypes.oneOf(['left', 'center', 'right']),
        // The placement of the tooltip container in relation to the anchor:
        placement: PropTypes.oneOf(['', 'above', 'below']),
        // The modal's section for reporting purposes:
        section: PropTypes.string,
        // See mapStateToProps
        forceUpdate: PropTypes.bool,
        // The width of the content:
        width: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        // The height of the content:
        height: PropTypes.number,
        // Text to show on hover of the close button
        closeButtonTooltip: PropTypes.string,
        // header buttons are arbitrary button definitions that will be added to the header
        headerButtons: PropTypes.arrayOf(PropTypes.shape({
            icon: PropTypes.string,
            label: PropTypes.string,
            classNames: PropTypes.string,
            onClick: PropTypes.func.isRequired,
        })),
        // A class name to append onto the modal/tooltip:
        additionalClassNames: PropTypes.string,
        // Should resize logic be triggered on scroll:
        disableResizingOnScroll: PropTypes.bool,
        modalHeightAutoShrink: PropTypes.bool.isRequired,
        // Position the modal content in custom absolute alignment
        overridePositions: PropTypes.shape({
            top: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            right: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        }),
    };

    static contextTypes = {
        plugLoader: PropTypes.object.isRequired,
    };

    static defaultProps = {
        closeButtonTooltip: __('Close'),
        headerButtons: [],
        tooltipAlignment: 'center',
        disableResizingOnScroll: false,
    };

    constructor(props) {
        super(props);

        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleBackdropClick = this.handleBackdropClick.bind(this);
        this.handleResize = debounce(this.handleResize.bind(this), 250, {
            leading: false,
            trailing: true,
        });
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        eventListener.add(window, 'resize', this.handleResize);
        eventListener.add(window, 'scroll', this.handleScroll);
        eventListener.add(document, 'keyup', this.handleKeyUp);
        eventListener.add(document, 'mousedown', this.handleMouseDown);
    }

    /**
     * Comparing props here instead of relying on redux
     * In order to react to the modal anchor position changing AFTER the anchor
     * component has finished rendering.
     *
     * MapStateToProps is too early.
     *
     * @param {{}} nextProps
     *
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps) {
        // First lets do a comparison of all props except for the dummy forceUpdate
        let result = !shallowequal(this.props, {
            ...nextProps,
            forceUpdate: this.props.forceUpdate,
        });

        // Calculate the position of the anchor
        const nextAnchorPos = ModalManager.getBoundingClientRect(nextProps.anchor);

        // If nothing else is updated and I have positions compare them
        if (result === false && this.anchorPosition && nextAnchorPos) {
            const clientRectKeys = ['left', 'right', 'top', 'bottom', 'width', 'height'];
            for (let i = 0; i < clientRectKeys.length; i++) {
                if (this.anchorPosition[clientRectKeys[i]] !== nextAnchorPos[clientRectKeys[i]]) {
                    // Anchor position changed, ModalManager component should update
                    result = true;
                    break;
                }
            }
        }

        // Set the anchor position for position calculation on the next render
        this.anchorPosition = nextAnchorPos || null;

        // Finally return the result, indicating if ModalManager component should update
        return result;
    }

    componentDidUpdate(prevProps) {
        const { anchor, showBackdrop } = this.props;
        const prevAnchor = prevProps.anchor;

        // Was there a previous anchor? Remove the modal-anchor class name:
        if (prevAnchor) {
            const prevAnchorClassNames = new Set(prevAnchor.className.split(' '));
            prevAnchorClassNames.delete('modal-anchor');
            prevAnchorClassNames.delete('with-backdrop');
            prevAnchor.className = Array.from(prevAnchorClassNames).join(' ');
        }

        // Is there a new anchor? Add the modal-anchor class
        if (anchor) {
            const anchorClassNames = new Set(anchor.className.split(' '));
            anchorClassNames.add('modal-anchor');
            if (showBackdrop) {
                anchorClassNames.add('with-backdrop');
            }
            anchor.className = Array.from(anchorClassNames).join(' ');
        }
    }

    componentWillUnmount() {
        eventListener.remove(window, 'resize', this.handleResize);
        eventListener.remove(window, 'scroll', this.handleScroll);
        eventListener.remove(document, 'keyup', this.handleKeyUp);
        eventListener.remove(document, 'mousedown', this.handleMouseDown);
    }

    handleScroll() {
        !this.props.disableResizingOnScroll && this.handleResize();
    }

    handleResize() {
        // Force a re-render to allow the position to be re-calculated only if visible
        if (this.props.id) {
            // get the new position of the anchor
            this.anchorPosition = ModalManager.getBoundingClientRect(this.props.anchor);
            // force an update to reposition the modal/arrow
            // In IE8 forceUpdate seems to be invoked multiple times,
            // one of which throw error since the DOM element is not ready.
            // Catch the error so that it does not block process.
            // It will be successfully updated in the next invocation.
            try {
                this.forceUpdate();
            }
            catch (e) {
                // do nothing
            }
        }
    }

    handleKeyUp(event) {
        if (this.props.closeOnEsc && (event.which || event.keyCode) === ESC_KEY_CODE && this.props.id) {
            if (event.preventDefault) {
                event.preventDefault();
            }
            else {
                event.returnValue = false; // eslint-disable-line no-param-reassign
            }
            this.closeModal('key');
        }
    }

    handleMouseDown(event) {
        // Is this modal configured to close when clicking outside the modal manager?
        if (!this.props.closeOnClickOutside) {
            return;
        }

        // Is the modal visible?
        if (this.props.id) {
            // IE8 fix: check srcElement
            const isClickOnModalManager = Utils.isChildOf(ReactDOM.findDOMNode(this), event.target || event.srcElement);

            if (this.props.type === 'tooltip') {
                const isClickOnAnchor = Utils.isChildOf(this.props.anchor, event.target);
                if (!isClickOnModalManager && !isClickOnAnchor) {
                    this.closeModal('overlay');
                }
            }
            else {
                // Did the click occur outside of the modal? Close the modal
                if (!isClickOnModalManager) {
                    this.closeModal('overlay');
                }
            }
        }
    }

    handleBackdropClick() {
        if (this.props.closeOnClickOutside) {
            this.closeModal('overlay');
        }
    }

    static getBoundingClientRect(anchor) {
        if (anchor) {
            const rect = anchor.getBoundingClientRect();
            // rect is a DOMRect object, so create a plain object containing all properties of rect
            return {
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                x: rect.x,
                y: rect.y,
                width: rect.width || anchor.offsetWidth,
                height: rect.height || anchor.offsetHeight,
            };
        }
        return null;
    }

    static calculateAnchorPositioning(anchorPosition, width, height, alignment, placement, anchorOffset = 0, modalHeightAutoShrink) {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        const scrollLeft = Utils.getDocumentScrollLeft();
        const scrollTop = Utils.getDocumentScrollTop();

        const modalContainerClassNames = {};
        const anchorPositionLeft = anchorPosition.left + scrollLeft;
        const anchorPositionRight = anchorPosition.right + scrollLeft;
        const anchorPositionTop = anchorPosition.top + scrollTop;
        const anchorHorizontalCenter = anchorPositionLeft + (anchorPosition.width / 2);
        const arrowStyle = { left: ARROW_HORIZONTAL_GUTTER };
        const containerStyle = {};
        let modalContainerLeft;

        // horizontal alignment
        if (anchorPosition && width) {
            // convert % dimensions to actual numbers we can work with
            let modalWidth = width;
            if (typeof modalWidth === 'string' && modalWidth.indexOf('%')) {
                modalWidth = windowWidth * parseInt(modalWidth, 10) / 100;
            }

            // first lets calculate where everything should be in a perfect scenario
            // (i.e. everything fits in the screen)
            if (alignment === 'left') {
                modalContainerLeft = anchorPositionLeft;
                arrowStyle.left = ARROW_HORIZONTAL_GUTTER;
            }
            else if (alignment === 'right') {
                modalContainerLeft = anchorPositionRight - modalWidth;
                arrowStyle.left = modalWidth - ARROW_HORIZONTAL_GUTTER;
            }
            else if (alignment === 'center') { // default is to center;
                modalContainerLeft = anchorHorizontalCenter - (modalWidth / 2);
                arrowStyle.left = anchorHorizontalCenter - modalContainerLeft;
            }

            // now lets see if its off screen and correct it
            const amountOffScreen = MODAL_HORIZONTAL_GUTTER + modalContainerLeft + modalWidth - windowWidth;
            const isOffscreenLeft = modalContainerLeft < 0;
            const isOffscreenRight = amountOffScreen > 0;

            if (isOffscreenLeft) { // offscreen to the left
                modalContainerLeft += MODAL_HORIZONTAL_GUTTER + Math.abs(modalContainerLeft);
                arrowStyle.left = anchorHorizontalCenter - modalContainerLeft;
            }
            else if (isOffscreenRight) {
                modalContainerLeft -= amountOffScreen;
                arrowStyle.left = anchorHorizontalCenter - modalContainerLeft;
            }

            // Check if arrow is positioned outside modal and if so, move it to be at the first/last
            // possible position and set the modal to be off screen at that first/last possible position
            if (arrowStyle.left > (modalWidth - ARROW_HORIZONTAL_GUTTER)) {
                arrowStyle.left = modalWidth - ARROW_HORIZONTAL_GUTTER;
                modalContainerLeft = anchorHorizontalCenter - modalWidth + ARROW_HORIZONTAL_GUTTER;
            }
            else if (arrowStyle.left < ARROW_HORIZONTAL_GUTTER) {
                arrowStyle.left = ARROW_HORIZONTAL_GUTTER;
                modalContainerLeft = anchorHorizontalCenter - ARROW_HORIZONTAL_GUTTER;
            }
        }

        // Vertical alignment
        const anchorTop = anchorPositionTop + anchorPosition.height;
        // calculate available height for the modal
        const relativeAnchorPositionTop = anchorPositionTop - scrollTop;
        let finalHeight = height;

        // Calculate modal placement
        if (
            placement === 'below' ||
            (!placement && (anchorTop + height < windowHeight))
        ) {
            // We can fit the tooltip below the anchor
            modalContainerClassNames['placement-below'] = true;
            containerStyle.top = anchorTop + anchorOffset;
            if (modalHeightAutoShrink && windowHeight - anchorOffset - anchorTop < height) {
                finalHeight = Math.max(MODAL_VERTICAL_GUTTER, windowHeight - anchorOffset - anchorTop - MODAL_VERTICAL_GUTTER);
            }
        }
        else if (
            placement === 'above' ||
            (!placement && (relativeAnchorPositionTop - height > 0))
        ) {
            // Otherwise, place the tooltip above the anchor
            modalContainerClassNames['placement-above'] = true;
            containerStyle.bottom = windowHeight - anchorPositionTop + anchorOffset;
            if (modalHeightAutoShrink && relativeAnchorPositionTop < height) {
                finalHeight = Math.max(MODAL_VERTICAL_GUTTER, relativeAnchorPositionTop - MODAL_VERTICAL_GUTTER);
            }
        }
        else {
            containerStyle.top = MODAL_VERTICAL_GUTTER;
        }

        return {
            modalContainerClassNames,
            containerStyle: {
                ...containerStyle,
                left: modalContainerLeft,
                width,
                height: finalHeight || null,
            },
            arrowStyle,
        };
    }

    /**
     * Calculates the position of the tooltip and arrow
     *
     * @param {ClientRect|Object} anchorPosition The current position of the anchor
     * @param {Number|String} width The width of the tooltip contents
     * @param {Number} height The height of the tooltip contents
     * @param {String} alignment The alignment of the tooltip and arrow
     * @param {String} placement The forced placement of the tooltip above or below the anchor
     * @param {Number} anchorOffset
     *
     * @returns {{modalContainerClassNames: {}, containerStyle: *, arrowStyle: {left: number}}}
     */
    static calculatePositioning(anchorPosition, width, height, alignment, placement, anchorOffset = 0, modalHeightAutoShrink, overridePositions = {}) {
        // position based on an anchor
        if (anchorPosition) {
            return ModalManager.calculateAnchorPositioning(
                anchorPosition,
                width,
                height,
                alignment,
                placement,
                anchorOffset,
                modalHeightAutoShrink,
            );
        }

        const modalContainerClassNames = {};
        let modalContainerLeft = 0;
        let modalContainerRight;
        let modalContainerTop;
        const overridePositionTop = overridePositions.top;
        const overridePositionRight = overridePositions.right;
        const scrollLeft = Utils.getDocumentScrollLeft();
        const scrollTop = Utils.getDocumentScrollTop();

        // calculate horizontal alignment based on width
        if (width) {
            const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            // convert % dimensions to actual numbers we can work with
            let modalWidth = width;
            if (typeof modalWidth === 'string' && modalWidth.indexOf('%')) {
                modalWidth = windowWidth * parseInt(modalWidth, 10) / 100;
            }

            if (typeof overridePositionRight !== 'undefined') {
                modalContainerRight = overridePositionRight;
            }
            // first lets calculate where everything should be in a perfect scenario
            // (i.e. everything fits in the screen)
            else if (alignment === 'left') {
                modalContainerLeft = MODAL_HORIZONTAL_GUTTER + scrollLeft;
            }
            else if (alignment === 'right') {
                modalContainerLeft = windowWidth - modalWidth - MODAL_HORIZONTAL_GUTTER + scrollLeft;
            }
            else if (alignment === 'center') { // default is to center;
                modalContainerLeft = Math.max(MODAL_HORIZONTAL_GUTTER, (windowWidth / 2) - (modalWidth / 2) + scrollLeft);
            }
        }

        // calculate vertical alignment based on height
        if (height) {
            const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            // convert % dimensions to actual numbers we can work with
            let modalHeight = height;
            if (typeof modalHeight === 'string' && modalHeight.indexOf('%')) {
                modalHeight = windowHeight * parseInt(modalHeight, 10) / 100;
            }

            // if overridePositionTop is percentage as strings
            if (typeof overridePositionTop === 'string' && overridePositionTop.indexOf('%')) {
                // Keep position when WTT height overflows to scroll
                modalContainerTop = windowHeight * parseInt(overridePositionTop, 10) / 100 + scrollTop;
            }
            else if (typeof overridePositionTop === 'number') {
                modalContainerTop = overridePositionTop + scrollTop;
            }
            else {
                modalContainerTop = Math.max(MODAL_VERTICAL_GUTTER, (windowHeight / 2) - (modalHeight / 2) + scrollTop);
            }
        }

        return {
            modalContainerClassNames,
            containerStyle: {
                top: typeof modalContainerTop !== 'undefined' ? modalContainerTop : null,
                left: modalContainerLeft || null,
                right: typeof modalContainerRight !== 'undefined' ? modalContainerRight : null,
                width: width || null,
                height: height || null,
            },
        };
    }

    closeModal(type = '') {
        const { dispatch, title, section } = this.props;

        const names = {
            key: 'escape',
            button: 'close',
            overlay: 'overlay',
        };

        UnifiedLogging.track(
            EventMap.uiControl({
                type,
                action: type === 'key' ? 'key' : 'click',
                name: names[type],
                section: section || title,
                productData: {
                    newState: 'closed',
                },
            }),
        );

        // Dispatch the closeModal action to close the modal:
        dispatch(closeModal());
    }

    /**
     * If header buttons were provided render them
     *
     * @returns {null|React.Element}
     */
    renderHeaderButtons() {
        const { headerButtons, section, title } = this.props;

        if (!headerButtons) { return null; }

        return (
            <div className="header-buttons">
                {headerButtons.map((button) => (
                    <button title={button.label} className={button.classNames || null}
                        key={button.label}
                        onClick={() => {
                            button.onClick();

                            UnifiedLogging.track(
                                EventMap.uiControl({
                                    type: 'button',
                                    name: button.label,
                                    section: section || title,
                                }),
                            );
                        }}
                    >
                        <i className={`icon ${button.icon}`} />
                        <span className="text">{button.label}</span>
                    </button>
                ))}
            </div>
        );
    }

    /**
     * If showHeader is true render the heade
     *
     * @returns {null|React.Element}
     */
    renderHeader() {
        const { icon, logo, showHeader, title } = this.props;

        if (!showHeader) { return null; }

        const modalTitle = (<span className="text">{title}</span>) || (<span>&nbsp;</span>);

        const headerButtons = this.renderHeaderButtons();
        const headerClasses = {
            'generic-modal-header': true,
            'with-header-buttons': !!headerButtons.length,
        };

        return (
            <div className={classNames(headerClasses)}>
                <h2 className="generic-modal-title">
                    {icon ? <i className={classNames('icon', icon)} /> : null}
                    {logo
                        ? <img className="logo" src={logo} role="presentation" height="30" />
                        : null}
                    {modalTitle}
                </h2>
                {headerButtons}
            </div>
        );
    }

    /**
     * Renders the modal itself based on type
     *
     * @returns {null|ReactElement}
     */
    renderModal() {
        const {
            type, id, component, moduleName, contentProps,
            showHeader, showCloseBtn, width, height, tooltipAlignment,
            closeButtonTooltip, placement, anchorOffset, additionalClassNames, modalHeightAutoShrink, overridePositions,
        } = this.props;

        if (!id) {
            return null;
        }

        const closeButton = showCloseBtn === false ? null : (
            <button
                className="btn-close"
                title={closeButtonTooltip}
                onClick={() => this.closeModal('button')}
            >
                <i className="icon icon-close" />
            </button>
        );

        const header = this.renderHeader();

        let content;
        if (component) {
            content = createFactory(component)({
                ...contentProps,
                dispatch: this.props.dispatch,
            });
        }
        else if (moduleName) {
            content = this.context.plugLoader.render(moduleName, {
                ...contentProps,
                dispatch: this.props.dispatch,
            });
        }
        else {
            throw new Error('ModalManager: the component prop was neither a function nor a string.');
        }

        const classes = {
            'generic-modal': true,
            'header-visible': showHeader === true,
            [additionalClassNames]: true,
            [type]: true,
        };

        const { modalContainerClassNames, containerStyle, arrowStyle } =
            ModalManager.calculatePositioning(
                this.anchorPosition,
                width,
                height,
                tooltipAlignment,
                placement,
                anchorOffset,
                modalHeightAutoShrink,
                overridePositions
            );
        const modalClassNames = classNames({
            ...modalContainerClassNames,
            ...classes,
        });

        switch (type) {
            case 'tooltip': {
                return (
                    <div className={modalClassNames} style={containerStyle} id={`${id}Modal`}
                        role="dialog"
                    >
                        <div className="arrow" style={arrowStyle} />
                        {closeButton}
                        <div className="content-wrapper">
                            {header}
                            <div className="generic-modal-content">
                                {content}
                            </div>
                        </div>
                    </div>
                );
            }
            case 'modal': {
                return (
                    <div className={modalClassNames} style={containerStyle} id={`${id}Modal`}
                        role="dialog"
                    >
                        {header}
                        {closeButton}
                        <div className="generic-modal-content">
                            {content}
                        </div>
                    </div>
                );
            }
            default:
                return null;
        }
    }

    render() {
        const { type, showBackdrop } = this.props;
        const modal = this.renderModal();

        // Add a class to the body to allow the product to dim the background
        // in some way or do some other thing when a widget opens/closes
        const body = document.body;
        const classList = new Set(body.className.replace(/(^| )[a-z]+-opened/, '').split(' '));
        if (modal) {
            classList.add(`${type}-opened`);
        }

        body.className = Array.from(classList).join(' ');

        const backdrop = modal && showBackdrop ?
            <div className="backdrop" onClick={this.handleBackdropClick} /> : null;

        return (
            <div className="iac-modal-manager-module">
                {backdrop}
                {modal}
            </div>
        );
    }
}

let forceUpdate = false;

const mapStateToProps = (state) => {
    forceUpdate = !forceUpdate;

    return {
        // causes the modal manager to always update, see shouldComponentUpdate for the explanation
        forceUpdate,
        type: state.modalManager.type,
        id: state.modalManager.id,
        title: state.modalManager.title,
        moduleName: state.modalManager.moduleName,
        component: state.modalManager.component,
        contentProps: state.modalManager.contentProps,
        anchor: (
            state.modalManager.anchor ||
            state.modalManager.anchorElementID &&
            document.getElementById(state.modalManager.anchorElementID)
        ),
        anchorOffset: state.modalManager.anchorOffset,
        section: state.modalManager.section,
        logo: state.modalManager.logo,
        icon: state.modalManager.icon,
        showBackdrop: state.modalManager.showBackdrop,
        showHeader: state.modalManager.showHeader,
        headerButtons: state.modalManager.headerButtons,
        showCloseBtn: state.modalManager.showCloseBtn,
        closeOnEsc: state.modalManager.closeOnEsc,
        closeOnClickOutside: state.modalManager.closeOnClickOutside,
        width: state.modalManager.width,
        height: state.modalManager.height,
        tooltipAlignment: state.modalManager.tooltipAlignment,
        placement: state.modalManager.placement,
        additionalClassNames: state.modalManager.additionalClassNames,
        disableResizingOnScroll: state.modalManager.disableResizingOnScroll,
        modalHeightAutoShrink: state.modalManager.modalHeightAutoShrink,
        overridePositions: state.modalManager.overridePositions,
    };
};

export default connect(mapStateToProps)(ModalManager);
