import React from 'react';
import { shallow } from 'enzyme';
import { TemplateHelpers } from 'template-helpers';
import { passesAnyAttributeToChild } from 'simple-tests';
import { Alert } from './Alert.component';
import testIds from './Alert.test.ids.json';

describe('<Alert />', () => {
    let wrapper;
    let helpers;

    beforeEach(() => {
        wrapper = shallow(<Alert />);
        helpers = new TemplateHelpers(wrapper);
    });

    it('renders children', () => {
        const newProps = {
            children: 'test content',
        };
        wrapper.setProps(newProps);
        expect(helpers.getText(testIds.root)).toBe(newProps.children);
    });

    it('renders close buton when "toggle" prop is passed and fires callback when button is clicked', () => {
        const newProps = {
            onClose: jest.fn(),
        };
        wrapper.setProps(newProps);
        const closeBtn = helpers.get(testIds.close);
        expect(closeBtn.length).toBe(1);

        closeBtn.simulate('click');
        wrapper.update();
        expect(newProps.onClose).toHaveBeenCalled();
    });

    it('passes other attributes to root "div"', () => {
        expect(passesAnyAttributeToChild(wrapper, testIds.root)).toBeTruthy();
    });
});
