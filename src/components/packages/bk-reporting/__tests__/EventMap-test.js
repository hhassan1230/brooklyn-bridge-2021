jest.autoMockOff();
const EventMap = require('../src/EventMap').default;

describe('EventMap', () => {
    it('oldToolbarButtonClick with valid params returns correct data', () => {
        expect(EventMap.oldToolbarButtonClick({
            position: 'test_position',
        })).toEqual({
            appId: 'CAPToolbarButtons',
            eventName: 'ButtonClick',
            position: 'test_position',
        });
    });

    it('oldToolbarButtonClick with invalid params throws error', () => {
        expect(() => {
            EventMap.oldToolbarButtonClick();
        }).toThrow();
    });

    it('oldPageView returns correct data', () => {
        expect(EventMap.oldPageView()).toEqual({
            appId: 'CAPSearch',
            eventName: 'TabPageView',
        });
    });

    it('oldConfigRequests with valid params returns correct data', () => {
        expect(EventMap.oldConfigRequests({
            toolbarVersion: 'test_anxtv',
            fParameter: 'test_fParameter',
            coid: 'test_coid',
        })).toEqual({
            appId: 'CAPOne',
            eventName: 'ToolbarConfig',
            anxtv: 'test_anxtv',
            fParameter: 'test_fParameter',
            coid: 'test_coid',
        });
    });

    it('oldConfigRequests with invalid params throws error', () => {
        expect(() => {
            EventMap.oldConfigRequests();
        }).toThrow();
    });

    it('configRequests with valid params returns correct data', () => {
        expect(EventMap.configRequests({
            productData: {
                test: 'test',
            },
        })).toEqual({
            eventName: 'Heartbeat',
            buid: undefined,
            productData: {
                test: 'test',
            },
        });
    });

    it('configRequests with invalid params not throws error', () => {
        expect(() => {
            EventMap.configRequests();
        }).not.toThrow();
    });

    it('oldConfigRequests with invalid params throws error', () => {
        expect(() => {
            EventMap.oldConfigRequests();
        }).toThrow();
    });

    it('toolbarButtonClick with valid params returns correct data', () => {
        expect(EventMap.toolbarButtonClick({
            label: 'test_label',
            type: 'test_type',
            icon: 'test_icon',
            zone: 'test_zone',
            group: 'test_group',
            position: 'test_position',
            productData: {
                test: 'test',
            },
            source: 'test_source',
        })).toEqual({
            buid: undefined,
            eventName: 'UIControl',
            label: 'test_label',
            name: 'test_label',
            controlID: 'test_label',
            type: 'test_type',
            icon: 'test_icon',
            zone: 'test_zone',
            action: 'click',
            group: 'test_group',
            position: 'test_position',
            uitype: 'button',
            anxs: 'toolbar',
            productData: {
                test: 'test',
            },
            source: 'test_source',
        });
    });

    it('toolbarButtonClick with invalid params not throws error', () => {
        expect(() => {
            EventMap.toolbarButtonClick();
        }).not.toThrow();
    });

    it('chicletButtonClick with valid params and no additionalTrackingParams returns correct data', () => {
        expect(EventMap.chicletButtonClick({
            label: 'test_label',
            type: 'test_type',
            icon: 'test_icon',
            zone: 'test_zone',
            group: 'test_group',
            position: 'test_position',
            productData: {
                test: 'test',
            },
            source: 'test_source',
        })).toEqual({
            buid: undefined,
            eventName: 'UIControl',
            label: 'test_label',
            name: 'test_label',
            controlID: 'test_label',
            type: 'test_type',
            icon: 'test_icon',
            zone: 'test_zone',
            action: 'click',
            group: 'test_group',
            position: 'test_position',
            uitype: 'chiclet',
            anxs: 'chiclets',
            productData: {
                test: 'test',
            },
            source: 'test_source',
        });
    });

    it('chicletButtonClick with invalid params and no additionalTrackingParams not throws error', () => {
        expect(() => {
            EventMap.chicletButtonClick();
        }).not.toThrow();
    });

    it('chicletButtonClick with valid params and valid additionalTrackingParams returns correct data', () => {
        expect(EventMap.chicletButtonClick({
            label: 'test_label',
            type: 'test_type',
            icon: 'test_icon',
            zone: 'test_zone',
            group: 'test_group',
            position: 'test_position',
            productData: {
                test: 'test',
            },
            source: 'test_source',
        }, {
            label: 'new_label',
        })).toEqual({
            buid: undefined,
            eventName: 'UIControl',
            label: 'new_label',
            name: 'new_label',
            controlID: 'new_label',
            type: 'test_type',
            icon: 'test_icon',
            zone: 'test_zone',
            action: 'click',
            group: 'test_group',
            position: 'test_position',
            uitype: 'chiclet',
            anxs: 'chiclets',
            productData: {
                test: 'test',
            },
            source: 'test_source',
        });
    });

    it('searchButtonClick with valid params returns correct data', () => {
        expect(EventMap.searchButtonClick({
            label: 'Search',
            source: 'pre-rendered search box',
            type: 'Input',
            zone: 'pre-rendered page',
            action: 'term',
            anxs: 'pre-rendered page',
            uitype: 'center-search',
        })).toEqual({
            buid: undefined,
            eventName: 'UIControl',
            label: 'Search',
            name: 'Search',
            controlID: 'Search',
            type: 'Input',
            icon: undefined,
            zone: 'pre-rendered page',
            action: 'term',
            group: undefined,
            position: undefined,
            uitype: 'center-search',
            anxs: 'pre-rendered page',
            productData: {},
            source: 'pre-rendered search box',
        });
    });

    it('searchButtonClick with invalid params not throws error', () => {
        expect(() => {
            EventMap.searchButtonClick();
        }).not.toThrow();
    });

    it('info with valid params returns correct data', () => {
        expect(EventMap.info({
            type: 'test_type',
            productData: {
                test: 'test',
            },
        })).toEqual({
            eventName: 'Info',
            type: 'test_type',
            productData: {
                test: 'test',
            },
            buid: undefined,
        });
    });

    it('info with invalid params not throws error', () => {
        expect(() => {
            EventMap.info();
        }).not.toThrow();
    });

    it('error with valid params returns correct data', () => {
        expect(EventMap.error({
            type: 'test_type',
            productData: {
                test: 'test',
            },
        })).toEqual({
            eventName: 'Error',
            type: 'test_type',
            productData: {
                test: 'test',
            },
            buid: undefined,
        });
    });

    it('error with invalid params not throws error', () => {
        expect(() => {
            EventMap.error();
        }).not.toThrow();
    });

    it('pageView with valid params returns correct data', () => {
        expect(EventMap.pageView({
            productData: {
                test: 'test',
            },
        })).toEqual({
            eventName: 'PageView',
            productData: {
                test: 'test',
            },
            buid: undefined,
        });
    });

    it('pageView with invalid params not throws error', () => {
        expect(() => {
            EventMap.pageView();
        }).not.toThrow();
    });

    it('dialogView with valid params returns correct data', () => {
        expect(EventMap.dialogView({
            section: 'test_section',
            productData: {
                test: 'test',
            },
        })).toEqual({
            eventName: 'DialogView',
            anxs: 'test_section',
            productData: {
                test: 'test',
            },
            buid: undefined,
        });
    });

    it('dialogView with invalid params not throws error', () => {
        expect(() => {
            EventMap.dialogView();
        }).not.toThrow();
    });
});
