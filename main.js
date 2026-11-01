


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

// global pointer for initial work set to null
let nextUnitOfWork = null

// callback passing to browser deadline is automatically passed in when calling workLoop
function workLoop(deadline) {
  let shouldYield = false

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
  }
  shouldYield = deadline.timeRemaining() < 1

  requestIdleCallback(workLoop)
}
// init start the process
requestIdleCallback(workLoop(deadline))


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
