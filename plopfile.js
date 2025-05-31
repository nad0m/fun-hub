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
}
