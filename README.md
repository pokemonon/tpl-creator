## Introduce
lerna负责发布管理，其他功能用yarn

## Usage

### manage packages
```
// 新增包
npx lerna create 
// or
npm init
// yarn
yarn create

// 删除包
rm -rf packages/<pkgName>
```


### manage dependencies
```
// 给root项目安装依赖
yarn add -W [flags] [packages ...]

// 给单个package安装依赖
yarn workspace <pkgName> add [flags] [packages ...]

// 多个package安装依赖
yarn workspaces foreach add [flags] [packages ...] // yarn2.0
// or
lerna add --scope '{pkgNames,...}' [packages ...]

// 多个package删除依赖
lerna exec --scope '{pkgNames,...}' npm uninstall [packages ...]
```

> 通过 `lerna exec` 执行多个package `yarn add/remove` 时，在link阶段会报错
```
EEXIST: file already exists, symlink
```

### package manage
```
// script执行
yarn workspaces run <command> // 所有
yarn workspace <pkgName> run <command> // 单个
lerna run --scope '{pkgNames,...}' <command> // 多个
```



## usual script

### clean
删除包的依赖
```
lerna clean
```

删除包的构建结果
```
yarn workspaces run clean

// add script to package e.g.
// "clean": "rimraf dist"
```

### build
- [ ] 构建顺序

### publish
https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html  
- [ ] 根据commit生成changeLog     
- [ ] commit规范 https://github.com/commitizen/cz-cli     