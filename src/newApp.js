import { useLayoutEffect, useEffect, useState, useRef } from 'react';
import cardicon from './cardicon.png';



const newApp = () => {
  const [elements,setElements] = useState([]) // Set of all elements in the screen.
  const [elementType,setElementType] = useState(null) //Set the kind of element you want to draw.
  const [action,setAction] = useState(null) // Set Action like drawing, moving, writing, resizing
  const [tool,setTool] = useState(null) // Set tool like selection
  const [selectedElement,setSelectedElement] = useState(null) // element under selection


  const createElement = (elementType,x1,y1,x2,y2,styles,data) => {
    switch(elementType) {
      case "line":
      
    }
  }

  const drawElement = () => {

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
