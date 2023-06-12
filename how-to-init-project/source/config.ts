/*
 * Description: 配置
 * Created: 2023-06-12 17:26:37
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-06-12 20:07:12
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */
export type TSelectOptions = {label: string; value: string}[];

export type TPlatform = 'umi@4' | 'vite' | 'bun';

export type TProjectType = {
	simple: TCmdInfo[];
	template?: TCmdInfo[];
	other?: TCmdInfo[];
};

export type TCmdInfo = {
	cmd: string;
	desc: string;
};

export type TInitMethod = {
	[key in TPlatform]: TProjectType;
};

const UMI_4: TProjectType = {
	simple: [
		{
			cmd: 'pnpm dlx create-umi@latest',
			desc: '用pnpm创建一个umi4的项目',
		},
		{
			cmd: 'bunx create-umi',
			desc: '用bunx创建一个umi4的项目',
		},
		{
			cmd: 'npx create-umi@latest',
			desc: '用npx创建一个umi4的项目',
		},
		{
			cmd: 'yarn create umi',
			desc: '用yarn创建一个umi4的项目',
		},
	],
	template: [
		{
			cmd: 'pnpm create umi --template electron',
			desc: '用pnpm创建一个umi-electron的项目',
		},
	],
	other: undefined,
};

const vite: TProjectType = {
	simple: [
		{
			cmd: 'npm create vite@latest',
			desc: '创建一个',
		},
		{
			cmd: 'yarn create vite',
			desc: '',
		},
		{
			cmd: 'pnpm create vite',
			desc: '',
		},
	],
	template: [
		{
			cmd: 'npm create vite@latest my-vue-app --template vue',
			desc: '创建一个vue项目，适用于npm@6',
		},
		{
			cmd: 'npm create vite@latest my-vue-app --template vue',
			desc: '创建一个vue项目，适用于npm@7',
		},
		{
			cmd: 'npm create vite@latest my-vue-app --template vue-ts',
			desc: '创建一个vue-ts项目，适用于npm@7',
		},
		{
			cmd: 'npm create vite@latest my-react-app --template react',
			desc: '创建一个react项目，适用于npm@7',
		},
		{
			cmd: 'npm create vite@latest my-react-ts-app --template react-ts',
			desc: '创建一个react-ts项目，适用于npm@7',
		},
	],
};

export const methodsOptions: TInitMethod = {
	'umi@4': UMI_4,
	vite: vite,
	bun: {
		simple: [],
		template: undefined,
		other: undefined,
	},
};
