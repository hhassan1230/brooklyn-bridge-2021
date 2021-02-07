jest.autoMockOff();

Object.defineProperty(process, 'browser', {
    value: true,
});

jest.mock('../src/anemone-1.2.7', () => {
    return {
        default: {
            config: {},
            logEvent: jest.fn((eventName, data) => {}),
        },
    };
});

const Anemone = require('../src/anemone-1.2.7').default;
const UnifiedLogging = require('../src/UnifiedLogging').default;
const EventMap = require('../src/EventMap').default;

function resetUnifiedLogging() {
    UnifiedLogging.__Rewire__('queue', []);
    UnifiedLogging.__Rewire__('toolbarData', null);
    UnifiedLogging.__Rewire__('initialized', false);
}

describe('UnifiedLogging', () => {
    // Store the original node environment so we can test as if we were in Production
    const originalEnvironment = process.env.NODE_ENV;
    beforeAll(() => {
        process.env.NODE_ENV = 'production';
    });
    // Revert the node environment back after all of the tests
    afterAll(() => {
        process.env.NODE_ENV = originalEnvironment;
    });

    // Reset Unified Logging's state before each test
    beforeEach(resetUnifiedLogging);

    it('init variables set correctly', () => {
        const data = {
            anxt: 'test_ptb',
            anxp: 'test_partner',
            anxv: 'test_appVersion',
            anxl: 'test_ln',
            anxsi: 'test_si',
        };
        UnifiedLogging.init({
            url: 'http://dfdevpixel2.df.jabodo.com/tr.gif',
            data,
        });
        expect(UnifiedLogging.__GetDependency__('queue').length).toBe(0);
        expect(UnifiedLogging.__GetDependency__('initialized')).toBe(true);
        expect(UnifiedLogging.__GetDependency__('toolbarData')).toBe(data);
        expect(Anemone.config.url).toBe('http://dfdevpixel2.df.jabodo.com/tr.gif');
        expect(Anemone.pixelUrl).toBe(null);
    });

    it('call init with no argument throws error', () => {
        expect(() => {
            UnifiedLogging.init();
        }).toThrow();
    });

    it('directly call track without init not throw error', () => {
        expect(() => {
            UnifiedLogging.track();
        }).not.toThrow();
    });

    it('call track then call init gets the same result as call init then call track', () => {
        UnifiedLogging.track(EventMap.uiControl({
            label: 'Search',
            source: 'pre-rendered search box',
            type: 'Button',
            zone: 'pre-rendered page',
            action: 'test',
            anxs: 'pre-rendered page',
            uitype: 'center-search',
        }));

        UnifiedLogging.init({
            url: 'http://dfdevpixel2.df.jabodo.com/tr.gif',
            data: {
                anxt: 'test_ptb',
                anxp: 'test_partner',
                anxv: 'test_appVersion',
                anxl: 'test_ln',
                anxsi: 'test_si',
            },
        });

        expect(Anemone.logEvent).toBeCalledWith('UIControl', {
            anxt: 'test_ptb',
            anxp: 'test_partner',
            anxv: 'test_appVersion',
            anxl: 'test_ln',
            anxsi: 'test_si',
            buid: undefined,
            label: 'Search',
            name: 'Search',
            controlID: 'Search',
            type: 'Button',
            icon: undefined,
            zone: 'pre-rendered page',
            action: 'test',
            group: undefined,
            position: undefined,
            uitype: 'center-search',
            anxs: 'pre-rendered page',
            productData: '{"pageLoad":null}',
            source: 'pre-rendered search box',
        });
    });

    it('can not call init more than once', () => {
        expect(() => {
            UnifiedLogging.init({
                url: 'http://dfdevpixel2.df.jabodo.com/tr.gif',
                data: {
                    anxt: 'test_ptb',
                    anxp: 'test_partner',
                    anxv: 'test_appVersion',
                    anxl: 'test_ln',
                    anxsi: 'test_si',
                },
            });
            UnifiedLogging.init({
                url: 'http://dfdevpixel2.df.jabodo.com/tr.gif',
                data: {
                    anxt: 'test_ptb',
                    anxp: 'test_partner',
                    anxv: 'test_appVersion',
                    anxl: 'test_ln',
                    anxsi: 'test_si',
                },
            });
        }).toThrowError('Already initialized');
    });

    it('searchButtonClick sent with correct params', () => {
        UnifiedLogging.init({
            url: 'http://dfdevpixel2.df.jabodo.com/tr.gif',
            data: {
                anxt: 'test_ptb',
                anxp: 'test_partner',
                anxv: 'test_appVersion',
                anxl: 'test_ln',
                anxsi: 'test_si',
            },
        });

        UnifiedLogging.track(EventMap.uiControl({
            label: 'Search',
            source: 'pre-rendered search box',
            type: 'Button',
            zone: 'pre-rendered page',
            action: 'test',
            anxs: 'pre-rendered page',
            uitype: 'center-search',
        }));

        expect(Anemone.logEvent).toBeCalledWith('UIControl', {
            anxt: 'test_ptb',
            anxp: 'test_partner',
            anxv: 'test_appVersion',
            anxl: 'test_ln',
            anxsi: 'test_si',
            buid: undefined,
            label: 'Search',
            name: 'Search',
            controlID: 'Search',
            type: 'Button',
            icon: undefined,
            zone: 'pre-rendered page',
            action: 'test',
            group: undefined,
            position: undefined,
            uitype: 'center-search',
            anxs: 'pre-rendered page',
            productData: '{"pageLoad":null}',
            source: 'pre-rendered search box',
        });
    });

    it('init with invalid data with valid data then track not throw error', () => {
        UnifiedLogging.init({
            url: 'http://dfdevpixel2.df.jabodo.com/tr.gif',
            data: null,
        });

        expect(() => {
            UnifiedLogging.track(EventMap.uiControl({
                label: 'Search',
                source: 'pre-rendered search box',
                type: 'Button',
                zone: 'pre-rendered page',
                action: 'test',
                anxs: 'pre-rendered page',
                uitype: 'center-search',
            }));
        }).not.toThrow();
    });

    it('init with valid data then track with invalid data not throw error', () => {
        UnifiedLogging.init({
            url: 'http://dfdevpixel2.df.jabodo.com/tr.gif',
            data: {
                anxt: 'test_ptb',
                anxp: 'test_partner',
                anxv: 'test_appVersion',
                anxl: 'test_ln',
                anxsi: 'test_si',
            },
        });

        expect(() => {
            UnifiedLogging.track(EventMap.uiControl());
        }).not.toThrow();
    });

    it('pageLoad appended to productData', () => {
        UnifiedLogging.init({
            url: 'http://dfdevpixel2.df.jabodo.com/tr.gif',
            data: {
                anxt: 'test_ptb',
                anxp: 'test_partner',
                anxv: 'test_appVersion',
                anxl: 'test_ln',
                anxsi: 'test_si',
            },
            pageLoad: 1,
        });
        UnifiedLogging.track(EventMap.uiControl({
            label: 'Search',
            source: 'pre-rendered search box',
            type: 'Button',
            zone: 'pre-rendered page',
            action: 'test',
            anxs: 'pre-rendered page',
            uitype: 'center-search',
        }));
        expect(Anemone.logEvent).toBeCalledWith('UIControl', {
            anxt: 'test_ptb',
            anxp: 'test_partner',
            anxv: 'test_appVersion',
            anxl: 'test_ln',
            anxsi: 'test_si',
            buid: undefined,
            label: 'Search',
            name: 'Search',
            controlID: 'Search',
            type: 'Button',
            icon: undefined,
            zone: 'pre-rendered page',
            action: 'test',
            group: undefined,
            position: undefined,
            uitype: 'center-search',
            anxs: 'pre-rendered page',
            productData: '{"pageLoad":1}',
            source: 'pre-rendered search box',
        });
    });

    it('uiControl with correct appId (WebTooltab) sent', () => {
        UnifiedLogging.init({});
        UnifiedLogging.track(EventMap.uiControl());

        expect(Anemone.appId).toBe('WebTooltab');
    });

    it('PTB (anxt) value modified and sent for subsequent events', () => {
        const initialPTB = '11111111-1111-4111-1111-111111111111';
        const updatedPTB = '22222222-2222-4222-2222-222222222222';
        const expectedState = {
            anxt: initialPTB,
            action: 'click',
            productData: '{"pageLoad":1}',
        };

        UnifiedLogging.init({
            url: 'http://dfdevpixel2.df.jabodo.com/tr.gif',
            data: {
                anxt: initialPTB,
            },
        });

        UnifiedLogging.track(EventMap.uiControl({}));

        expect(Anemone.logEvent).toBeCalledWith('UIControl', expectedState);

        UnifiedLogging.setPTB(updatedPTB);

        UnifiedLogging.track(EventMap.uiControl({}));

        expect(Anemone.logEvent).toBeCalledWith('UIControl', {
            ...expectedState,
            anxt: updatedPTB,
        });
    });
});
