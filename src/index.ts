import "./index.scss";

// This file will initialise the application

window.addEventListener("DOMContentLoaded", // This waits for the document to load before changing the page.
    (e: Event) => { initialiseApp(e) },
    false
);

function initialiseApp(_event: Event): void { // This is the function that will be called when the document loads.

    interface EventDict {
        [key: string]: Function; // This is a dictionary of events and functions.
    }

    interface StyleDict {
        [key: string]: string; // This is a dictionary of styles and their values.
    }

    interface PropertiesDict {
        [key: string]: string | number | boolean; // This is a dictionary of styles and their values.
    }

    class MyElement { // Base element class, it's called MyElement because it would conflict with the inbuilt Element class.
        name: string; // This is the name of the element, might not serve much purpose besides organisation
        type: string; // The actual element this will be
        innerHTML!: string; // This is what will be inside the element. It's a string but should be HTML.
        className: string; // The class
        events: EventDict; // Any events that will be added to the element.
        properties: PropertiesDict; // Any properties that will be added to the element.
        styling: StyleDict; // Any styling

        generateElement(placeElement?: string): HTMLElement {
            // This will generate the element, check for any events and styling and add them. It also adds the innerHTML. It will also return the element.
            let element: HTMLElement = document.createElement(this.type);
            if (this.innerHTML) element.innerHTML = this.innerHTML;
            if (this.className) element.classList.add(this.className);

            if (this.properties) for (let property in this.properties) {
                element[property] = this.properties[property];
            }

            if (this.events) for (let event in this.events) {
                element.addEventListener(event, () => this.events[event]());
            }

            if (this.styling) for (let style in this.styling) {
                element.style[style] = this.styling[style];
            }

            if (placeElement) { // This bit will place the element in the correct place. It takes the argument placeElement, a string, and uses it as a querySelector. If it's not specified, it'll just return the element without placing it.
                document.querySelector(placeElement).appendChild(element);
            }

            return element;
        }

        constructor(name: string, type: string, innerHTML: string, className?: string, events?: EventDict, properties?: PropertiesDict, styling?: StyleDict) {
            this.name = name;
            this.type = type;
            this.innerHTML = innerHTML;
            this.className = className;
            this.events = events;
            this.properties = properties;
            this.styling = styling;
        }
    }

    class Button extends MyElement { // Button class, used for generic buttons
        name: string;
        text: string;
        func: Function;
        enabled: boolean = false;

        toggle(): void {
            this.enabled = !this.enabled;
        }

        constructor(name: string, text: string, enabled: boolean, func: Function, className?: string, events?: EventDict, styling?: StyleDict) {
            events = { ...events, "click": func };
            super(name, "button", text, className, events, {
                disabled: !enabled
            }, styling);
            this.name = name;
            this.text = text;
            this.func = func;
            this.enabled = enabled;
        }
    }

    type PositionedWidget = { // positioned widget type. This is used for widgets that are positioned relative to the screen.
        pos: [number, number]; // x and y position. I store them in two-value tuple to make it easier to work with, and because it's better for memory
        widget: Button | string; // widget to be displayed, either a button or a string.
    };

    class Menu extends MyElement { // My menu class, which will be used to create a menu. 
        name: string; // unneeded for now
        private title!: string; // The title of the menu
        private description!: string; // the description
        private widgets: (PositionedWidget)[]; // all the widgets to pass, talked about above

        generateElement(): HTMLElement {

            let menuContainer: HTMLElement = super.generateElement("#menu"); // This will generate the menu container, and place it in the correct place.
            menuContainer.classList.add("menuContainer");

            let menu: HTMLElement = document.createElement('div');
            menu.classList.add("actualMenu");

            // create text 
            let title: HTMLElement = document.createElement('div');
            title.innerText = this.title;

            // create description
            let description: HTMLElement = document.createElement('div');
            description.innerText = this.description;
            menuContainer.appendChild(title);
            menuContainer.appendChild(description);

            let positionedWidgets: PositionedWidget[][] = [];

            this.widgets.forEach((widget: PositionedWidget) => {
                if (!positionedWidgets[widget.pos[1]]) {
                    positionedWidgets[widget.pos[1]] = [];
                }
                positionedWidgets[widget.pos[1]][widget.pos[0]] = widget;
            });


            // find largest X in positionedWidgets
            console.log(this.widgets)

            const largestX = this.widgets.reduce(function (prev, current) {
                return (prev.pos[0] > current.pos[0]) ? prev : current
            }).pos[0];

            // find largest Y in positionedWidgets
            const largestY = this.widgets.reduce(function (prev, current) {
                return (prev.pos[1] > current.pos[1]) ? prev : current
            }).pos[1];

            console.log([largestX, largestY]);

            // loop how many times we need to create a row
            for (let i = 1; i < positionedWidgets.length; i++) {
                console.log(i)
                let row: HTMLElement = document.createElement('div');
                row.classList.add("row");

                // loop how many times we need to create a column in the row

                for (let j = 1; j < (largestX + 1); j++) {

                    let cell: HTMLElement = document.createElement('div');
                    cell.classList.add("column", `x${j}`, `y${i}`);
                    row.appendChild(cell);
                }


                menu.appendChild(row);

            }

            positionedWidgets.map((row: PositionedWidget[], i: number) => {
                row.map((widget: PositionedWidget, j: number) => {
                    if (widget) {
                        let position: string = (`.x${j}.y${i}`);
                        console.log(position)

                        let currentWidget = widget.widget;
                        if (currentWidget instanceof Button) {
                            menu.querySelector(position).appendChild(currentWidget.generateElement());
                        } else {
                            // create div and append text
                            let div: HTMLElement = document.createElement('div');
                            div.innerText = currentWidget;
                            console.log(position)
                            console.log(menu)
                            menu.querySelector(position).appendChild(div);
                        }
                    }
                }
                )
            })

            menuContainer.appendChild(menu);

            // document.querySelector("#menu").appendChild(menuContainer);

            return menu;

        }

        constructor(name: string, title: string, description: string, widgets: (PositionedWidget)[], className?: string, events?: EventDict, styling?: StyleDict) {
            super(name, "div", "", "menu", events, styling);
            this.name = name;
            this.title = title;
            this.description = description;
            this.widgets = widgets;
            this.className = className;
            this.events = events;
            this.styling = styling;
        }
    }

    var menus = {
        main: new Menu("main", "Main Menu", "This is the main menu", [

            {
                pos: [1, 1],
                widget: new Button("start", "Start", true, () => {
                    console.log("start");
                })
            },
            {
                pos: [2, 1],
                widget: new Button("start", "Start", true, () => {
                    console.log("start");
                })
            },
            {
                pos: [2, 2],
                widget: new Button("start", "Start", false, () => {
                    console.log("start");
                }, "button2")
            }
        ]),
    };




    document.querySelector("#menu").appendChild(menus.main.generateElement());

}
