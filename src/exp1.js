import logo from './logo.svg';
import './App.css';
import { useLayoutEffect, useEffect, useState } from 'react';


function App() {

  const [elements,setElements] = useState([])
  const [drawing,setDrawing] = useState(false)
  const [resizing,setResizing] = useState(false)
  const [ctx,setctx] = useState(null)

  const createElement = (x1,y1,x2,y2) => {
    return {x1,y1,x2,y2}
  }

  const drawElement = (x1,y1,x2,y2) => {
    //Creating a line
    // ctx.beginPath();
    // ctx.moveTo(x1, y1);
    // ctx.lineTo(x2, y2);
    // ctx.stroke();
    // ctx.closePath()

    // Creating a rectangle
    // ctx.strokeRect(x1,y1,x2-x1,y2-y1)

    //Creating a circle
    let radius = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2))
    ctx.beginPath();
    ctx.arc(x1, y1, radius,0, Math.PI * 2, true);
    ctx.stroke()
    ctx.closePath()
  }

  const drawResizeBox = (ele) => {
    return
  }

  const handleMouseDown = (e) => {
    setDrawing(true)
    const {clientX,clientY} = e
    let ele = createElement(clientX,clientY,clientX,clientY)
    setElements((prev) => {
      return [...prev,ele]
    })
  }

  const handleMouseUp = (e) => {
    setDrawing(false)
  }

  const handleMouseMove = (e) => {
    if(!drawing && !resizing) {
      return
    }

    let {x1,y1,x2,y2} = elements[elements.length -1]

    const {clientX,clientY} = e
    let ele = createElement(x1,y1,clientX,clientY)
    
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
      drawElement(element.x1,element.y1,element.x2,element.y2)
    });
  }, [elements])

  


  return (
    <div className="App">
      <canvas 
        id='canvas1' 
        width={window.innerWidth} 
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        This is main Canvas
      </canvas>
      <div className="toolbar">
        <span></span>
      </div>
    </div>
  );
}

export default App;
