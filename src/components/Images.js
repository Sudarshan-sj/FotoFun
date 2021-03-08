import React, {useState,useRef,useEffect,useCallback} from 'react'
import Img from './image';
import Webcam from "react-webcam";
import {Card,Button} from 'react-bootstrap';
import localIpUrl from "local-ip-url";

export default function Images(){


	const[images,setimages] = useState([]);
  const[displaydetails,setdisplaydetails] = useState(false);
  const webcamRef = useRef(null);
  const [newImageUrl,setNewImageUrl] = useState({"img":null,"date":null,"time":null,"latitude":null,"longitude":null,"city":null,"ip":null});
  
  const download = e => {
    console.log(e);
    fetch(e, {
      method: "GET",
      headers: {}
    })
      .then(response => {
        response.arrayBuffer().then(function(buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.png"); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch(err => {
        console.log(err);
      });
  };


	function ShowImage(){
		return images.map((img,index)=>(
     <>
      <Card bg="primary" style={{margin:'20px', border:'2px solid black'}}>
        <Card.Body> 
          <Img image={img.img} handleRemove={handleRemove} index={index} key={index}/>
          <Card.Text onClick={e=>download(img.img)} color="black">Download</Card.Text>
          <Card.Text onMouseEnter={()=>setdisplaydetails(true)} onMouseLeave={()=>setdisplaydetails(false)}>Details</Card.Text>
          <Card.Text className={`${displaydetails? "":"hidden"}`}>
            <div>Date = {img.date}</div>
            <div>Time = {img.time}</div>
            <div>Long = {img.longitude}</div>
            <div>Lat  = {img.latitude}</div>
            <div>City = {img.city}</div>
            <div>IP   = {img.ip}</div>
          </Card.Text>
        </Card.Body>
      </Card>
     </>
     ));
	}

  // Step 1: Get user coordinates 
function getCoordintes() { 
  var options = { 
    enableHighAccuracy: true, 
    timeout: 5000, 
    maximumAge: 0 
  }; 

  function success(pos) { 
    var crd = pos.coords; 
    var lat = crd.latitude.toString();
    newImageUrl["latitude"] = lat 
    console.log(newImageUrl["latitude"]);
    var lng = crd.longitude.toString();
    newImageUrl["longitude"] = lng 
    var coordinates = [lat, lng]; 
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);  
    return(coordinates) ; 

  } 

  function error(err) { 
    console.warn(`ERROR(${err.code}): ${err.message}`); 
  } 

  console.log(navigator.geolocation.getCurrentPosition(success, error, options)); 
} 
 
function getCity(coordinates) { 
  var xhr = new XMLHttpRequest(); 
  var lat = coordinates[0]; 
  var lng = coordinates[1]; 

  // Paste your LocationIQ token below. 
  xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.0adf33fd539b3c15385b32b6adcb4736&lat=" + 
  lat + "&lon=" + lng + "&format=json", true); 
  xhr.send(); 
  xhr.onreadystatechange = processRequest; 
  xhr.addEventListener("readystatechange", processRequest, false); 

  function processRequest(e) { 
    if (xhr.readyState == 4 && xhr.status == 200) { 
      var response = JSON.parse(xhr.responseText);
      console.log(response) 
      var city = response.address.state_district; 
      return; 
    } 
    else{
      console.log("Cannot get city",xhr.readyState,xhr.status);

    }
  } 
} 



	function handleAdd(){
    newImageUrl.img = webcamRef.current.getScreenshot();
    var today = new Date();
    newImageUrl["date"] = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    newImageUrl["time"] = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    getCoordintes();
    var city="Kollam";
    getCity([newImageUrl["latitude"],newImageUrl["longitude"]]);
    console.log(newImageUrl)
    newImageUrl["ip"] =  localIpUrl('public','ipv4');
    newImageUrl["city"]=city;
	  if(newImageUrl["img"]!="")
    {
		setimages([
        newImageUrl,
        ...images,
		]);
		setNewImageUrl({"img":null,"date":null,"time":null,"latitude":null,"longitude":null,"city":null,"ip":null});
    }

	}

	function handleRemove(index){
        setimages(images.filter((image,i)=>i!=index));
        // setimages([...images.slice(0,index),...images.slice(index+1,images.length),]);
	}

	return(
        <section>
        <div className="flex justify-center my-5"> 
           <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
           />
        </div>
        <Button variant="primary" size="lg" block onClick={handleAdd}>Capture photo</Button>
         <div className="flex flex-wrap justify-center">
           <ShowImage />
         </div>
        </section>

	);
}


