#!/usr/bin/env node
import { existsSync, readFileSync } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Log } from './libs/log.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log('__dirname', __dirname);
const CONFIG_FILE_NAME = 'cmd-scripts.ts';
/**
 * 通过提供的方法配置，能带来更好的 typescript 体验
 * @param  {ConfigType} config
 * @returns IDefineNTSConfig
 */
export const defineNTSConfig = (config) => config;
(async () => {
    const configFile = path.resolve(CONFIG_FILE_NAME);
    const isExit = existsSync(configFile);
    if (!isExit) {
        Log.error('配置文件不存在');
    }
    // const Conf = await import(configFile)
    let content = readFileSync(configFile);
    console.log(content.toString());
    // TOTO写入一个ts文件配置再重新读取
    //
})();
class Nts {
    constructor() {
        //
    }
    init() {
        //
    }
    parseUserConfig() {
        //
    }
    executeCmd() {
        //
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBUyxZQUFZLEVBQUUsTUFBTSxJQUFJLENBQUE7QUFDcEQsT0FBTyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUE7QUFDcEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUNuQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBRW5DLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBRXpELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBRW5DLE1BQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUE7QUFjekM7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxDQUFDLE1BQXdCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FHbEU7QUFBQSxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ1gsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBQ2pELE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNyQyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtLQUNyQjtJQUNELHdDQUF3QztJQUN4QyxJQUFJLE9BQU8sR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUMvQixzQkFBc0I7SUFDdEIsRUFBRTtBQUNKLENBQUMsQ0FBQyxFQUFFLENBQUE7QUFFSixNQUFNLEdBQUc7SUFDUDtRQUNFLEVBQUU7SUFDSixDQUFDO0lBRUQsSUFBSTtRQUNGLEVBQUU7SUFDSixDQUFDO0lBRUQsZUFBZTtRQUNiLEVBQUU7SUFDSixDQUFDO0lBRUQsVUFBVTtRQUNSLEVBQUU7SUFDSixDQUFDO0NBQ0YifQ==