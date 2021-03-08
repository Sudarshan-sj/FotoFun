import React, {useState} from "react";
import "./assets/css/style.css";
import Images from "./components/Images";
import {Card} from "react-bootstrap"


function App(){
    
	return (
	  <Card style={{width:"full", margin:"5px", padding:'10px', border:'2px solid black'}}>
	    <section className="flex justify-center">
	      
	      <div>
	        <div className="text-center">
	         <div className="my-4"><h1>Foto Fun</h1></div>
	          <Images />
	         </div>
	        </div>
	    </section>
      </Card>
	);
}

export default App