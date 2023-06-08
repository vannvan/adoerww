#!/usr/bin/env node
export interface IDefineNTSConfig {
    scripts: TCmdOpts;
    /**
     * 框架平台
     */
    platform?: 'vue' | 'react';
    /**
     * 构建工具
     */
    buildTool: 'vite' | 'webpack';
}
/**
 * 通过提供的方法配置，能带来更好的 typescript 体验
 * @param  {ConfigType} config
 * @returns IDefineNTSConfig
 */
export declare const defineNTSConfig: (config: IDefineNTSConfig) => IDefineNTSConfig;
