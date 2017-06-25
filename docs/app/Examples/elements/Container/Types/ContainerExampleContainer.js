import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { stateOptions } from '../../../modules/Dropdown/common'

const ContainerExampleContainer = () => (
  <Dropdown placeholder='State' fluid multiple search selection options={stateOptions} />
)

export default ContainerExampleContainer
