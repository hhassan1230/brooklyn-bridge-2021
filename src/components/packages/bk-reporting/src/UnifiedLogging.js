import { compose } from 'redux';

let queue = [];
let toolbarData = null;
let initialized = false;
let pageLoad = null;
let Anemone = null;
const preTrackHookCallbacks = {};
const preTrackHookHandlers = {};
const ALL_EVENT_TYPE = 'all';

if (process.browser) {
    // eslint-disable-next-line global-require
    Anemone = require('./anemone-1.2.7').default;
}

const UnifiedLogging = {
    init(config) {
        if (!Anemone) {
            return;
        }

        if (initialized) {
            throw new Error('Already initialized');
        }
        initialized = true;

        // Note: The || null is important because Anemone cares
        Anemone.config.url = config.url || null;
        Anemone.pixelUrl = config.pixelUrl || null;

        toolbarData = config.data;

        if (config.pageLoad) {
            pageLoad = config.pageLoad;
        }

        if (queue.length) {
            queue.forEach((action) => action());
            queue = [];
        }

        UnifiedLogging.keyMap = config.keyMap;
        UnifiedLogging.overrideValues = config.overrideValues;
    },

    track(eventData) {
        if (!Anemone) {
            return;
        }

        if (!initialized) {
            queue.push(this.track.bind(this, ...arguments)); // eslint-disable-line prefer-rest-params
            return;
        }

        const eventName = eventData.eventName;
        const appId = eventData.appId || 'WebTooltab';
        let newEventData = {
            ...toolbarData,
            ...eventData,
            productData: eventData.productData || {},
        };

        if (preTrackHookHandlers[eventName]) {
            newEventData = preTrackHookHandlers[eventName](newEventData);
        }
        if (preTrackHookHandlers[ALL_EVENT_TYPE]) {
            newEventData = preTrackHookHandlers[ALL_EVENT_TYPE](newEventData);
        }

        // this can be a pre track hook for 'all' events
        const productData = newEventData.productData || {};
        if (typeof productData !== 'string') {
            // Append pageLoad to every tracking call within productData.
            // No need to append to productData which are strings.
            productData.pageLoad = pageLoad;

            // stringify the productData object:
            newEventData.productData = JSON.stringify(productData);
        }

        if (process.env.NODE_ENV === 'production') {
            delete newEventData.eventName;
            delete newEventData.appId;

            Anemone.appId = appId;
            Anemone.logEvent(eventName, newEventData);
        }
        else {
            // When working locally, we console log the reporting data instead of request the pixel
            /* eslint-disable no-console, no-empty */
            try {
                console.groupCollapsed(`%c Unified Logging Event: %c${eventName}`, 'color:#888;font-weight:normal;', 'color:#333');
                console.table({
                    appId,
                    ...newEventData,
                });
                console.groupCollapsed('productData');
                console.table(productData);
                console.groupEnd('productData');
                console.groupEnd(`Unified Logging Event: ${eventName}`);
            }
            catch (e) {}
            /* eslint-enable no-console, no-empty */
        }
    },

    /**
     * Adds a pre track hook. On track() calls before calling anemone.logEvent this callback will be called
     * to allow modification of the event data or to allow for side effects to happen.
     *
     * The callback is expected to return a new/same eventData object.
     *
     * @param {Function} callback The function to call. Signature: function(eventData: Object): Object.
     * @param {String} [eventType] Which events to trigger for. Default is all event types. e.g. UIControl
     */
    addPreTrackHook(callback, eventType = ALL_EVENT_TYPE) {
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.log(`[UNIFIED LOGGING] info New pre track hook registered for ${eventType} events.`);
        }
        // init that type in the callbacks array, this allows to keep track of the real callbacks
        preTrackHookCallbacks[eventType] = preTrackHookCallbacks[eventType] || [];
        // push the new callback
        preTrackHookCallbacks[eventType].push(callback);
        // recompose functions
        preTrackHookHandlers[eventType] = preTrackHookHandlers[eventType] || [];
        preTrackHookHandlers[eventType] = compose.apply(this, preTrackHookCallbacks[eventType]);
    },

    /**
     * Removes a pre track hook.
     *
     * @param {Function} callback The function to call. Signature: function(eventData: Object): Object.
     * @param {String} [eventType] Which events to trigger for. Default is all event types. e.g. UIControl
     */
    removePreTrackHook(callback, eventType = ALL_EVENT_TYPE) {
        // remove function, store in temporary variable
        const callbacks = preTrackHookCallbacks[eventType].filter((cb) => cb !== callback);

        if (process.env.NODE_ENV !== 'production') {
            if (callbacks.length === preTrackHookCallbacks[eventType].length - 1) {
                // eslint-disable-next-line no-console
                console.log(`[UNIFIED LOGGING] info A pre track hook for ${eventType} events was removed.`);
            }
            else {
                // eslint-disable-next-line no-console
                console.error(`[UNIFIED LOGGING] error A pre track hook for ${eventType} events failed to be removed.  Please investigate.`);
            }
        }

        // recompose remaining functions
        preTrackHookHandlers[eventType] = compose.apply(this, callbacks);
    },

    /**
     * Method to change the PTB (anxt) after the page has been loaded.  Occurs for PWA products when the
     * user installs the PWA at some point during the user flow.
     * @param {String} ptb A UUIDv4 string of the form `27893983-51E0-4D57-8A67-87D96448C4E7`
     */
    setPTB(ptb) {
        toolbarData.anxt = ptb;
    },
};

export default UnifiedLogging;
