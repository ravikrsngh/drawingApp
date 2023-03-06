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
  const [ctx,setctx] = useState(null)
  const canvasRef = useRef()


  const onChangeInputImageHandler = (e) =>{
    let fileInput = document.getElementById("upload_image_input");
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      var img = new Image();
      img.src = reader.result;
      img.onload = function(){
        let ele = createElement("img",0,0,0,0,{obj:img})
        setElements((prev) => {
          return [...prev,ele]
        })
      }
    }
  }

  const createElement = (type,x1,y1,x2,y2,data) => {
    return {type,x1,y1,x2,y2,data}
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
      ctx.drawImage(data.obj, 0, 0);
    }

  }


  const getElementAtPosition = (x,y) => {
    let isElement = false
    let boundingBox = null
    for (var i = 0; i < elements.length; i++) {
      let element = elements[i]
      if (element.type == "rectangle") {
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
        let minX = Math.min(element.x1,element.x2)
        let maxX = Math.max(element.x1,element.x2)
        let minY = Math.min(element.y1,element.y2)
        let maxY = Math.max(element.y1,element.y2)
        isElement= x >= minX && x<=maxX && y>= minY && y<=maxY
        boundingBox = {
          type:"stroke-line",
          x1:minX,
          x2:maxX,
          y1:minY,
          y2:maxY
        }
      } else if (element.type == "circle") {
        return {
          isElement:false
      }
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
    if (elementType == "img") {
      return
    }
    if (elementType == "select") {
      const {isElement,boundingBox,element} = getElementAtPosition(
        clientX -  canvasRef.current.offsetLeft,
        clientY - canvasRef.current.offsetTop,
      )
      console.log(isElement,boundingBox,element)
      if (isElement) {
        setSelectedElement({
          element:element,
          boundingBox:boundingBox
        })
      } else {
        setSelectedElement(null)
      }
    } else {
      setSelectedElement(null)
      setDrawing(true)
      let ele = createElement(
        elementType,
        clientX -  canvasRef.current.offsetLeft,
        clientY - canvasRef.current.offsetTop,
        clientX -  canvasRef.current.offsetLeft,
        clientY - canvasRef.current.offsetTop,
        {}
      )
      setElements((prev) => {
        return [...prev,ele]
      })
    }
  }

  const handleMouseUp = (e) => {
    setDrawing(false)
  }

  const handleMouseMove = (e) => {
    const {clientX,clientY} = e
    if(!drawing) {
      return
    } else if(elementType == "select" && selectedElement) {
       
    }

    let {x1,y1,x2,y2} = elements[elements.length -1]
    let ele = createElement(elementType,x1,y1,clientX - canvasRef.current.offsetLeft,clientY - canvasRef.current.offsetTop)

    let eleCopy = [...elements]
    eleCopy[elements.length -1] = ele
    setElements(eleCopy)

  }

  useEffect(() => {
    const canvas = document.getElementById("canvas1")
    const ctx1 = canvas.getContext('2d')
    setctx(ctx1)
    ctx1.clearRect(0,0,canvas.width,canvas.height)
    elements.forEach(element => {
      drawElement(element.type, element.x1,element.y1,element.x2,element.y2,element.data)
    });
    if (selectedElement) {
      drawElement(selectedElement.boundingBox.type, selectedElement.boundingBox.x1,selectedElement.boundingBox.y1,selectedElement.boundingBox.x2,selectedElement.boundingBox.y2,{})
    }
  }, [elements,selectedElement])


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
