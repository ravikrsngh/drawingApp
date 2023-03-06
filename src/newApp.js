import { useLayoutEffect, useEffect, useState, useRef } from 'react';
import cardicon from './cardicon.png';



const newApp = () => {
  const [elements,setElements] = useState([]) // Set of all elements in the screen.
  const [elementType,setElementType] = useState(null) //Set the kind of element you want to draw.
  const [action,setAction] = useState(null) // Set Action like drawing, moving, writing, resizing
  const [tool,setTool] = useState(null) // Set tool like selection
  const [selectedElement,setSelectedElement] = useState(null) // element under selection


  const createElement = (elementType,x1,y1,x2,y2,styles,data) => {
    return {elementType,x1,y1,x2,y2,styles,data}
  }

  const drawElement = ({elementType,x1,y1,x2,y2,styles,data}) => {
    switch (elementType) {
      case "line":
        ctx.beginPath();
        ctx.strokeStyle="#000"
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath()
        break;
      case "rectangle":
        ctx.fillStyle = "#E9E9E9";
        ctx.fillRect(x1,y1,x2-x1,y2-y1)
        break;
      case "stroke-rectangle":
        ctx.strokeStyle="#ACCEF7"
        ctx.strokeRect(x1,y1,x2-x1,y2-y1)
        break;
      case "circle":
        let radius = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2))
        ctx.beginPath();
        ctx.strokeStyle="#000"
        ctx.arc(x1, y1, radius,0, Math.PI * 2, true);
        ctx.stroke()
        ctx.closePath()
        break;
      case "image":
        ctx.drawImage(data.obj, 0, 0);
    }
  }

  const handleMouseDown = (e) => {
    setDrawing(true)
    let styles = {}
    let data = {}
    let ele = createElement(
      elementType,
      clientX -  canvasRef.current.offsetLeft,
      clientY - canvasRef.current.offsetTop,
      clientX -  canvasRef.current.offsetLeft,
      clientY - canvasRef.current.offsetTop,
      styles,
      data
    )
    setElements((prev) => {
      return [...prev,ele]
    })
  }

  const handleMouseUp = (e) => {
    setDrawing(false)
  }

  const handleMouseMove = (e) => {

  }

  useEffect(() => {

  },[elements])


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

export default newApp;
