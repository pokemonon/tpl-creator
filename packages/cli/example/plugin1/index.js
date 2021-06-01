const { Plugin } = require('../../dist');
class MyPlugin extends Plugin {
    apply(api) {
        api.render('./template');
    }

    static setPrompts() {
        return [
            {
                type: 'input',
                message: 'input a description',
                name: 'description',
            },
        ];
    }
}

module.exports = MyPlugin;