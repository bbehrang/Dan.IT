/**
 * Класс, объекты которого описывают параметры гамбургера.
 *
 * @constructor
 * @param size        Размер
 * @param stuffing    Начинка
 * @throws {HamburgerException}  При неправильном использовании
 */
function Hamburger(size, stuffing) {
    try{
        if(size && stuffing){
            if(size === Hamburger.SIZE_LARGE || size === Hamburger.SIZE_SMALL){
                this.size = size;
            }
            else{
                throw new Error("Invalid size");
            }
            if(stuffing === Hamburger.STUFFING_POTATO || stuffing === Hamburger.STUFFING_POTATO || stuffing === Hamburger.STUFFING_CHEESE){
                this.stuffing = stuffing;
            }
            else{
                throw new Error("Invalid stuffing");
            }
            this.topping = [];
        }
        else{
            throw new Error("Size and Stuffing must provided for the constructor function");
        }

    }
    catch(error){
        HamburgerException(error);
    }


}

/* Размеры, виды начинок и добавок */
Hamburger.SIZE_SMALL = "small";
Hamburger.SIZE_LARGE = "large";
Hamburger.STUFFING_CHEESE = "cheese";
Hamburger.STUFFING_SALAD =  "salad";
Hamburger.STUFFING_POTATO =  "potato";
Hamburger.TOPPING_MAYO =  "mayo";
Hamburger.TOPPING_SPICE =  "spice";

/**
 * Добавить добавку к гамбургеру. Можно добавить несколько
 * добавок, при условии, что они разные.
 *
 * @param topping     Тип добавки
 * @throws {HamburgerException}  При неправильном использовании
 */
Hamburger.prototype.addTopping = function (topping) {
    try{
        if(this.topping.indexOf(topping) == -1){
            this.topping.push(topping);
        }
        else{
            throw new Error("Topping already exists");
        }
    }
    catch (error){
        HamburgerException(error);
    }
};

/**
 * Убрать добавку, при условии, что она ранее была
 * добавлена.
 *
 * @param topping   Тип добавки
 * @throws {HamburgerException}  При неправильном использовании
 */
Hamburger.prototype.removeTopping = function (topping) {
    try{
        const index = this.topping.indexOf(topping);
        if(index !== -1) this.topping.splice(index, 1);
        else throw new HamburgerException("Topping does not exist");
    }
    catch(error){
        throw new HamburgerException(error);
    }


};

/**
 * Получить список добавок.
 *
 * @return {Array} Массив добавленных добавок, содержит константы
 *                 Hamburger.TOPPING_*
 */
Hamburger.prototype.getToppings = function () {
    return this.topping;
};

/**
 * Узнать размер гамбургера
 */
Hamburger.prototype.getSize = function () {
    return this.size;
};

/**
 * Узнать начинку гамбургера
 */
Hamburger.prototype.getStuffing = function () {
    return this.stuffing;
};

/**
 * Узнать цену гамбургера
 * @return {Number} Цена в тугриках
 */
Hamburger.prototype.calculatePrice = function () {
    let price = 0;

    if(this.size === Hamburger.SIZE_SMALL) price += 50;
    else if(this.size === Hamburger.SIZE_LARGE) price += 100;

    switch (this.stuffing) {
        case Hamburger.STUFFING_CHEESE :
            price += 10;
            break;
        case Hamburger.STUFFING_SALAD :
            price += 20;
            break;
        case Hamburger.STUFFING_POTATO :
            price += 15;
            break;

    }

    this.topping.forEach(top => {
        switch (top) {
            case  Hamburger.TOPPING_MAYO:
                price += 20;
                break;
            case Hamburger.TOPPING_SPICE:
                price += 15;
                break;
        }
    });

    return price;
};

/**
 * Узнать калорийность
 * @return {Number} Калорийность в калориях
 */
Hamburger.prototype.calculateCalories = function () {
    let calories = 0;

    if(this.size === Hamburger.SIZE_SMALL) calories += 20;
    else if(this.size === Hamburger.SIZE_LARGE) calories += 40;

    switch (this.stuffing) {
        case Hamburger.STUFFING_CHEESE :
            calories += 20;
            break;
        case Hamburger.STUFFING_SALAD :
            calories += 5;
            break;
        case Hamburger.STUFFING_POTATO :
            calories += 10;
            break;

    }

    this.topping.forEach(top => {
        switch (top) {
            case  Hamburger.TOPPING_MAYO:
                calories += 5;
                break;
        }
    });

    return calories;
};

/**
 * Представляет информацию об ошибке в ходе работы с гамбургером.
 * Подробности хранятся в свойстве message.
 * @constructor
 */
function HamburgerException (error) {
    console.log(error);
};


// маленький гамбургер с начинкой из сыра
const hamburger = new Hamburger(Hamburger.SIZE_SMALL, Hamburger.STUFFING_CHEESE);
// добавка из майонеза
hamburger.addTopping(Hamburger.TOPPING_MAYO);
// спросим сколько там калорий
console.log("Calories: %f", hamburger.calculateCalories());
// сколько стоит
console.log("Price: %f", hamburger.calculatePrice());
// я тут передумал и решил добавить еще приправу
hamburger.addTopping(Hamburger.TOPPING_SPICE);
// А сколько теперь стоит?
console.log("Price with sauce: %f", hamburger.calculatePrice());
// Проверить, большой ли гамбургер?
console.log("Is hamburger large: %s", hamburger.getSize() === Hamburger.SIZE_LARGE); // -> false
// Убрать добавку
hamburger.removeTopping(Hamburger.TOPPING_SPICE);
console.log("Have %d toppings", hamburger.getToppings().length); // 1


// не передали обязательные параметры
const h2 = new Hamburger(); // => HamburgerException: no size given

// передаем некорректные значения, добавку вместо размера
const h3 = new Hamburger(Hamburger.TOPPING_SPICE, Hamburger.TOPPING_SPICE);
// => HamburgerException: invalid size 'TOPPING_SAUCE'

// добавляем много добавок
const h4 = new Hamburger(Hamburger.SIZE_SMALL, Hamburger.STUFFING_CHEESE);
h4.addTopping(Hamburger.TOPPING_MAYO);
h4.addTopping(Hamburger.TOPPING_MAYO);
// HamburgerException: duplicate topping 'TOPPING_MAYO'

