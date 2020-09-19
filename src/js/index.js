import uniqid from 'uniqid';
import '../../resources/sass/main.scss';
import '../../resources/icons/add.svg';
import '../../resources/icons/calendar.svg';
import '../../resources/icons/total.svg';
import '../../resources/icons/edit.svg';
import '../../resources/icons/delete.svg';
import '../../resources/icons/sign-out.svg';

//EXPENSES CONTROLLER
var expensesController = (function() {
    var state = {
        cards: [] //Save card objects
    };

    //Public methods
    return {
        fetchDataCards: function() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://financify-c7c89.firebaseio.com/cards.json', true);
            xhr.responseType = 'json';
            xhr.send();
            
            xhr.onload = function() {
                if(xhr.status != 200) {
                    console.log('Error ' + xhr.status + '+' + xhr.statusText);
                } else {
                    console.log(xhr.response);
                }
            }
            xhr.onerror = function() {
                console.log("Something went wrong");
            }
        },

        sendDataCards: function() {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://financify-c7c89.firebaseio.com/cards.json', true);
            xhr.responseType = 'json';
            var objTest = {
                date: new Date().getTime(),
                name: 'Edgar',
                expenses: ['lidl', '145€']
            };
            xhr.send(JSON.stringify(objTest));
            
            xhr.onload = function() {
                if(xhr.status != 200) {
                    console.log('Error ' + xhr.status + '+' + xhr.statusText);
                } else {
                    console.log(xhr.response);
                }
            }
            xhr.onerror = function() {
                console.log("Something went wrong");
            }
        },

        createCardID: function() {
            return uniqid('card-');
        },

        createCellID: function() {
            return uniqid('cell-');
        },

        storeCardID: function(id) {
            state.cards.push(id);
        }
    };
})();

//UI CONTROLLER
var UIController = (function() {
    //Dictionary for DOM elements
    var DOMStrings = {
        calendar: '.btn__calendar',
        addCard: '.btn__add-card',
        signOut: '.btn__sign-out',
        editCardName: '.icon__edit-name',
        deleteCard: '.icon__delete-card',
        addCardCell: '.icon__add-cell',
        editCardCell: '.icon__edit-cell',
        deleteCardCell: '.icon__delete-cell',
        totalExpenses: '.total__expenses',
        contentItems: '.content__items',
        cardList: '.card__list',
        navigation: '#navigation',
        card: '.card'
    }

    //Public methods
    return {
        getDOMStrings: function() {
            return DOMStrings;
        },

        getAllCards: function() {
            var cardsArray = document.querySelectorAll(DOMStrings.card);
            return cardsArray;
        },

        addCard: function(id) {
            var markup = 
            '<div id="{{id}}" class="card">' +
                '<div class="card__header">' +
                    '<input id="input-name-js" type="text" class="card__name" placeholder="Date"></input>' +
                    '<img id="btn-edit-name-js" class="icon icon__edit-name" src="/resources/icons/edit.svg" title="Edit Name" alt="Edit Name">' +
                    '<img id="btn-delete-card-js" class="icon icon__delete-card" src="/resources/icons/delete.svg" title="Delete Card" alt="Delete Card">' +
                    '<img id="btn-add-cell-js" class="icon icon__add-cell" src="/resources/icons/add.svg" title="Add Cell" alt="Add Cell">' +
                '</div>' +
                '<div class="card__list">' +
                '</div>' +
                '<div class="card__footer">' +
                    '<div class="card__expended text-bold">Expenses: <span id="total-amount">{{787}}</span></div>' +
                '</div>' +
            '</div>';

            var newMarkup = markup.replace('{{id}}', id);
            document.querySelector(DOMStrings.contentItems).insertAdjacentHTML('beforeend', newMarkup);
        },

        addCardCell: function(id, event) {
            var markup = 
            '<div id="{{id}}" class="card__cell"><input id="input-concept-js" type="text" placeholder="Concept" class="card__concept"></input>' +
            '<input id="input-amount-js" type="number" placeholder="Amount" class="card__amount"></input>' +
            '<img btn="btn-edit-cell-js" class="icon icon__edit-cell" src="/resources/icons/edit.svg" title="Edit Cell" alt="Edit Cell">' +
            '<img btn="btn-delete-cell-js" class="icon icon__delete-cell" src="/resources/icons/delete.svg" title="Delete Cell" alt="Delete Cell"></div>';

            var newMarkup = markup.replace('{{id}}', id);
            event.target.parentNode.parentNode.childNodes[1].insertAdjacentHTML('beforeend', newMarkup);
        },

        deleteCard: function(event) {
            event.target.closest('.card').remove();
        }
    };

})();

//APP CONTROLLER
var appController = (function(expensesCtrl, UICtrl){
    var DOMStrings = UICtrl.getDOMStrings();
    var parentContainer = document.querySelector(DOMStrings.contentItems);

    function setupEventListeners() {
        document.querySelector(DOMStrings.addCard).addEventListener('click', CtrlAddCard);  
        parentContainer.addEventListener('click', function(event) {
        var itemID = event.target.id;
        switch (itemID) {
            case 'btn-delete-card-js':
                CtrlDeleteCard(event);
                break;
            case 'btn-add-cell-js':
                CtrlAddCardCell(event);
                break;
            case 'btn-delete-cell-js':
                CtrlDeleteCardCell(event);
                break;
            case 'btn-edit-cell-js':
                CtrlEditCardCell(event);
                break;
            case 'btn-edit-name-js':
                CtrlEditCardName(event);
                break;
            default:
                break;
        }
        });
    }

    //Main Actions
    var CtrlAddCard = function() {
        console.log("addCard");

        //Creates an unique id for the card
        var id = expensesCtrl.createCardID();

        //Saves the card id 
        expensesCtrl.storeCardID(id);

        //Adds the card to the UI
        UICtrl.addCard(id);

        //setupEventListeners();
    }

    var CtrlDeleteCard = function(event) {
        console.log("deleteCard");

        //Remove the card from the UI
        UICtrl.deleteCard(event);
    }

    var CtrlAddCardCell = function(event) {
        console.log("addCardCell");
        
        var id = expensesCtrl.createCellID();

        //Add the cell to the UI
        UICtrl.addCardCell(id, event);
    }

    var CtrlDeleteCardCell = function() {
        console.log("deleteCardCell");
    }

    var CtrlEditCardCell = function() {
        console.log("editCardCell");
    }

    var CtrlEditCardName = function() {
        console.log("editCardName");
    }

    //Public methods
    return {
        init: function() {
            setupEventListeners();
            //expensesController.fetchDataCards();
            expensesController.sendDataCards();
        }
    };

})(expensesController, UIController);

appController.init();