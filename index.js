
const Item = require('./model/item.js');
const inquirer = require('inquirer');

function getItems() {
    let items = [
        new Item('ID1', 'Item 1', 'This is item 1', new Date(), 'SYSTEM'),
        new Item('ID2', 'Item 2', 'This is item 2', new Date(), 'SYSTEM'),
        new Item('ID3', 'Item 3', 'This is item 3', new Date(), 'SYSTEM')
    ]
    return items;
}

let items;

let optionsQuestion = [
    {
        name: "option",
        type: "list",
        message: 'Choose your option :',
        choices: [
            '1. Create new item',
            '2. Update existing item',
            '3. Read current items',
            '4. Delete one item',
            '-1. To exit'
        ],
        filter: function (val) {
            if (val.startsWith('-1')) {
                return '-1'
            } else {
                return val.charAt(0);
            }
        }

    }
];


const main = async () => {
    console.log('[Main] Started..');

    // Initialize item
    items = getItems();
    let isExit = false;

    while (!isExit) {
        const { ...answer } = await inquirer.prompt(optionsQuestion);

        switch (answer.option) {
            case '1':
                await createItem();
                break;
            case '2':
                await updateItem();
                break;
            case '3':
                readItem();
                break;
            case '4':
                await deleteItem();
                break;
            case '-1':
                isExit = true;
                break;
            default:
                console.log("Invalid option " + answer.option);
                break;
        }

    }

    console.log('[Main] Ended..')
}

let createItemQuestion = [
    {
        name: "id",
        type: "input",
        message: "ID : ",
        validate: function (val) {
            let isIdExist = items.find(item => item['id'] === val);

            if (isIdExist) {
                console.log(' --> Item with ID ' + val + ' already exist. Try again.')
                return false;
            } else {
                return true;
            }
        }
    },
    {
        name: "name",
        type: "input",
        message: "Name : "
    },
    {
        name: "description",
        type: "input",
        message: "Description : "
    }
]

async function createItem() {
    console.log('[Main] Create start');

    const { ...answer } = await inquirer.prompt(createItemQuestion);

    let newItem = new Item();
    newItem.id = answer.id;
    newItem.name = answer.name;
    newItem.description = answer.description;
    newItem.createdDate = new Date();
    newItem.createdBy = 'CURRENT_USER';

    items.push(newItem);
    console.log("Successfully create new item " + newItem);
    console.log('[Main] Create end');
}

function readItem() {
    console.log('[Main] Read start');

    if (items != null) {
        items.forEach(item => {
            console.log(item);
        });
    }

    console.log('[Main] Read end');
}

let getIdQuestion = [
    {
        name: "id",
        type: "input",
        message: "ID : "
    }
]

let updateItemQuestion2 = [
    {
        name: "name",
        type: "input",
        message: "Name : "
    },
    {
        name: "description",
        type: "input",
        message: "Description : "
    }
]

async function updateItem() {
    console.log('[Main] Update start');

    const { ...answer1 } = await inquirer.prompt(getIdQuestion);

    let isIdExist = items.find(item => item['id'] === answer1.id);
    if (!isIdExist) {
        console.log("Item with ID " + answer1.id + " does not exist.");
        return;
    }

    const { ...answer2 } = await inquirer.prompt(updateItemQuestion2);

    let selectedItem = items[items.findIndex(item => item.id == answer1.id)];
    selectedItem.name = answer2.name;
    selectedItem.description = answer2.description;
    selectedItem.updatedDate = new Date();
    selectedItem.updatedBy = 'CURRENT_USER';

    console.log('[Main] Update end');
}

async function deleteItem() {
    console.log('[Main] Delete start');
    const { ...answer1 } = await inquirer.prompt(getIdQuestion);

    let isIdExist = items.find(item => item['id'] === answer1.id);
    if (!isIdExist) {
        console.log("Item with ID " + answer1.id + " does not exist.");
        return;
    }

    let ids = [answer1.id];
    items = items.filter(item => !ids.includes(item.id));

    console.log("Successfully deleted " + answer1.id);
    console.log('[Main] Delete end');
}

/**
 * Ref : 
 * 1. http://www.penandpaperprogrammer.com/blog/2018/12/16/repeating-questions-with-inquirerjs
 * 2. https://medium.com/@tkssharma/writing-neat-asynchronous-node-js-code-with-promises-async-await-fa8d8b0bcd7c
 */
main();