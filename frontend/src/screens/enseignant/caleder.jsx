import React from 'react';
import { IoIosArrowDropright } from 'react-icons/io';
import { IoIosArrowDropleft } from 'react-icons/io';
class Calendrier extends React.Component {
      
    constructor(props) {
        super(props)
       
        this.state = {
          
            event:[],
            j:0,
            image:"",
      
        title:"",
           myArray: [
     
          ],
          date:"",
          };
     
    }

 

     handleClick = (day) => {
        console.log('Item clicked!', day);
      };
    componentDidMount(){
    
            // renderCalender();
        
     

          const currerntDate = document.querySelector(".current-date");
          var  daysTag = document.querySelector(".days"); 
            let   prevNextIcon=document.querySelectorAll(".icons span")
          let date= new Date;
         let currYear=date.getFullYear();
          let currMonth=date.getMonth();
          let currDay=date.getDate();
          const months=["Janvier" ,"Février" ,"Mars", "Avril", "Mai", "Juin", "Juillet" , "Août","Septembre " ,"Octobre","Novembre ","Décembre"]
          const renderCalender=()=>{
            let firstDayofMonth=new Date(currYear, currMonth, 0).getDay(),
             lastDateofMonth=new Date(currYear, currMonth + 1 , 0).getDate(),
             lastDayeofMonth=new Date(currYear, currMonth  , lastDateofMonth).getDay(),

             lastDateofLastMonth=new Date(currYear, currMonth  , 0).getDate();

              let liTag="";

              for (let i = firstDayofMonth; i>0; i--) {
                liTag +=  ` <li class="inactive">${lastDateofLastMonth- i +1}</li>`         
                
              }
              let lengtharay=this.state.myArray.length;
           
              for (let i = 1; i <= lastDateofMonth; i++) {
                
       
                
                let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                        && currYear === new Date().getFullYear() ? "active" : ""

               
                let dayEvent=""
                    let isEventDay=""
                   
                        for (let j = 0; j < this.state.myArray.length; j++) {
                            if(i=== new Date(this.state.myArray[j].date).getDate() && currMonth === new Date(this.state.myArray[j].date).getMonth()
                        && currYear === new Date(this.state.myArray[j].date).getFullYear() ){
                                
                           dayEvent =this.state.myArray[j].title;
                           isEventDay="isEvent"

                           
                        } 
                         
                    }
                 
                  
                    
                      liTag += `
                        <li class="${isToday === '' ? isEventDay : isToday}" )()">
                          ${i}
                          <div class="${dayEvent !== '' ? 'hover-container' : ''}">
                            ${dayEvent}
                          </div>
                        </li>
                      `;
                      

                       
              }
              
              for (let i = lastDayeofMonth; i < 6; i++) {
                liTag +=  ` <li class="inactive">${i- lastDayeofMonth +1}</li>` ;        
                
              }
              currerntDate.innerText=`${months[currMonth]} ${currYear}`
              daysTag.innerHTML=liTag;
              const d= document.querySelectorAll('.days li');

              d.forEach(icon => {
                icon.addEventListener("click",()=> {
                //    console.log(icon.textContent , months[currMonth],currYear)
                const numberRegex = /\d+/; // Matches one or more digits

                   for (let j = 0; j < this.state.myArray.length; j++) {

                   

                    if(icon.textContent.match(numberRegex)[0] == new Date(this.state.myArray[j].date).getDate() && currMonth === new Date(this.state.myArray[j].date).getMonth()
                && currYear === new Date(this.state.myArray[j].date).getFullYear() ){
                        
                    this.setState({ title:this.state.myArray[j].title});
                    this.setState({date :new Date(this.state.myArray[j].date).getDate()+"/"+new Date(this.state.myArray[j].date).getMonth()+"/"+new Date(this.state.myArray[j].date).getFullYear()});
                    this.setState({image : "https://dashboard.futurevisions.tn/"+this.state.myArray[j].image});


                   
                }  else{
                  


                 } 
            
                 
            }
                })
              })
              

          }
         
          prevNextIcon.forEach(icon => {
            icon.addEventListener("click",()=> {
                currMonth= icon.id === "prev" ? currMonth -1 :currMonth +1;

                if(currMonth <0 || currMonth >11){
                    date = new Date(currYear , currMonth);
                    currYear = date.getFullYear();
                    currMonth = date.getMonth();
                }else{
                   date = new Date(); 
                }
                renderCalender();

            })
          })
          renderCalender();
      }
    
    render(){
        

     
        return (
           
                   
                <div className="">
          
                    <div className=" calendrier">
                        <div className='event'>
                          Details
                            <div className='event-date'>
                                    <span>{this.state.date}</span>
                            </div>
                            
                        </div>
                     <div className="wrapper">
                        <header>
                            <p className=" current-date"> </p>
                                <div className="icons">
                                    <span  id="prev" className="material-symbols-rounded mx-1"> < IoIosArrowDropleft/></span>
                                    <span id='next' className="material-symbols-rounded mx-1"><IoIosArrowDropright/></span>                               
                               </div>
                        </header>
                        <div className='calendar'>
                            <ul className='weeks'>
                                <li>Lu</li>
                                <li>Ma</li>
                                <li>Me</li>
                                <li>Je</li>
                                <li>Ve</li>
                                <li>Sa</li>
                                <li>Di</li>
                            </ul>
              
                            <ul className='days'>
                                    


                            </ul>
                        </div>
                        </div>  
                    </div>
                </div>

        );
    }
}
 



  
  export default Calendrier;