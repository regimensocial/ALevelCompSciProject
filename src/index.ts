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
        id: string; // This is the id of the element, MUST BE UNIQUE, used to identify the element and update it.
        type: string; // The actual element this will be
        _content!: string | MyElement; // This is what will be inside the element. It's a string but should be HTML.
        className: string; // The class
        events: EventDict; // Any events that will be added to the element.
        properties: PropertiesDict; // Any properties that will be added to the element.
        styling: StyleDict; // Any styling

        set content(content: string | MyElement) {
            this._content = content;
            
            this.generateElement(null, true);
        }

        get content(): string | MyElement {
            return this._content;
        }

        updateStyling(styling: StyleDict) { // This will update the styling of the element.
            this.styling = { ...this.styling, ...styling };
        }

        generateElement(placeElement?: string, rerender?: boolean): HTMLElement {
            // This will generate the element, check for any events and styling and add them. It also adds the innerHTML. It will also return the element.

            if (rerender && document.querySelectorAll("#" + this.id).length === 0) return; // If the element doesn't exist, don't do anything when trying to rerender.

            let element: HTMLElement = document.createElement(this.type);


            if (this.content && typeof this.content === "string") {
                element.innerHTML = this.content;
            } else if (this.content && typeof this.content === "object") {
                element.appendChild(this.content.generateElement());
            }

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

            console.log(this.id)
            console.log(document.getElementById(this.id))


            var newID = null;
            if (rerender && document.querySelectorAll("#" + this.id).length > 1) {
                
                // change id to random id
                newID = "conflict-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

                console.log("Conflict ID detected, id changed");
            }

            element.setAttribute("id", newID || this.id);

            if (rerender) {
                var target: Element = document.querySelectorAll(`#${this.id}`)[0];
                target.replaceWith(element);
                console.log(element)
                if (newID) this.id = newID;
                return;
            }

            if (placeElement) { // This bit will place the element in the correct place. It takes the argument placeElement, a string, and uses it as a querySelector. If it's not specified, it'll just return the element without placing it.
                document.querySelector(placeElement).appendChild(element);
            }

            return element;
        }

        constructor(data: {
            id: string;
            type: string;
            content?: string | MyElement;
            className?: string;
            events?: EventDict;
            properties?: PropertiesDict;
            styling?: StyleDict;
        }) { // This is the constructor, it takes the data as an argument, then sets the properties using it.
            this.id = data.id;
            this.type = data.type;
            this._content = data.content;
            this.className = data.className;
            this.events = data.events;
            this.properties = data.properties;
            this.styling = data.styling;
        }
    }

    interface State {
        [key: string]: any; // should be addressed by a string, can be any value
    }
    class MyElementWithState extends MyElement { // This is a class that extends MyElement, it's used to add state to the element.
        _state: State = {}; // Any data that will be added to the element.
        get state(): State {
            return this._state;
        }

        set state(state: State) {
            this._state = state;
            this.generateElement(null, true);
        }

        constructor(data: {
            id: string;
            type: string;
            content?: string | MyElement;
            className?: string;
            events?: EventDict;
            properties?: PropertiesDict;
            styling?: StyleDict;
            initialState?: object;
        }) { // This is the constructor, it takes the data as an argument, then sets the properties using it.
            super(data); // unnecessary passing of initialState, but it's easier to keep in.
            this._state = data.initialState;
        }

    }

    class Button extends MyElementWithState { // Button class, used for generic buttons
        id: string;
        text: string;
        func: Function;

        toggle(): void {
            this.state.disabled = !this.state.disabled;
            this.properties.disabled = this._state.disabled;
            this.generateElement(null, true);
        }

        constructor(data: {
            id: string;
            text: string;
            func: Function;
            className?: string;
            events?: EventDict;
            properties?: PropertiesDict;
            styling?: StyleDict;
            disabled?: boolean;
        }) { // This is the constructor, it takes the data as an argument, then sets the properties using it.
            data.events = data.events = { ...data.events, "click": data.func };
            super({
                id: data.id,
                type: "button",
                content: data.text,
                className: data.className,
                events: data.events,
                properties: { ...data.properties, disabled: data.disabled },
                styling: data.styling,
                initialState: { disabled: data.disabled }
            });
            this.id = data.id;
            this.text = data.text;
            this.func = data.func;
        }

    }

    type PositionedWidget = { // positioned widget type. This is used for widgets that are positioned relative to the screen.
        pos: [number, number]; // x and y position. I store them in two-value tuple to make it easier to work with, and because it's better for memory
        widget: MyElement | string; // widget to be displayed, either a button or a string.
    };

    class Menu extends MyElement { // My menu class, which will be used to create a menu. 
        id: string; // unneeded for now
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

            // create widgets
            for (let widget of this.widgets) {
                // check if widget is a button or a string
                if (typeof widget.widget === "string") {
                    let text: HTMLElement = document.createElement('div');
                    text.innerText = widget.widget;
                    menu.appendChild(text);
                } else {
                    var widgetToGen = widget.widget.generateElement();
                    // widgetToGen.style.position = "absolute";
                    // widgetToGen.style.left = widget.pos[0] + "px";
                    // widgetToGen.style.top = widget.pos[1] + "px";
                    menu.appendChild(widgetToGen);
                }
            }


            menuContainer.appendChild(menu);
            return menu;

        }

        constructor(data: {
            id: string;
            title: string;
            description: string;
            widgets: (PositionedWidget)[];
            className?: string;
            events?: EventDict;
            properties?: PropertiesDict;
            styling?: StyleDict;
        }) { // This is the constructor, it takes the data as an argument, then sets the properties using it.
            data.events = data.events = { ...data.events, "click": () => { } };
            super({
                id: data.id,
                type: "div",
                content: "",
                className: data.className,
                events: data.events,
                properties: data.properties,
                styling: data.styling
            });
            this.id = data.id;
            this.title = data.title;
            this.description = data.description;
            this.widgets = data.widgets;
        }
    }

    var exampleWidget: MyElementWithState = new MyElementWithState({
        id: "exampleWidget",
        type: "div",
        content: "Hi there!",
        className: "exampleWidget",
        events: { "click": () => { 
            exampleWidget.state.count = exampleWidget.state.count + 1; 
            console.log(exampleWidget.state) 
            exampleWidget.content = (exampleWidget.state.count).toString();
            console.log(exampleWidget.content)
        } },
        properties: {},
        styling: {},
        initialState: { count: 0 }
    });


    var menus = {
        main: new Menu({
            id: "main",
            title: "Main Menu",
            description: "This is the main menu",
            widgets: [
                {
                    pos: [0, 0],
                    widget: new Button({
                        id: "newGame",
                        text: "New Game",
                        func: () => {
                            console.log("new game");
                        }
                    })
                },
                {
                    pos: [0, 50],
                    widget: exampleWidget
                },
                {
                    pos: [0, 100],
                    widget: new Button({
                        id: "options",
                        text: "Options",
                        func: () => {
                            console.log("options");
                        }
                    })
                },
                {
                    pos: [0, 150],
                    widget: new Button({
                        id: "exit",
                        text: "Exit",
                        func: () => {
                            console.log("exit");
                        }
                    })
                }
            ]
        })
    };




    document.querySelector("#menu").appendChild(menus.main.generateElement());

}
