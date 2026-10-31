


// type exa, button props disbaled=true children nested tags
function createElement(type, props, ...children) {
  return {
    type,
    props : {
      ...props,
      children: children.map(child =>
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


function render(element,container) {
  //creating dom
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)

  //assigning element props to the node created
  // filtering the props only and appending to that custom dom node
  const isProperty = key => key != "children"
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name]
    })


  // creating dom for children element
  element.props.children.forEach(child =>
    render(child, dom)
  )
   container.append(dom)
}


const MicroReact = {
  createElement,
  render
}


const element = MicroReact.createElement(
  "div",
  { id: "foo" },
  MicroReact.createElement("a", null , "bar"),
  MicroReact.createElement("b")
)
