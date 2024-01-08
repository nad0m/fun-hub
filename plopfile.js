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
        path: 'src/components/{{name}}/index.ts',
        templateFile: 'plop/templates/create-component-index.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.tsx',
        templateFile: 'plop/templates/create-component.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.story.tsx',
        templateFile: 'plop/templates/create-component-storybook.hbs',
      },
      {
        type: 'append',
        path: 'src/components/index.ts',
        templateFile: 'plop/templates/create-component-index.hbs',
        separator: '',
      },
    ],
  });
};
