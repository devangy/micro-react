


// type exa, button props disbaled=true children nested tags
function createElement(type, props, ...children) {
  return {
    type,
    props : {
      ...props,
      children: children.map(child =>
        typeof child === "object"
         ? child
         : createTextNode(child)
      )
    }
  }
}
function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue : text,
      children: [],
    }
  }
}


// using fiber tree to organize our units of work
// each fiber is a element or a unit of work
// next units of work parent -> child -> sibling
function createDom(fiber) {
  const dom =
     fiber.type == "TEXT_ELEMENT"
     ? createTextNode(text)
     : createElement(fiber.type)

  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })

  return dom
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
  // idletime is less than 1ms workloop exits give control back to browser
  shouldYield = deadline.timeRemaining() < 1

  // resume processing elements
  requestIdleCallback(workLoop)
}



// init start the process pass the cb lopp
requestIdleCallback(workLoop)

// single unit of work takes in a fiber and does work
function performUnitOfWork(fiber) {
  // checking if the browser dom is created for the unit of work
  if  (!fiber.dom) {
      fiber.dom = createElement(fiber)
  }

  // if the fiber is not root container find the parent and attach new HTML element inside it
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

  // iterating over elements to create children fiber
  const elements = fiber.props.children

  let index = 0
  
  let prevSibling = null

  while (index < elements.length) {
    const element = elements[index]

    const newFiber {
      type: element.type,
      props: element.props,
      parent: fiber
      dom : null
    }

    if (index == 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }


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
