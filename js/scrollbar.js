function setScrollBar(thickness, trackColor, thumbColor, scrollBarAxis, _function) {

    let value = { doc: undefined, scrollBar: undefined };
    _function(value);

    let styleScrollBar = undefined, doc = undefined;
    doc = value.doc;
    styleScrollBar = value.scrollBar;

    doc.body.appendChild(styleScrollBar);
    if (scrollBarAxis == "xy")
        styleScrollBar.innerText = `::-webkit-scrollbar { height: ${thickness}px; width: ${thickness}px; background-color: ${trackColor}; border-radius: ${thickness / 2}px; visibility: hidden; } ::-webkit-scrollbar-thumb { background-color: ${thumbColor}; border-radius: ${thickness / 2}px; visibility: hidden; } :hover::-webkit-scrollbar { visibility: visible; } :hover::-webkit-scrollbar-thumb { visibility: visible; }`;
    else if (scrollBarAxis == "x")
        styleScrollBar.innerText = `::-webkit-scrollbar { height: ${thickness}px; background-color: ${trackColor}; border-radius: ${thickness / 2}px; visibility: hidden; } ::-webkit-scrollbar-thumb { background-color: ${thumbColor}; border-radius: ${thickness / 2}px; visibility: hidden; } :hover::-webkit-scrollbar { visibility: visible; } :hover::-webkit-scrollbar-thumb { visibility: visible; }`;
    else if (scrollBarAxis == "y")
        styleScrollBar.innerText = `::-webkit-scrollbar { width: ${thickness}px; background-color: ${trackColor}; border-radius: ${thickness / 2}px; visibility: hidden; } ::-webkit-scrollbar-thumb { background-color: ${thumbColor}; border-radius: ${thickness / 2}px; visibility: hidden; } :hover::-webkit-scrollbar { visibility: visible; } :hover::-webkit-scrollbar-thumb { visibility: visible; }`;
    return styleScrollBar;
}