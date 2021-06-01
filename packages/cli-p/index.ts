import { Plugin, PluginsAPI, QuestionCollection } from '@pokemonon/tpl-cli';

class PresetTpl extends Plugin {
    apply(api: PluginsAPI) {
        api.render('./template');
    }

    static setPrompts(): QuestionCollection {
        return [
            {
                type: 'list',
                name: 'type',
                choices: ['preset', 'plugin'],
                message: '请选择创建的类型',
            },
            {
                type: 'input',
                name: 'description',
                message: '请输入项目的描述信息',
            },
        ];
    }
}

export default PresetTpl;