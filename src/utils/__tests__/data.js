import { formatValueString, makeValueSpan } from '../data';

describe('formatValueString', () => {
    test('replace simple pin', () => {
        expect(formatValueString(33.333, 'foo')).toEqual('foo');
        expect(formatValueString(33.333, 'foo/pin/')).toEqual(`foo${makeValueSpan('33.333')}`);
        expect(formatValueString(33.333, 'foo/pin/bar')).toEqual(`foo${makeValueSpan('33.333')}bar`);
    });
    test('replace pin.', () => {
        expect(formatValueString(33.333, 'foo')).toEqual('foo');
        expect(formatValueString(33.333, 'foo/pin./')).toEqual(`foo${makeValueSpan('33')}`);
        expect(formatValueString(33.333, 'foo/pin./bar')).toEqual(`foo${makeValueSpan('33')}bar`);
    });
    test('replace pin.[#]*', () => {
        expect(formatValueString(33.333, 'foo')).toEqual('foo');
        expect(formatValueString(33.333, 'foo/pin.#/')).toEqual(`foo${makeValueSpan('33.3')}`);
        expect(formatValueString(33.333, 'foo/pin.##/')).toEqual(`foo${makeValueSpan('33.33')}`);
        expect(formatValueString(33.333, 'foo/pin.#/bar')).toEqual(`foo${makeValueSpan('33.3')}bar`);
        expect(formatValueString(33.333, 'foo/pin.##/bar')).toEqual(`foo${makeValueSpan('33.33')}bar`);
    });
    test('replace pin.[many#]*', () => {
        expect(formatValueString(33.333, 'foo/pin.#####/')).toEqual(`foo${makeValueSpan('33.33300')}`);
    });
    test('another pinExpression', () => {
        expect(formatValueString(33.333, 'foo/super_pin/bar')).toEqual(`foo/super_pin/bar`);
        expect(formatValueString(33.333, 'foo/super_pin/bar', 'super_pin')).toEqual(`foo${makeValueSpan('33.333')}bar`);
    });
});
