/*
Text Styles = {
    text:
    styles : {
        color:;
        fontStyle;
        fontSize;
        fontBold:;
        fontItalic:;
        textAlign: left|right|center;
        letterSpacing:;
        lineHeight:;
        opacity:;
        textShadow;
        lineWidth;
        strokeStyle;
        shadowColor;
        shadowBlur;
        shadowOffsetX;
        shadowOffsetY;
    }
}
*/

import { useState } from 'react';
import './workflow.css';


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
        textAlign: "left",
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
        textAlign: "left",
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

const TextAddStage = ({stage, selectelementHandler, createElement, actionhandler, elementsHandler, elements}) => {
    const addText = (type) => {
        let ele = createElement(
            elements.length,
            "text",
            150,
            150,
            150,
            150,
            {
              text:'',
              style:getDefaultStyleForText(type)
            },
          )
          elementsHandler((prev) => {
            return [...prev,ele]
          })
          selectelementHandler({
            element:{...ele}
          });
          actionhandler("writing")
    }

    return (
        <div className='workflow_container'>
            <div className='workflow_section'>
                <button className='workflow_action_button' onClick={() => addText(1)}>Add Text</button>
            </div>
            <div className='workflow_section'>
                <h3 className='workflow_heading'>Standard Texts</h3>
                <button className='workflow_action_button' onClick={() => addText(2)}>Add Heading</button>
                <button className='workflow_action_button' onClick={() => addText(3)}>Add Sub Heading</button>
                <button className='workflow_action_button' onClick={() => addText(1)}>Add Body</button>
            </div>
        </div>
    )
}

const TextWorkFlow = ({stage, selectelementHandler, createElement, actionhandler, elementsHandler, elements}) => {
    return (
        <>
            { stage == 1? <TextAddStage elements={elements} selectelementHandler={selectelementHandler} createElement={createElement} actionhandler={actionhandler} elementsHandler={elementsHandler} /> : null }
        </>
    )
}

export default TextWorkFlow;