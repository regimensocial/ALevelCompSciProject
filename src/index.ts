import "./index.scss";

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

        generateElement(): HTMLElement {
            let button: HTMLElement = document.createElement("button");
            button.innerText = this.text;
            button.className = "button";
            button.addEventListener("click", () => { this.func() });

            return button;
        }

        toggle(): void {
            this.enabled = !this.enabled;
        }

        constructor(name: string, text: string, styling: object, enabled: boolean, func: Function) {
            this.name = name;
            this.text = text;
            this.func = func;
            this.styling = styling;
            this.enabled = enabled;
        }
    }

    type PositionedWidget = {
        x: number;
        y: number;
        widget: Button | string;
    };


    class Menu {
        private name: string;
        private title!: string;
        private description!: string;
        private styling!: object;
        private widgets: (PositionedWidget)[];
        // widgets: Array<GenericPos | ButtonPos> = [];

        generateElement(): HTMLElement {

            let menu: HTMLElement = document.createElement('table');
            menu.classList.add("genericMenu");

            // create text 
            let title: HTMLElement = document.createElement('div');
            title.innerText = this.title;

            // create description
            let description: HTMLElement = document.createElement('div');
            description.innerText = this.description;
            menu.appendChild(title);
            menu.appendChild(description);

            let positionedWidgets: PositionedWidget[][] = [];

            this.widgets.forEach((widget: PositionedWidget) => {
                if (!positionedWidgets[widget.y]) {
                    positionedWidgets[widget.y] = [];
                }
                positionedWidgets[widget.y][widget.x] = widget;
            });


            // find largest X in positionedWidgets
            const largestX = this.widgets.flat().find(e => (Math.max(e.x) || e)).x || 0;

            // find largest Y in positionedWidgets
            const largestY = this.widgets.flat().find(e => (Math.max(e.y) || e)).y || 0;


            console.log([largestX, largestY]);

            // loop how many times we need to create a row
            for (let i = 1; i < positionedWidgets.length; i++) {
                console.log(i)
                let row: HTMLElement = document.createElement('tr');

                // // loop how many times we need to create a column in the row

                for (let j = 1; j < (largestX + 1); j++) {

                    let cell: HTMLElement = document.createElement('td');
                    cell.classList.add(`x${j}`, `y${i}`);
                    // if (positionedWidgets[i] && positionedWidgets[i][j]) {
                    //     console.log(i, j)
                    //     let currentWidget = positionedWidgets[i][j].widget;
                    //     if (currentWidget instanceof Button) {
                    //         cell.appendChild(currentWidget.generateElement());
                    //     } else {
                    //         // create div and append text
                    //         let div: HTMLElement = document.createElement('div');
                    //         div.innerText = currentWidget;
                    //         cell.appendChild(div);
                    //     }
                    // }
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
                            menu.querySelector(position).appendChild(div);
                        }
                    }
                }
                )
            })


            


            document.querySelector("#menu").appendChild(menu);


            return menu;

        }

        constructor(name: string, title: string, description: string, styling: object, widgets: PositionedWidget[]) {
            this.name = name;
            this.title = title;
            this.description = description;
            this.styling = styling;

            this.widgets = widgets;
        }
    }

    var menus = {
        main: new Menu("main", "Main Menu", "This is the main menu", {}, [
            {
                x: 9,
                y: 1,
                widget: "4, 1"
            },
            {
                x: 1,
                y: 1,
                widget: "1, 1"
            },
            {
                x: 3,
                y: 2,
                widget: "3, 2"
            },
            {
                x: 9,
                y: 9,
                widget: "9, 9"
            },
            // {
            //     x: 1,
            //     y: 1,
            //     widget: "Star2tx"
            // }
        ]),
    };

    


    document.querySelector("#menu").appendChild(menus.main.generateElement());

}
