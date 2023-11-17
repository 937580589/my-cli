import axios from 'axios';
import ora from 'ora';



export const prompts = [
  {
    type: "confirm",
    name: "isTemplate",
    message: "是否使用现有模版",
  },
  {
    when: (answers) => answers.isTemplate,
    type: "list",
    name: "template",
    message: "请选择模版",
    choices: async (answers)=> {
        
    },
  },
  {
    when: (answers) => !answers.isTemplate,
    type: "list",
    name: "language",
    message: "请选择新建项目的语言",
    choices: ["React", "Vue"],
  },
];

export const mapLanguage = {
  React: [
    'react',
    'react-dom'
  ],
  Vue: [
    'vue'
  ]
}