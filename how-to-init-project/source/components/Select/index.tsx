/*
 * Description: 
 * Created: 2023-06-12 17:41:09
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-06-12 18:46:42
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */

import React, { useState } from 'react';
import { render, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { TSelectOptions } from '../../config.js';

interface ISelect {
  options: TSelectOptions
  onChange: (value: string) => void
  visible: boolean
}

const Select = (props: ISelect) => {

  const { options, onChange, visible } = props

  const [isFocused, setIsFocused] = useState<boolean>(true)
  const handleSelect = (item: any) => {
    // `item` = { label: 'First', value: 'first' }
    // console.log(item);
    // setIsFocused(false)
    typeof onChange === 'function' && onChange(item.value)
  };



  return <SelectInput isFocused={visible} items={options} onSelect={handleSelect} itemComponent={(item) => {
    return <Text color={'cyan'}>{item.label}</Text>
  }} />;
};

export default Select

