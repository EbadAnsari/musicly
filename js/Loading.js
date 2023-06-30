class Loading {
    constructor(object) {
        if (object != undefined) {
            this.object = object;
        }
    }

    make() {
        let svg = document.getElementById(this.object.container[0]);
        let circle = document.getElementById(this.object.container[1]);

        if (svg == null || circle == null) {
            alert(`Element are not loaded\ncircle = ${circle}\nsvg ${svg}`);
            return;
        }


        let strokeWidth = this.object.strokeWidth;
        let height = this.object.height;
        let color = this.object.color;

        circle.style.height = height + "px";
        circle.style.width = height + "px";

        this.strokeDash = parseInt(height * 22 / 7 + 1);

        circle.setAttribute("cx", (strokeWidth / 2) + (height / 2));
        circle.setAttribute("cy", (strokeWidth / 2) + (height / 2));
        circle.setAttribute("r", (height / 2));

        svg.style.height = height + strokeWidth + "px";
        svg.style.width = height + strokeWidth + "px";
        svg.style.transform = "rotate(-90deg)"

        circle.style.stroke = color;
        circle.style.fill = "none";
        circle.style.strokeLinecap = this.object.strokeLinecap;
        circle.style.strokeWidth = strokeWidth + "px";
        circle.style.strokeDasharray = `${this.strokeDash}px`;
        circle.style.strokeDashoffset = `${this.strokeDash}px`;
        return this;
    }

    change(obj) {
        for (let x in obj)
            this.object[x] = obj[x]
        return this;
    }

    animate() {
        this.circleAnimation = svg.animate(
            [
                { transform: "rotate(0deg)" },
                { transform: "rotate(360deg)" }
            ],
            {
                duration: this.object.animationDuration[0],
                iterations: Infinity,
                easing: this.object.timingFunction[0],
            }
        );
        this.svgAnimation = circle.animate(
            [
                { strokeDashoffset: `${this.strokeDash}px` },
                { strokeDashoffset: `-${this.strokeDash}px` },
            ],
            {
                duration: this.object.animationDuration[1],
                iterations: Infinity,
                easing: this.object.timingFunction[1],
            },
        );
        this.circleAnimation.pause();
        this.svgAnimation.pause();
    }

    progress(value) {
        this.stop();
        let percentage = percentageToValue(value, this.strokeDash);
        if (percentage > this.strokeDash) {
            percentage = this.strokeDash;
        }
        document.getElementById(this.object.container[1]).style.strokeDashoffset = `${this.strokeDash - percentage}px`;
    }

    start() {
        this.circleAnimation.play();
        this.svgAnimation.play();
    }
    pause() {
        this.circleAnimation.pause();
        this.svgAnimation.pause();
    }
    stop() {
        this.circleAnimation.cancel();
        this.svgAnimation.cancel();
    }
}

/**
 * 
 * `attrubutes` = {
 *      `container`: any type of container ex: div#container,
 *      `margin`: gap between boxes,
 *      `dimension`: length of side of square boxes,
 *      `color`: color of boxes,
 *      `duration`: total time require to complete one cycle (in milliseconds),
 *      `borderRadius`: curvature on the corner of square,
 *      
 * }
 * 
 */
class LoadingBoxes {
    constructor(attributes) {
        this.container = document.getElementById(attributes.container);
        this.style = document.createElement("style");
        this.make(attributes);
    }

    make(attributes) {

        if (this.container == null) {
            console.error((`Cannot found any "${attributes.container}"`));
            return;
        }
        this.container.innerHTML = null;

        const margin = attributes.margin == undefined
            ? 0
            : attributes.margin;
        const contract = attributes.dimension;
        const expand = contract * 2 + margin;
        const color = attributes.color;
        const duration = attributes.duration;
        const borderRadius = attributes.dimension * attributes.borderRadius / 100;

        this.style.innerHTML += `#${attributes.container} .box-one, .box-two, .box-three { width: ${contract}px; height: ${contract}px; border-radius: ${borderRadius}px; }`;

        this.style.innerHTML += `.box-one { position: absolute; top: 0px; background-color: ${color}; animation: box-one ${duration}ms ease 0s infinite forwards; }`;
        this.style.innerHTML += `.box-two { position: absolute; top: 0px; left: ${contract + margin}px; width: ${contract}px; height: ${contract}px; background-color: ${color}; animation: box-two ${duration}ms ease 0s infinite forwards; }`;
        this.style.innerHTML += `.box-three { position: absolute; top: ${contract + margin}px; width: ${expand}px; height: ${contract}px; background-color: ${color}; animation: box-three ${duration}ms ease 0s infinite forwards;}`;


        let boxOneAnimation = `@keyframes box-one {
				0%, 12% { top: 0px; left: 0px; width: ${contract}px; height: ${contract}px; }

				16% { top: 0px; left: 0px; width: ${expand}px; height: ${contract}px; }

				20%, 36% { top: 0px; left: ${contract + margin}px; width: ${contract}px; height: ${contract}px; }

				40% { top: 0px; left: ${contract + margin}px; width: ${contract}px; height: ${expand}px; }

				44%, 60% { top: ${contract + margin}px; left: ${contract + margin}px; width: ${contract}px; height: ${contract}px; }

				64% { top: ${contract + margin}px; left: 0px; width: ${expand}px; height: ${contract}px; }

				68%, 84% { top: ${contract + margin}px; left: 0px; width: ${contract}px; height: ${contract}px; }

				88% { top: 0px; left: 0px; width: ${contract}px; height: ${expand}px; }

				92%, 100% { top: 0px; left: 0px; width: ${contract}px; height: ${contract}px; }}`;

        let boxTwoAnimation = `@keyframes box-two {

				0%, 4% { top: 0px; left: ${contract + margin}px; width: ${contract}px; height: ${contract}px; }

				8% { top: 0px; left: ${contract + margin}px; width: ${contract}px; height: ${expand}px; }

				12%, 28% { top: ${contract + margin}px; left: ${contract + margin}px; width: ${contract}px; height: ${contract}px; }

				32% { top: ${contract + margin}px; left: 0px; width: ${expand}px; height: ${contract}px; }

				36%, 52% { top: ${contract + margin}px; left: 0px; width: ${contract}px; height: ${contract}px; }

				56% { top: 0px; left: 0px; width: ${contract}px; height: ${expand}px; }

				60%, 76% { top: 0px; left: 0px; width: ${contract}px; height: ${contract}px; }

				80% { top: 0px; left: 0px; width: ${expand}px; height: ${contract}px; }

				84%, 100% { top: 0px; left: ${contract + margin}px; width: ${contract}px; height: ${contract}px; }}`;

        let boxThreeAnimation = `@keyframes box-three {

				0%, 20% { top: ${contract + margin}px; left: 0px; width: ${contract}px; height: ${contract}px; }

				24% { top: 0px; left: 0px; width: ${contract}px; height: ${expand}px; }

				28%, 44% { top: 0px; left: 0px; width: ${contract}px; height: ${contract}px; }

				48% { top: 0px; left: 0px; width: ${expand}px; height: ${contract}px; }

				52%, 68% { top: 0px; left: ${contract + margin}px; width: ${contract}px; height: ${contract}px; }

				72% { top: 0px; left: ${contract + margin}px; width: ${contract}px; height: ${expand}px; }

				76%, 92% { top: ${contract + margin}px; left: ${contract + margin}px; width: ${contract}px; height: ${contract}px; }

				96% { top: ${contract + margin}px; left: 0px; width: ${expand}px; height: ${contract}px; }

				100% { top: ${contract + margin}px; left: 0px; width: ${contract}px; height: ${contract}px; }}`;

        this.style.innerHTML += boxOneAnimation + boxTwoAnimation + boxThreeAnimation;


        const boxOne = document.createElement("div");
        const boxTwo = document.createElement("div");
        const boxThree = document.createElement("div");

        boxOne.setAttribute("class", "box-one");
        boxTwo.setAttribute("class", "box-two");
        boxThree.setAttribute("class", "box-three");

        this.container.appendChild(this.style);

        this.container.appendChild(boxOne);
        this.container.appendChild(boxTwo);
        this.container.appendChild(boxThree);
    }

    kill() {
        this.container.innerHTML = null;
        this.style.innerHTML = null;
    }
}