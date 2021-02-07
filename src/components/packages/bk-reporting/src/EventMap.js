import UnifiedLogging from './UnifiedLogging';

/**
 * @typedef {Object} EventData
 * @property {String} [appId] The reporting app id
 * @property {String} [eventName] The type of event to track
 * @property {String} [zone] Where in the general layout of the page this event originated in
 * @property {Object} [productData] Additional information about the event
 * @property {String} [anxs] The section, which section of the page this event originated in
 * @property {String} [section] Equivalent to anxs
 * @property {String} [action] UIControl The action the user took, e.g. click
 * @property {String} [label] @deprecated use `name` instead
 * @property {String} [controlID] @deprecated Name is used instead for event name and productData label is used for the label,
 * @property {String} [name] The name of this event
 * @property {String} [type] Info event's type, UIControl the control type e.g. link OR button
 * @property {String} [icon] @deprecated If needed put into productData instead
 * @property {String} [group] ??? Not sure what this is ???
 * @property {String} [position] @deprecated Put it in productData if needed
 * @property {String} [uiType] @deprecated use type instead
 * @property {String} [source] For search, where the search query originated e.g. tab, bar
 * @property {String} [toolbarVersion] @deprecated The toolbar version
 * @property {String} [fParameter] @deprecated ???
 * @property {String} [coid] @deprecated ???
 */

const EventMap = {
    /**
     * @deprecated
     * @param {EventData} params
     *
     * @returns {EventData}
     */
    oldToolbarButtonClick(params) {
        return {
            appId: 'CAPToolbarButtons',
            eventName: 'ButtonClick',
            position: params.position,
        };
    },

    /**
     * @deprecated
     *
     * @returns {EventData}
     */
    oldPageView() {
        return {
            appId: 'CAPSearch',
            eventName: 'TabPageView',
        };
    },

    /**
     * @deprecated
     *
     * @param {EventData} params
     *
     * @returns {EventData}
     */
    oldConfigRequests(params) {
        return {
            appId: 'CAPOne',
            eventName: 'ToolbarConfig',
            anxtv: params.toolbarVersion,
            fParameter: params.fParameter,
            coid: params.coid,
        };
    },

    /**
     * @param {EventData} params
     *
     * @returns {EventData}
     */
    configRequests(params = {}) {
        return {
            eventName: 'Heartbeat',
            productData: params.productData,
        };
    },

    /**
     * @param {EventData} params
     *
     * @returns {EventData}
     */
    toolbarButtonClick(params) {
        return this.uiControl({
            ...params,
            uitype: 'button',
            anxs: 'toolbar',
            action: 'click',
        });
    },

    /**
     * @param {EventData} params
     * @param {Object} additionalTrackingParams
     *
     * @returns {EventData}
     */
    chicletButtonClick(params, additionalTrackingParams = {}) {
        return this.uiControl({
            ...params,
            uitype: 'chiclet',
            anxs: 'chiclets',
            action: 'click',
            ...additionalTrackingParams,
        });
    },

    /**
     * @deprecated
     *
     * @param {EventData} params
     *
     * @returns {EventData}
     */
    searchButtonClick(params) {
        return this.uiControl(params);
    },

    EVENT_INFO: 'Info',
    /**
     * Info event
     *
     * @param {EventData} params
     *
     * @returns {EventData}
     */
    info(params = {}) {
        return {
            eventName: EventMap.EVENT_INFO,
            name: params.name,
            type: params.type,
            kpi: params.kpi,
            productData: {
                ...params.productData,
                // Doubling the kpi param within productData so it can be captured.
                // Will be removed once we white list the top level kpi.
                kpi: params.kpi,
            },
        };
    },

    EVENT_ERROR: 'Error',
    /**
     * Error event
     *
     * @param {EventData} params
     *
     * @returns {EventData}
     */
    error(params = {}) {
        return {
            eventName: EventMap.EVENT_ERROR,
            name: params.name,
            type: params.type,
            anxs: params.anxs || params.section,
            apiProvider: params.apiProvider,
            ui: params.ui,
            filter: params.filter,
            productData: params.productData,
        };
    },

    EVENT_PAGE_VIEW: 'PageView',
    /**
     * PageView event
     *
     * @param {EventData} params
     *
     * @returns {EventData}
     */
    pageView(params = {}) {
        return {
            eventName: EventMap.EVENT_PAGE_VIEW,
            kpi: params.kpi,
            productData: params.productData,
        };
    },

    EVENT_DIALOG_VIEW: 'DialogView',
    /**
     * Trigger a DialogView event with specific data points.
     * If Unified Logging was initialized
     * with override values for the app ID and version, overwrite the default WebTooltab & version.
     * This allows another Anemone supported consumer, like SERP, to supply their own values.
     *
     * @param {EventData} params
     *
     * @returns {EventData}
     */
    dialogView(params = {}) {
        const eventData = {
            eventName: EventMap.EVENT_DIALOG_VIEW,
            name: params.name,
            anxs: params.section,
            zone: params.zone,
            productData: params.productData,
        };

        if (UnifiedLogging.overrideValues) {
            if (UnifiedLogging.overrideValues.appId) {
                eventData.appId = UnifiedLogging.overrideValues.appId;
            }
            if (UnifiedLogging.overrideValues.anxv) {
                eventData.anxv = UnifiedLogging.overrideValues.anxv;
            }
        }

        return eventData;
    },

    EVENT_UI_CONTROL: 'UIControl',
    /**
     * Trigger a UIControl event with specific data points.  If Unified Logging was initialized
     * with override values, use them as overwrites.  If initialized with a keyMap, take the
     * incoming key and switch it to the new key, deleting the old key to avoid duplicates.
     *
     * @param {EventData} params
     *
     * @returns {EventData}
     */
    uiControl(params = {}) {
        const eventData = {
            eventName: EventMap.EVENT_UI_CONTROL,
            label: params.label,
            name: params.name || params.label,
            controlID: params.controlID || params.label,
            type: params.type,
            icon: params.icon,
            zone: params.zone,
            action: params.action || 'click',
            group: params.group,
            position: params.position,
            uitype: params.uitype,
            anxs: params.anxs || params.section,
            kpi: params.kpi,
            productData: {
                ...params.productData,
                // Doubling the kpi param within productData so it can be captured.
                // Will be removed once we white list the top level kpi.
                kpi: params.kpi,
            },
            source: params.source,
        };

        if (UnifiedLogging.keyMap) {
            Object.keys(UnifiedLogging.keyMap).forEach((ourKey) => {
                const theirKey = UnifiedLogging.keyMap[ourKey];

                eventData[theirKey] = eventData[ourKey];
                delete eventData[ourKey];
            });
        }

        return {
            ...eventData,
            ...UnifiedLogging.overrideValues,
        };
    },
};

export default EventMap;
