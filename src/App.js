import logo from './logo.svg';
import './App.css';
import { useLayoutEffect, useEffect, useState, useRef } from 'react';
import cardicon from './cardicon.png';


function App() {
  const [elementType,setElementType] = useState(null)
  const [actionType,setActionType] = useState(null)
  const [elements,setElements] = useState([])
  const [drawing,setDrawing] = useState(false)
  const [selectedElement,setSelectedElement] = useState(null)
  const [resizeElement,setResizeElement] = useState(null)
  const [ctx,setctx] = useState(null)
  const canvasRef = useRef()
  const textAreaRef = useRef();

  // const getDraggedCorner = (element,x,y) => {
  //
  // }
  //
  // const getBoundingBox = () => {
  //
  // }
  //
  // const getResizePoints = () => {
  //
  // }

  const getCoordinates = (element) => {
    switch (element.type) {
      case "img":
      case "rectangle":
        let minX = Math.min(element.x1,element.x2)
        let maxX = Math.max(element.x1,element.x2)
        let minY = Math.min(element.y1,element.y2)
        let maxY = Math.max(element.y1,element.y2)
        return {
          x1:element.x1,
          x2:element.x2,
          y1:element.y1,
          y2:element.y2
        };
        break;
      case "line":
        return {
          x1:element.x1,
          x2:element.x2,
          y1:element.y1,
          y2:element.y2
        }
        break;
      default:

    }
  }

  const isResizing = (x,y) => {
    for (var i = 0; i < elements.length; i++) {
      let element  = elements[i]
      let coordinates = getCoordinates(element)
      console.log(coordinates);
      switch (element.type) {
        case "line":
          if (x >= coordinates.x1 - 10 && x <= coordinates.x1 + 10 && y >= coordinates.y1 - 10 && y <= coordinates.y1 + 10) {
            return {
              element:element,
              point:"tl",
              initial:{
                x:x,
                y:y
              }
            }
          } else if (x >= coordinates.x2 - 10 && x <= coordinates.x2 + 10 && y >= coordinates.y2 - 10 && y <= coordinates.y2 + 10) {
            return {
              element:element,
              point:"tr",
              initial:{
                x:x,
                y:y
              }
            }
          }
          break;
        case "img":
        case "rectangle":
          if (x >= coordinates.x1 - 10 && x <= coordinates.x1 + 10 && y >= coordinates.y1 - 10 && y <= coordinates.y1 + 10) {
            return {
              element:element,
              point:"tl",
              initial:{
                x:x,
                y:y
              }
            }
          } else if (x >= coordinates.x2 - 10 && x <= coordinates.x2 + 10 && y >= coordinates.y1 - 10 && y <= coordinates.y1 + 10) {
            return {
              element:element,
              point:"tr",
              initial:{
                x:x,
                y:y
              }
            }
          } else if (x >= coordinates.x1 - 10 && x <= coordinates.x1 + 10 && y >= coordinates.y2 - 10 && y <= coordinates.y2 + 10) {
            return {
              element:element,
              point:"bl",
              initial:{
                x:x,
                y:y
              }
            }
          } else if (x >= coordinates.x2 - 10 && x <= coordinates.x2 + 10 && y >= coordinates.y2 - 10 && y <= coordinates.y2 + 10) {
            return {
              element:element,
              point:"br",
              initial:{
                x:x,
                y:y
              }
            }
          }
          break;

        default:
          continue

      }
    }
    return {
      element:null
    }
  }

  const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  const updateResizeElemet = (element,diff,from) => {
    const {id, x1, y1, x2, y2, type,options} = element
    const elementsCopy = [...elements];
    let newX1 = x1
    let newY1 = y1
    let newX2 = x2
    let newY2 = y2
    switch (type) {
      case "line":
        if (from == "tl") {
          newX1 += diff.x
          newY1 += diff.y
        } else if (from == "tr") {
          newX2 += diff.x
          newY2 += diff.y
        }
        elementsCopy[id] = createElement(id,type, newX1, newY1, newX2, newY2,{} );
        break;
      case "rectangle":
        if (from == "tl") {
          newX1 += diff.x
          newY1 += diff.y
        } else if (from == "tr") {
          newX2 += diff.x
          newY1 += diff.y
        }
        else if (from == "bl") {
          newX1 += diff.x
          newY2 += diff.y
        } else if (from == "br") {
          newX2 += diff.x
          newY2 += diff.y
        }
        elementsCopy[id] = createElement(id,type, newX1, newY1, newX2, newY2,{} );
        break;
      case "img":
        console.log("here")
        if (from == "tl") {
          element.data.width -= diff.x/50
          element.data.height = element.data.width * element.data.ar
          newX1 = x2 - element.data.width
          newY1 = y2 - element.data.height
        } else if (from == "tr") {
          element.data.width += diff.x/50
          element.data.height = element.data.width * element.data.ar
          newY1 = y2 - element.data.height
          newX2 = element.data.width + newX1
          newY2 = element.data.height + newY1
        }
        else if (from == "bl") {
          element.data.width -= diff.x/50
          element.data.height = element.data.width * element.data.ar
          newX1 = x2 - element.data.width
          newX2 = element.data.width + newX1
          newY2 = element.data.height + newY1
        } else if (from == "br") {
          element.data.width += diff.x/50
          element.data.height = element.data.width * element.data.ar
          newX2 = element.data.width + newX1
          newY2 = element.data.height + newY1
        }
        elementsCopy[id] = createElement(id,type, newX1, newY1, newX2, newY2,element.data);
        break;
      // case "pencil":
      //   elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
      //   break;
      // case "text":
      //   const textWidth = document
      //     .getElementById("canvas")
      //     .getContext("2d")
      //     .measureText(options.text).width;
      //   const textHeight = 24;
      //   elementsCopy[id] = {
      //     ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
      //     text: options.text,
      //   };
      //   break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    console.log(elementsCopy);
    setElements(elementsCopy);
  }

  const updateMovingElement = (element,drag) => {
    const {id, x1, y1, x2, y2, type,options} = element
    const elementsCopy = [...elements];
    let newX1 = 0
    let newY1 = 0
    let newX2 = 0
    let newY2 = 0
    console.log(elementsCopy);
    switch (type) {
      case "line":
      case "rectangle":
        newX1 = x1 + drag.x
        newY1 = y1 + drag.y
        newX2 = newX1 + x2-x1
        newY2 = newY1 + y2-y1
        elementsCopy[id] = createElement(id,type, newX1, newY1, newX2, newY2,{} );
        break;
      case "img":
        console.log("here")
        newX1 = x1 + drag.x
        newY1 = y1 + drag.y
        newX2 = x2 + drag.x
        newY2 = y2 + drag.y
        elementsCopy[id] = createElement(id,type, newX1, newY1, newX2, newY2,element.data);
        break;
      case "pencil":
        elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
        break;
      case "text":
        const textWidth = document
          .getElementById("canvas1")
          .getContext("2d")
          .measureText(element.data.text).width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(id,type, x1+drag.x, y1+drag.y, x1 + textWidth, y1 + textHeight,element.data)
        };
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    console.log(elementsCopy);
    setElements(elementsCopy);
  };

  const updateTextElement = (id, x1, y1, x2, y2, type,options) => {
    const elementsCopy = [...elements];
    const textWidth = document
      .getElementById("canvas1")
      .getContext("2d")
      .measureText(options.text).width;
    const textHeight = 24;
    elementsCopy[id] = {
      ...createElement(id, type,x1, y1, x1 + textWidth, y1 + textHeight,{text: options.text})
    };
    setElements(elementsCopy);
  };

  const onChangeInputImageHandler = (e) =>{
    let fileInput = document.getElementById("upload_image_input");
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      var img = new Image();
      img.src = reader.result;
      console.log(img);
      img.onload = function(){
        // Get the original width and height of the image
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Calculate the new width and height of the image, keeping the aspect ratio
        let newWidth = originalWidth;
        let newHeight = originalHeight;

        if (newWidth > 300) {
          newWidth = 300;
          newHeight = (newWidth / originalWidth) * originalHeight;
        }

        let ele = createElement(elements.length,"img",60,60,newWidth+60,newHeight+60,{obj:img,width:newWidth,height:newHeight,ar:originalHeight/originalWidth})
        setElements((prev) => {
          return [...prev,ele]
        })
      }
    }
  }

  const createElement = (id,type,x1,y1,x2,y2,data) => {

    return {id,type,x1,y1,x2,y2,data}
  }

  const drawElement = (type,x1,y1,x2,y2,data) => {
    if (type == "line") {
      //Creating a line
      ctx.beginPath();
      ctx.strokeStyle="#000"
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath()
    } else if (type == "rectangle") {
      // Creating a rectangle
      ctx.fillStyle = "#E9E9E9";
      ctx.fillRect(x1,y1,x2-x1,y2-y1)
    }else if (type == "stroke-line") {
      // Creating a select line
      ctx.beginPath();
      ctx.strokeStyle="#ACCEF7"
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath()
    } else if (type == "stroke-rectangle") {
      // Creating a stroke rectangle
      ctx.strokeStyle="#ACCEF7"
      ctx.strokeRect(x1,y1,x2-x1,y2-y1)
    } else if (type == "circle") {
      //Creating a circle
      let radius = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2))
      ctx.beginPath();
      ctx.strokeStyle="#000"
      ctx.arc(x1, y1, radius,0, Math.PI * 2, true);
      ctx.stroke()
      ctx.closePath()
    } else if (type == "img") {
      ctx.drawImage(data.obj, x1, y1,data.width,data.height);
    } else if (type == "text") {
      console.log("here");
      ctx.textBaseline = "top";
      ctx.font = "24px sans-serif";
      if (data?.text) {
        console.log("Text there");
        ctx.fillText(data.text,x1-canvasRef.current.offsetLeft,y1-canvasRef.current.offsetTop);
      }

    }
  }


  const getElementAtPosition = (x,y) => {
    let isElement = false
    let boundingBox = null
    for (var i = 0; i < elements.length; i++) {
      let element = elements[i]
      if (element.type == "rectangle" || element.type == "img") {
        let minX = Math.min(element.x1,element.x2)
        let maxX = Math.max(element.x1,element.x2)
        let minY = Math.min(element.y1,element.y2)
        let maxY = Math.max(element.y1,element.y2)
        isElement= x >= minX && x<=maxX && y>= minY && y<=maxY
        boundingBox = {
          type:"stroke-rectangle",
          x1:minX,
          x2:maxX,
          y1:minY,
          y2:maxY
        }

      } else if (element.type == "line") {
        const a = { x: element.x1, y: element.y1 };
        const b = { x: element.x2, y: element.y2 };
        const c = { x, y };
        let offset = distance(a, b) - (distance(a, c) + distance(b, c))
        isElement = Math.abs(offset) < 1
        boundingBox = {
          type:"stroke-line",
          x1:element.x1,
          x2:element.x2,
          y1:element.y1,
          y2:element.y2
        }
      } else if (element.type == "circle") {
        continue
      } else if (element.type == "text") {
        let minX = Math.min(element.x1 - canvasRef.current.offsetLeft,element.x2 - canvasRef.current.offsetLeft)
        let maxX = Math.max(element.x1 - canvasRef.current.offsetLeft,element.x2 - canvasRef.current.offsetLeft)
        let minY = Math.min(element.y1 - canvasRef.current.offsetTop,element.y2 - canvasRef.current.offsetTop)
        let maxY = Math.max(element.y1 - canvasRef.current.offsetTop,element.y2 - canvasRef.current.offsetTop)
        isElement= x >= minX && x <=maxX && y >= minY && y <=maxY
      }
      if(isElement) {
        return {
          isElement: isElement,
          boundingBox:boundingBox,
          element:element
        }
      }
    }
    return {
      isElement: isElement,
      boundingBox:boundingBox,
    }
  }

  const handleMouseDown = (e) => {
    const {clientX,clientY} = e
    if (actionType === "writing") return;
    if (elementType == "text") {
      let ele = createElement(
        elements.length,
        elementType,
        clientX,
        clientY,
        clientX,
        clientY,
        {},
      )
      setElements((prev) => {
        return [...prev,ele]
      })
      setSelectedElement({
        element:{...ele}
      });
      setActionType("writing");
    } else if (elementType == "img") {
      return
    } else if (elementType == "select") {
      let isResize = isResizing(clientX -  canvasRef.current.offsetLeft,clientY - canvasRef.current.offsetTop)
      console.log(clientX -  canvasRef.current.offsetLeft,clientY - canvasRef.current.offsetTop)
      if (isResize.element) {
        setActionType("resize")
        setResizeElement(isResize)
        if (isResize.element.type == "line") {
          document.body.style.cursor = 'default';
        } else if (isResize.point == "tr") {
          document.body.style.cursor = 'ne-resize';
        } else if (isResize.point == "tl") {
          document.body.style.cursor = 'nw-resize';
        } else if (isResize.point == "bl") {
          document.body.style.cursor = 'sw-resize';
        } else if (isResize.point == "br") {
          document.body.style.cursor = 'se-resize';
        }
        return
      }
      setActionType("moving")
      const {isElement,boundingBox,element} = getElementAtPosition(
        clientX -  canvasRef.current.offsetLeft,
        clientY - canvasRef.current.offsetTop,
      )
      console.log(isElement);
      if (isElement) {
        document.body.style.cursor = 'move';
        let offsetX = clientX -  canvasRef.current.offsetLeft
        let offsetY = clientY - canvasRef.current.offsetTop
        setSelectedElement({
          element:{...element,offsetX,offsetY},
          boundingBox:boundingBox
        })
      } else {
        setSelectedElement(null)
      }
    } else {
      setSelectedElement(null)
      setDrawing(true)
      let ele = createElement(
        elements.length,
        elementType,
        clientX -  canvasRef.current.offsetLeft,
        clientY - canvasRef.current.offsetTop,
        clientX -  canvasRef.current.offsetLeft,
        clientY - canvasRef.current.offsetTop,
        {},
      )
      setElements((prev) => {
        return [...prev,ele]
      })
    }
  }

  const handleMouseUp = (e) => {
    if (selectedElement) {
      console.log("Text Mouse Up");
      if (selectedElement.type === "text") {
        setActionType("writing");
        return;
      }
    }
    if (drawing) {

    }
    if (actionType === "writing") return;
    setDrawing(false)
    setActionType(null)
    document.body.style.cursor = 'default';
  }

  const handleMouseMove = (e) => {
    const {clientX,clientY} = e
    if(elementType == "select" && selectedElement && actionType == "moving") {
      const {id,x1,y1,x2,y2,type,offsetX,offsetY} = selectedElement.element
      //Offset X and Y is basically the inital X and Y
      let drag = {
        x:clientX - canvasRef.current.offsetLeft - offsetX,
        y:clientY - canvasRef.current.offsetTop - offsetY
      }
      updateMovingElement(selectedElement.element,drag)
    } else if (elementType == "select" && resizeElement && actionType == "resize") {
      console.log("resizing ", resizeElement);
      let xDiff = clientX - canvasRef.current.offsetLeft - resizeElement.initial.x
      let yDiff = clientY - canvasRef.current.offsetTop - resizeElement.initial.y
      updateResizeElemet(resizeElement.element,{x:xDiff,y:yDiff},resizeElement.point)
    } else if(!drawing) {
      return
    } else {
      let {id,type,x1,y1,x2,y2} = elements[elements.length -1]
      let ele = createElement(id,type,x1,y1,clientX - canvasRef.current.offsetLeft,clientY - canvasRef.current.offsetTop)

      let eleCopy = [...elements]
      eleCopy[elements.length -1] = ele
      setElements(eleCopy)
    }

  }

  const handleBlur = event => {
    const { id, x1, y1, type } = selectedElement.element;

    setActionType(null);
    setSelectedElement(null);
    updateTextElement(id, x1, y1, null, null, type, { text: textAreaRef.current.value });
  };

  useEffect(() => {
    console.log(elements);
    const canvas = document.getElementById("canvas1")
    const ctx1 = canvas.getContext('2d')
    setctx(ctx1)
    ctx1.clearRect(0,0,canvas.width,canvas.height)
    elements.forEach(element => {
      drawElement(element.type, element.x1,element.y1,element.x2,element.y2,element.data)
    });
    // if (selectedElement) {
    //   drawElement(selectedElement.boundingBox.type, selectedElement.boundingBox.x1,selectedElement.boundingBox.y1,selectedElement.boundingBox.x2,selectedElement.boundingBox.y2,{})
    // }
  }, [elements])


  return (
    <div className="App">
      <canvas
        id='canvas1'
        width="700"
        height="700"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
      >
        This is main Canvas
      </canvas>
      {actionType === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            top: selectedElement.element.y1 - 2,
            left: selectedElement.element.x1,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
          }}
        />
      ) : null}
      <div className="toolbar">
        <div className="toolbar_card" onClick={() => setElementType('text')}>
          <img src={cardicon} />
          <span>Text</span>
        </div>
        <div className="toolbar_card" onClick={() => setElementType('img')}>
          <img src={cardicon} />
          <label for="upload_image_input">Image</label>
          <input type="file" id="upload_image_input" onChange={onChangeInputImageHandler} />
        </div>
        <div className="toolbar_card" onClick={() => setElementType('line')}>
          <img src={cardicon} />
          <span>Line</span>
        </div>
        <div className="toolbar_card" onClick={() => setElementType('rectangle')}>
          <img src={cardicon} />
          <span>Rectangle</span>
        </div>
        <div className="toolbar_card" onClick={() => setElementType('circle')}>
          <img src={cardicon} />
          <span>Circle</span>
        </div>
        <div className="toolbar_card" onClick={() => setElementType('select')}>
          <img src={cardicon} />
          <span>Select</span>
        </div>
      </div>
    </div>
  );
}

export default App;
