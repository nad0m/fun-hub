module.exports = function (plop) {
  // plop generator code
  plop.setGenerator('create-component', {
    description: 'Create a functional react component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the component? (kebab-case)',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'client/src/components/{{name}}/index.ts',
        templateFile: 'plop/templates/client/create-component-index.hbs',
      },
      {
        type: 'add',
        path: 'client/src/components/{{name}}/{{name}}.tsx',
        templateFile: 'plop/templates/client/create-component.hbs',
      },
      {
        type: 'add',
        path: 'client/src/components/{{name}}/{{name}}.module.css',
        templateFile: 'plop/templates/client/create-component-css-modules.hbs',
      },
      {
        type: 'add',
        path: 'client/src/components/{{name}}/{{name}}.story.tsx',
        templateFile: 'plop/templates/client/create-component-storybook.hbs',
      },
      {
        type: 'append',
        path: 'client/src/components/index.ts',
        templateFile: 'plop/templates/client/create-component-index.hbs',
        separator: '',
      },
    ],
  })

  plop.setGenerator('create-game', {
    description: 'Create a new Fun Hub Game',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the game? (Title Case Name)',
      },
    ],
    actions: [
      // /game templates
      {
        type: 'add',
        path: 'games/src/{{kebabCase name}}/index.ts',
        templateFile: 'plop/templates/games/create-game-index.hbs',
      },
      {
        type: 'add',
        path: 'games/src/{{kebabCase name}}/{{kebabCase name}}.ts',
        templateFile: 'plop/templates/games/create-game.hbs',
      },
      {
        type: 'append',
        path: 'games/src/index.ts',
        templateFile: 'plop/templates/games/create-game-index.hbs',
        separator: '',
      },
      // client templates
      // server templates
      {
        type: 'append',
        path: 'server/src/games.ts',
        templateFile: 'plop/templates/games/create-server-game-import.hbs',
        separator: '',
      },
    ],
  })
}
