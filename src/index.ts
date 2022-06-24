import "./index.css";

// This file will initialise the application

window.addEventListener("DOMContentLoaded", // This waits for the document to load before changing the page.
    (e: Event) => { initialiseApp(e) },
    false
);

function initialiseApp(_event: Event): void {

    

    class Button {
        name: string;
        text: string;
        func: Function;
        styling: object;
        enabled: boolean = false;

        toggle(): void {
            this.enabled = !this.enabled;
        }

        constructor(name: string, text: string, func: Function, styling: object, enabled: boolean) {
            this.name = name;
            this.text = text;
            this.func = func;
            this.styling = styling;
            this.enabled = enabled;
        }
    }

    class Menu {
        name: string;
        title!: string;
        description!: string;
        styling!: object;
        buttons: {
            button: Button;
            x: number;
            y: number;
        }[] = [];

        generateElement(): HTMLElement {

            let menu: HTMLElement = document.createElement("div");
            menu.innerHTML = this.name;
            return menu;
        }

        constructor(name: string) {
            this.name = "hello";
        }
    }

    var menus = {
        main: new Menu("Main"),
    };

    document.querySelector("#menu").appendChild(menus.main.generateElement());

}