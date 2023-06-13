import React, { useEffect, useState } from 'react';
import { Box, Newline, Text, useInput } from 'ink';
import Select from './components/Select/index.js';

import childProcess from 'node:child_process';

import { methodsOptions, TPlatform, TSelectOptions, TProjectType } from './config.js'
import { exec } from 'child_process';

type Props = {
  name: string | undefined;
};

type TSelectKey = 'platform' | 'projectType' | 'cmd'

export default function App(props: Props) {

  const [selectVisible, setSelectVisible] = useState<boolean>(false)

  const [currentSelectInfo, setCurrentSelectInfo] = useState<{
    key: TSelectKey
    options: TSelectOptions
  }>()

  const [targetInfo, setTargetInfo] = useState<{
    [key in TSelectKey]: string
  }>()

  useEffect(() => {

    const options = []

    for (const key in methodsOptions) {
      options.push({
        label: key,
        value: key
      })
    }

    setCurrentSelectInfo({
      key: 'platform',
      options
    })

    setSelectVisible(true)

  }, [])


  const setNextSelect = (currentKey: TSelectKey, value: string) => {
    const info = { ...targetInfo }

    const merged = {
      ...info,
      ...{
        [currentKey]: value
      }
    } as any

    setTargetInfo(merged)

    if (currentKey === 'platform') {
      const nextOptions = []
      for (const key in methodsOptions[value as TPlatform]) {
        if (key !== 'subDesc') {
          nextOptions.push({
            label: key,
            value: key
          })
        }

      }
      setCurrentSelectInfo({
        key: "projectType",
        options: nextOptions
      })
    }
    if (currentKey === 'projectType') {
      const nextOptions = []
      const { platform } = targetInfo || {}
      const cmds = methodsOptions[platform as TPlatform][value as keyof TProjectType]
      if (cmds) {
        for (const item of cmds) {
          nextOptions.push({
            label: `${item.desc}   (${item.cmd})`,
            value: item.cmd
          })
        }
      }
      setCurrentSelectInfo({
        key: 'cmd',
        options: nextOptions
      })
    }

    if (currentKey === 'cmd') {
      setSelectVisible(false)
      setCurrentSelectInfo(undefined)
      childProcess.exec(`echo hello world`, (err, sto) => {
        if (!err) {
          console.log(sto);
        }
      })
      handleExcuteScript(value)
    }
  }


  const handleExcuteScript = (script: string) => {
    console.log('将要执行的命令', script);
    childProcess.execSync(`${script}`);
    // setTimeout(() => {
    //   process.exit(0)
    // }, 200);
  }

  return (
    <>
      {currentSelectInfo && <Select visible={selectVisible} options={currentSelectInfo.options} onChange={(value) => {
        setNextSelect(currentSelectInfo.key, value)
      }} />}
    </>
  );
}

