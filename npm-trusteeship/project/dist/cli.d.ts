#!/usr/bin/env node
export interface IDefineNTSConfig {
    scripts: {
        /**
         * 脚本
         */
        cmd: string;
        /**
         * 描述
         */
        desc: string;
    }[];
}
/**
 * 通过方法的方式配置，能带来更好的 typescript 体验
 * @param  {ConfigType} config
 * @returns IDefineNTSConfig
 */
export declare const defineNTSConfig: (config: IDefineNTSConfig) => IDefineNTSConfig;
