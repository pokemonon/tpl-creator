class Preset {
    static setPrompts(api) {
        return [
            {
                type: 'list',
                name: 'language',
                message: 'choose one language',
                choices: [
                    'html',
                    'css',
                    'javascript',
                ],
            },
        ];
    }
    apply(api) {
        return {
            plugins: [
                require('../plugin1'),
            ],
        };
    }
}

module.exports = Preset;