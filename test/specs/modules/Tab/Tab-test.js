import React from 'react'

import Tab from 'src/modules/Tab/Tab'
import TabPane from 'src/modules/Tab/TabPane'
import * as common from 'test/specs/commonTests'
import { sandbox } from 'test/utils'

describe('Tab', () => {
  common.isConformant(Tab)
  common.hasSubComponents(Tab, [TabPane])

  const panes = [
    { menuItem: 'Tab 1', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
    { menuItem: 'Tab 2', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
    { menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  ]

  describe('menu', () => {
    it('defaults to an attached tabular menu', () => {
      Tab.defaultProps
        .should.have.property('menu')
        .which.deep.equals({ attached: true, tabular: true })
    })

    it('passes the props to the Menu', () => {
      shallow(<Tab menu={{ 'data-foo': 'bar' }} />)
        .find('Menu')
        .should.have.props({ 'data-foo': 'bar' })
    })

    it('has an item for every menuItem in panes', () => {
      const items = shallow(<Tab panes={panes} />)
        .find('Menu')
        .shallow()
        .find('MenuItem')

      items.should.have.lengthOf(3)
      items.at(0).shallow().should.contain.text('Tab 1')
      items.at(1).shallow().should.contain.text('Tab 2')
      items.at(2).shallow().should.contain.text('Tab 3')
    })

    it('renders above the pane by default', () => {
      const wrapper = shallow(<Tab panes={panes} />)

      wrapper.childAt(0).should.match('Menu')
      wrapper.childAt(1).shallow().should.match('Segment')
    })

    it("renders below the pane when attached='bottom'", () => {
      const wrapper = shallow(<Tab menu={{ attached: 'bottom' }} panes={panes} />)

      wrapper.childAt(0).shallow().should.match('Segment')
      wrapper.childAt(1).should.match('Menu')
    })
  })

  describe('activeIndex', () => {
    it('is passed to the Menu', () => {
      const wrapper = mount(<Tab panes={panes} activeIndex={123} />)

      wrapper
        .find('Menu')
        .should.have.prop('activeIndex', 123)
    })

    it('is set when clicking an item', () => {
      const wrapper = mount(<Tab panes={panes} />)

      wrapper
        .find('.active.tab')
        .should.contain.text('Tab 1 Content')

      wrapper
        .find('MenuItem')
        .at(1)
        .simulate('click')

      wrapper
        .find('.active.tab')
        .should.contain.text('Tab 2 Content')
    })

    it('can be set via props', () => {
      const wrapper = mount(<Tab panes={panes} activeIndex={1} />)

      wrapper
        .find('.active.tab')
        .should.contain.text('Tab 2 Content')

      wrapper
        .setProps({ activeIndex: 2 })
        .find('.active.tab')
        .should.contain.text('Tab 3 Content')
    })

    it('determines which pane render method is called', () => {
      const activeIndex = 1
      const props = { activeIndex, panes }
      sandbox.spy(panes[activeIndex], 'render')

      shallow(<Tab {...props} />)

      panes[activeIndex].render.should.have.been.calledOnce()
      panes[activeIndex].render.should.have.been.calledWithMatch(props)
    })
  })

  describe('onTabChange', () => {
    it('is called with (e, { activeIndex, ...props }) a menu item is clicked', () => {
      const activeIndex = 1
      const spy = sandbox.spy()
      const event = { fake: 'event' }
      const props = { onTabChange: spy, panes }

      mount(<Tab {...props} />)
        .find('MenuItem')
        .at(activeIndex)
        .simulate('click', event)

      // Since React will have generated a key the returned tab won't match
      // exactly so match on the props instead.
      spy.should.have.been.calledOnce()
      spy.should.have.been.calledWithMatch(event, { activeIndex, ...props })
    })
  })
})
