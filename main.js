


// type exa, button props disbaled=true children nested tags
function createElement(type, props, ...children) {
  return {
    type,
    props : {
      ...props,
      children: children.map(child ==>
        typeof child === "object"
         ? child
         : createTextElement(child)
      )
    }
  }
}
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue : text,
      children: [],
    }
  }
}


const MicroReact = {
    createElement,
}


const element = MicroReact.createElement(
  "div",
  { id: "foo" },
  MicroReact.createElement("a", null , "bar"),
  MicroReact.createElement("b")
)
