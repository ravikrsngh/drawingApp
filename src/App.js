import logo from './logo.svg';
import './App.css';
import { useLayoutEffect, useEffect, useState, useRef } from 'react';
import cardicon from './cardicon.png';
import Layer from './components/layer/layer';
import TextWorkFlow from './workflows/textWorkflow';

function App() {
  const [elementType,setElementType] = useState(null)
  const [actionType,setActionType] = useState(null)
  const [elements,setElements] = useState([])
  const [history,setHistory] = useState([])
  const [drawing,setDrawing] = useState(false)
  const [selectedElement,setSelectedElement] = useState(null)
  const [resizeElement,setResizeElement] = useState(null)
  const [ctx,setctx] = useState(null)
  const [searchResult,setSearchResult] = useState([])
  const canvasRef = useRef()
  const textAreaRef = useRef();
  const [animationStartTime,setAnimationStartTime] = useState(null)
  const [animationTimeline, setAnimationTimeline] = useState([])
  const [animationFrame,setAnimationFrame] = useState([])

  const setBackground = (img) => {
    const element = document.getElementById('canvas_wrapper');
    element.style.backgroundImage = `url('${img}')`;
    element.style.backgroundPosition = 'center';
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundSize = 'cover';
  }
  const setBackgroundPosition = (pos) => {
    const element = document.getElementById('canvas_wrapper');
    element.style.backgroundPosition = pos;
  }
  const setBackgroundSize = (pos) => {
    const element = document.getElementById('canvas_wrapper');
    element.style.backgroundSize = pos;
  }

  const searchUnsplashImages = async (e) => {
    e.preventDefault()
    console.log(e.target.search.value)
    let accessKey = 'dqSeyQ2g_HMdOVHAPGVKtCnS2YcgKejOAAlrJ2JXkJM'
    const url = `https://api.unsplash.com/search/photos?query=${e.target.search.value}&client_id=${accessKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.results);
      setSearchResult(data.results)
    } catch (error) {
      console.error(error);
    }
  }

  const getDefaultStyleForText = (type) => {
    if (type == 1 || type == 4) {
      return {
        color:"black",
        fontStyle:"Arial",
        fontSize:"24px",
        fontBold: false,
        fontItalic: false,
        textAlign: "left",
        letterSpacing:0,
        lineHeight: 32,
        opacity:1,
        lineWidth:0,
        strokeStyle:"",
        shadowColor: "",
        shadowBlur: 0,
        shadowOffsetX:0,
        shadowOffsetY:0,
      }
    } else if(type == 2) {
      return {
        color:"black",
        fontStyle:"Arial",
        fontSize:"48px",
        fontBold: true,
        fontItalic: false,
        textAlign: "center",
        letterSpacing:0,
        lineHeight: 60,
        opacity:1,
        lineWidth:0,
        strokeStyle:"",
        shadowColor: "",
        shadowBlur: 0,
        shadowOffsetX:0,
        shadowOffsetY:0,
      }
    } else if(type == 3) {
      return {
        color:"black",
        fontStyle:"Arial",
        fontSize:"24px",
        fontBold: true,
        fontItalic: false,
        textAlign: "center",
        letterSpacing:0,
        lineHeight: 36,
        opacity:1,
        lineWidth:0,
        strokeStyle:"",
        shadowColor: "",
        shadowBlur: 0,
        shadowOffsetX:0,
        shadowOffsetY:0,
      }
    } 
  }

  const createHistory = () => {
    console.log("New set");
    console.log(elements);
    let new_arr = history
    new_arr.push(elements)
    setHistory(new_arr)
  }

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
    const index = elementsCopy.findIndex(obj => obj.id === id);
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
        elementsCopy[index] = createElement(id,type, newX1, newY1, newX2, newY2,{} );
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
        elementsCopy[index] = createElement(id,type, newX1, newY1, newX2, newY2,{} );
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
        elementsCopy[index] = createElement(id,type, newX1, newY1, newX2, newY2,element.data);
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

  const updateMovingElement = (element,drag,aspect="add") => {
    const {id, x1, y1, x2, y2, type, options} = element
    const elementsCopy = [...elements];
    const index = elementsCopy.findIndex(obj => obj.id === id);
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
        elementsCopy[index] = createElement(id,type, newX1, newY1, newX2, newY2,{} );
        break;
      case "img":
        console.log("here")
        newX1 = x1 + drag.x
        newY1 = y1 + drag.y
        newX2 = x2 + drag.x
        newY2 = y2 + drag.y
        elementsCopy[index] = createElement(id,type, newX1, newY1, newX2, newY2,element.data);
        break;
      case "pencil":
        elementsCopy[index].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
        break;
      case "text":
        const textWidth = document
          .getElementById("canvas1")
          .getContext("2d")
          .measureText(element.data.text).width;
        const textHeight = element.data.style.lineHeight;
        elementsCopy[index] = {
          ...createElement(id,type, x1+drag.x, y1+drag.y, x1+drag.x + textWidth, y1+drag.y + textHeight,element.data)
        };
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    if (aspect == "add") {
      console.log(elementsCopy);
      setElements(elementsCopy); 
    }
  };

  const updateTextElement = (id, x1, y1, x2, y2, type,options) => {
    const elementsCopy = [...elements];
    const index = elementsCopy.findIndex(obj => obj.id === id);
    const textWidth = document
      .getElementById("canvas1")
      .getContext("2d")
      .measureText(options.text).width;
    const textHeight = options.style.lineHeight;
    console.log(textHeight);
    elementsCopy[index] = {
      ...createElement(id, type,x1, y1, x1 + textWidth, y1 + textHeight,{text: options.text, style:options.style})
    };
    setElements(elementsCopy);
    createHistory()
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
        let new_ele_arr = [...elements, ele]
        let new_arr = history
        new_arr.push(new_ele_arr)
        setHistory(new_arr)
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
      console.log(type,x1,y1,x2,y2,data);
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
      if (data?.text) {
        console.log(data);
        ctx.direction = "ltr";
        ctx.fillStyle=data.style.color
        console.log(data.style.fontBold);
        ctx.font = `${data.style.fontItalic ? "italic " : ''}${data.style.fontBold ? "bold " : ''}${data.style.fontSize} ${data.style.fontStyle}`
        ctx.textAlign= data.style.textAlign
        ctx.letterSpacing=data.style.letterSpacing
        ctx.lineHeight= data.style.lineHeight
        ctx.opacity=1
        ctx.lineWidth=data.style.lineWidth
        ctx.strokeStyle=data.style.strokeStyle
        ctx.shadowColor= data.style.shadowColor
        ctx.shadowBlur= data.style.shadowBlur
        ctx.shadowOffsetX= data.style.shadowOffsetX
        ctx.shadowOffsetY= data.style.shadowOffsetY
        ctx.fillText(data.text,x1,y1);
      }

    }
  }


  const getElementAtPosition = (x,y) => {
    let isElement = false
    let boundingBox = null
    for (var i = 0; i < elements.length; i++) {
      let element = elements[elements.length - i - 1]
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
        console.log("Checking Text")
        let minX = Math.min(element.x1,element.x2)
        let maxX = Math.max(element.x1,element.x2)
        let minY = Math.min(element.y1,element.y2)
        let maxY = Math.max(element.y1,element.y2)
        console.log(element);
        console.log(element.x1,element.y1,element.x2,element.y2);
        console.log(minX,maxX,minX,maxY);
        console.log(x,y);
        isElement= x >= minX && x <=maxX && y >= minY && y <=maxY
        console.log(isElement);
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
        clientX - canvasRef.current.offsetLeft,
        clientY - canvasRef.current.offsetTop,
        clientX,
        clientY,
        {
          text:'',
          style:getDefaultStyleForText(1)
        },
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
      console.log(elements);
      console.log(isElement);
      if (isElement) {
        document.body.style.cursor = 'move';
        let offsetX = clientX -  canvasRef.current.offsetLeft
        let offsetY = clientY - canvasRef.current.offsetTop
        setSelectedElement({
          element:{...element,offsetX,offsetY},
          boundingBox:boundingBox
        })
        console.log(selectedElement);
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
      console.log(selectedElement);
      console.log("Text Mouse Up");
      if (selectedElement.type === "text") {
        setActionType("writing");
        return;
      }
    }
    if(elementType == "select" && selectedElement && actionType == "moving") {
      createHistory()
    }
    if (elementType == "select" && resizeElement && actionType == "resize") {
      createHistory()
    }
    if (drawing) {
      createHistory()
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
    const { id, x1, y1, type , data } = selectedElement.element;
    console.log(x1,y1)
    setActionType(null);
    setSelectedElement(null);
    updateTextElement(id, x1, y1, null, null, type, { text: textAreaRef.current.value, style:data.style });
    setElementType('select')
  };

  const undo = () => {
    console.log("History");
    console.log(history);
    let last = []
    if (history.length > 0) {
      last = history.pop()
    }
    setElements(last)
  }

  const deleteSelected = () => {
    if (selectedElement) {
      let idToDelete = selectedElement.element.id
      let new_arr = elements.filter(item => item.id !== idToDelete);
      setElements(new_arr)
    }
  }

  const handleKeyPress = (event) => {
    console.log(event);
    if (event.keyCode === 90 && event.ctrlKey) {
      // Handle control Z keydown event
      undo();
    } else if (event.keyCode === 46) {
      // Handle delete keydown event
      deleteSelected();
    }
  }

  const generateFrame = (currentTime,start) => {
    animationTimeline.push({
      element:elements[0],
      to:{
        x1:0,
        y1:0
      },
      duration:2000,
      delay:0
    })
    const elementsCopy = [...elements];
    for (let i = 0; i < animationTimeline.length; i++) {
      const element = animationTimeline[i].element;
      let progress = (currentTime - start)/animationTimeline[i].duration
      if (progress <= 1) {
        console.log("Progress",progress);
        element.x1 = (element.x1 - animationTimeline[i].to.x1)*progress
        element.y1 = (element.y1 - animationTimeline[i].to.y1)*progress
        const index = elementsCopy.findIndex(obj => obj.id === element.id);
        elementsCopy[index] = element
        setAnimationFrame(elementsCopy)
      }
    }
  }

  const animate = (start) => {
    let currentTime = new Date()
    generateFrame(currentTime,start)
    requestAnimationFrame(animate(start));
  }

  const StartAnimation = () => {
    let start = new Date()
    requestAnimationFrame(animate(start));
  }

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

  useEffect(() => {
    console.log(elements);
    const canvas = document.getElementById("canvas1")
    const ctx1 = canvas.getContext('2d')
    setctx(ctx1)
    ctx1.clearRect(0,0,canvas.width,canvas.height)
    animationFrame.forEach(element => {
      drawElement(element.type, element.x1,element.y1,element.x2,element.y2,element.data)
    });
    // if (selectedElement) {
    //   drawElement(selectedElement.boundingBox.type, selectedElement.boundingBox.x1,selectedElement.boundingBox.y1,selectedElement.boundingBox.x2,selectedElement.boundingBox.y2,{})
    // }
  }, [animationFrame])


  return (
    <div className="App">
      <div className='canvas_wrapper' id="canvas_wrapper">
      <canvas
        id='canvas1'
        width="700"
        height="700"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        tabIndex={0}
        onKeyDown={handleKeyPress}
        ref={canvasRef}
      >
        This is main Canvas
      </canvas>
      </div>
      
      {elementType == 'background'? (
        <>
          <div className='tool_settings'>
            <h4>Choose background</h4>
            <form action="" onSubmit={searchUnsplashImages}>
              <div className='form_cntainer'>
                <input type="text" name="search" placeholder='Search Background' required/>
                <button type='submit'>Search</button>
              </div>
              <span>Or</span>
              <label htmlFor="choose_bgimg">Choose Image</label>
              <input type="file" id="choose_bgimg" />
            </form>
            <div className='tool_settings_gallery'>
              {
                searchResult.map((ins) => {
                  return (
                    <div className='tool_settings_gallery_img' onClick={() => setBackground(ins.urls.regular)}>
                      <img src={ins.urls.small} alt="" />
                    </div>
                  )
                })
              }
              
            </div>
            <div className='tool_properties'>
              <h4>Position</h4>
              <span onClick={() => setBackgroundPosition('top left')}>Top left</span>
              <span onClick={() => setBackgroundPosition('top right')}>Top Right</span>
              <span onClick={() => setBackgroundPosition('bottom left')}>Bottom left</span>
              <span onClick={() => setBackgroundPosition('bottom right')}>Bottom Right</span>
              <span onClick={() => setBackgroundPosition('center')}>Center</span>
              <br />
              <h4>Size</h4>
              <span onClick={() => setBackgroundSize('auto')}>Auto</span>
              <span onClick={() => setBackgroundSize('cover')}>Cover</span>
              <span onClick={() => setBackgroundSize('contain')}>Contain</span>
            </div>
          </div>
        </>
      ):null}
      {actionType === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            top: selectedElement.element.y1 + canvasRef.current.offsetTop,
            left: selectedElement.element.x1 + canvasRef.current.offsetLeft,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
            width:"auto",
            height:"auto"
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
        <div className="toolbar_card" onClick={() => setElementType('background')}>
          <img src={cardicon} />
          <span>Background</span>
        </div>
        <div className="toolbar_card" onClick={() => StartAnimation()}>
          <img src={cardicon} />
          <span>Animation</span>
        </div>
      </div>
      <Layer data={elements} dataHandler={setElements} />
      <TextWorkFlow  elements={elements} selectelementHandler={setSelectedElement} createElement={createElement} actionhandler={setActionType} elementsHandler={setElements} stage={2} />
    </div>
  );
  
}

export default App;
