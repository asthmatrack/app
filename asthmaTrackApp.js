console.log('loaded myAsthma.js :-)');

(function(){
    //document.body.style.backgroundColor="silver"
    var h ='</div>'
    //h += '<h2 style="color:maroon">Asthma tracker</h2>'
    h += '<h3 style="color:navy" id="msg"> Start by loading an Action Plan:</h3>'
    h += '<h3 id="loadFileDiv"><input type="file" id="inputFile" class="btn btn-primary btn-md"></h3>'
    h += '<hr>'
    h += '<div id="myAsthmaHistoryDiv" style="color:red">'
    h += 'loading history ...'
    h += '</div>'
    h += '<div id="myAsthmaPlotDiv" style="color:red">ploting ...</div>'
    h += '<div id="howDoYouFeelDiv">'
        //h += 'How do you feel'
        h += '<table id="howDoYouFeelTable"><tr>'
            h += '<td id="howDoYouFeelIcons" style="font-size:50px;border:solid;border-color:white;border-width:10px">'
                h += '<div id="feelWell" style="color:green"><i class="fa fa-smile-o"></i></div>'
                h += '<div id="feelNotso" style="color:orange"><i class="fa fa-meh-o"></i></div>'
                h += '<div id="feelAlert" style="color:red"><i class="fa fa-frown-o"></i></div>'
            h += '</td>'
            h += '<td id="howDoYouFeelTxt" style="font-size:16px">'
            h += '<i><p><b>How do you feel today?</b></p><p><i class="fa fa-arrow-left"></i> choose between <b style="color:green">Well</b> (no coughing or problems breathing), <b style="color:orange">Caution</b> (wheezing, tight chest, waking up at nigh because of asthma), and <b style="color:red">Alert</b> (very short of breath, medication not helping).</p></i>'
            h += '</td>'
        h += '</tr></table>'
    h += '</div>'
    h += '<hr><div id="myAsthmaPlanDiv"><img id="myAsthmaPlan" width="100%"></div>'
    h += '</div>'
    //sbmApps.getScripts([],fun)
    sbmApps.render(h)
    //document.body.innerHTML=h    
    sbmApps.getScripts(['https://asthmatrack.github.io/app/src/localforage.js','https://cdn.plot.ly/plotly-latest.min.js'],function(){
        var reader = new FileReader()
        reader.onload=function(f){
            //localStorage.removeItem('myAsthmaPlan') // otherwiese localStorage may be full
            localforage.setItem('myAsthmaPlan',f.target.result,function(err,x){
                console.log('pic size '+f.total+' saved in localforage')
                loadImg()
            })
            
        }

        var showPlan=function(){
            console.log('show asthma action plan on file')
            myAsthmaPlanDiv.hidden=false
            myAsthmaPlan.style.width="100%"
        }

        /*

        var hidePlan=function(){
            console.log('hide asthma action plan')
            myAsthmaPlanDiv.hidden=true
            myAsthmaPlan.style.width="100%"
        }

        var triggerPlan=function(){
            if(document.getElementById('gotoPlanOnFile')){
                gotoPlanOnFile.onclick=function(tg){
                    if(myAsthmaPlanDiv.hidden){
                        showPlan()
                    }else{
                        hidePlan()
                    }
                }
            }
        }

        */

        var loadImg=function(){
            localforage.getItem('myAsthmaPlan',function(er,imgSrc){
                if(imgSrc){
                    myAsthmaPlan.src=imgSrc
                    msg.innerHTML='<button class="btn btn-primary btn-lg" id="gotoPlanOnFile">See asthma plan</button> or load new: <button id="addPlan" class="btn btn-primary btn-md">+</button>'
                    loadFileDiv.hidden=true
                    gotoPlanOnFile.onclick=function(){
                    howDoYouFeelDiv.scrollIntoView()
                }
                //triggerPlan()
                //gotoPlanOnFile.click()
                addPlan.onclick=function(){
                    if(loadFileDiv.hidden){
                        loadFileDiv.hidden=false
                        addPlan.textContent="-"
                    }else{
                        loadFileDiv.hidden=true
                        addPlan.textContent="+"
                    }

                }
                //loadFileDiv.hidden=true
            }else{
                setTimeout(function(){
                    myAsthmaPlan.src="https://asthmatrack.github.io/app/img/asthmaPlanGetYourOwn.png"
                },1000)
            }
            })
            
        }
        inputFile.onchange=function(evt){
            var ff = evt.target.files
            reader.readAsDataURL(ff[0])
        }
        loadImg()


        //triggerPlan() // trigger show/hide behavior for gotoPlanOnFile button    

        // how do you feel
        feelWell.onmouseover=feelNotso.onmouseover=feelAlert.onmouseover=function(){
            if(!this.clicked){
                this.style.fontSize=60
            }
        }
        //onmouseleave
        feelWell.onmouseleave=feelNotso.onmouseleave=feelAlert.onmouseleave=function(){
            if(!this.clicked){
                this.style.fontSize=50
            }
        }

        // save event listener
            asthmaLogBookSaveOnclick=function(){
                asthmaLogBookSave.onclick=function(){
                var bt = this
                bt.textContent='saving ...'
                bt.disabled=true
                localforage.getItem('myAsthmaHistory', function(err, dt) {
                    var book ={
                        color:bt.parentElement.parentElement.parentElement.style.color,
                        usedInhaler:usedInhaler.checked,
                        usedSpacer:usedSpacer.checked,
                        tookPills:tookPills.checked,
                        amIndoors:amIndoors.checked,
                        amOutdoors:amOutdoors.checked,
                        amExercising:amExercising.checked,
                        notExercising:notExercising.checked
                    }
                    switch(book.color) {
                        case "green":
                                book.status='Well'
                            break
                        case "orange":
                                book.status='Caution'
                            break
                        case "red":
                                book.status='Alert'
                            break
                    }
                    var tnow = new Date()
                    dt.book[tnow]=book
                    dt.tarray.push([book.status,tnow,new Date(tnow.getTime()+1000)])
                    var n = dt.tarray.length
                    if(n>4){ // past seed values
                        dt.tarray[n-2][2]=tnow
                    }
                    localforage.setItem('myAsthmaHistory', dt, function(err,dt){
                        setTimeout(function(){
                            bt.textContent='Save'
                            bt.disabled=false
                        },1000)
                        howDoYouFeelDiv.drawChart()
                    })
                    4
                })
                4
                                    }
            }

        feelWell.onclick=feelNotso.onclick=feelAlert.onclick=function(){
            //console.log(Date())
            feelWell.clicked=feelNotso.clicked=feelAlert.clicked=false
            feelWell.style.fontSize=feelNotso.style.fontSize=feelAlert.style.fontSize=50
            this.clicked=true
            this.style.fontSize=75
            howDoYouFeelTxt.style.color=this.style.color
            howDoYouFeelTxt.style.backgroundColor=''
            var h = ''
            switch(this.style.color) {
                case "green":
                    console.log('feeling Well')
                    howDoYouFeelTxt.style.verticalAlign="top"
                    var h = 'Glad to hear that. Please consult Asthma medical plan and record medication.'
                    break
                case "orange":
                    console.log('feeling not so Well')
                    howDoYouFeelTxt.style.verticalAlign="middle"
                    var h = 'Sorry to hear that. Please record medication.'
                    break
                case "red":
                    console.log('MEDICAL ALERT.')
                    howDoYouFeelTxt.style.verticalAlign="bottom"
                    var h = 'This could be a medical emergency. Please consult your Asthma Medical plan for immediate relief and follow the EMERGENCY plan if you can\'t reach your doctor after <span style="color:blue">15 minutes</span>.'
                    h += '<p id="alertTimerBanner" style="background-color:yellow;text-align:center">Time since MEDICAL ALERT: <span id="timeSinceALERT" style="color:blue;font-size:xx-large">0:00</span></p>'
                    howDoYouFeelTxt.innerHTML=h
                    howDoYouFeelTxt.alertTimeCounter = {}
                    howDoYouFeelTxt.alertTimeCounter.time0=new Date()
                    howDoYouFeelTxt.alertTimeCounter.t=setInterval(function(){
                        var t = (new Date()-howDoYouFeelTxt.alertTimeCounter.time0)
                        var mm = Math.floor(t/1000/60)
                        var ss = Math.round((t-mm*60*1000)/1000)
                        if(mm>14){
                            alertTimerBanner.style.backgroundColor=""
                            setTimeout(function(){alertTimerBanner.style.backgroundColor="yellow"},250)
                            setTimeout(function(){alertTimerBanner.style.backgroundColor=""},500)
                            setTimeout(function(){alertTimerBanner.style.backgroundColor="yellow"},750)
                        }
                        if(ss.toString().length<2){ss = '0'+ss.toString()}
                        if(document.getElementById('timeSinceALERT')){
                            timeSinceALERT.textContent=mm+':'+ss
                        }
                    },1000)

                    break
                default:
                    console.log(4)
                    break
            }

            // add recording UI
            h += '<div id="asthmaActionRecordUI" style="font-size:x-large">...</div>'
            howDoYouFeelTxt.innerHTML=h
            h='<h3> <button id="asthmaLogBookSave" style="font-size:x-large">Save</button> in Log Book:</h3>'
            h += '<p style="font-style:italic;font-size:large">&nbsp Used Inhaler <input id="usedInhaler" type="checkbox"> / Spacer <input id="usedSpacer" type="checkbox"> <a href="https://www.youtube.com/watch?v=BbONuRXJdr0" target="_blank">?</a></p>'
            h += '<p style="font-style:italic;font-size:large">&nbsp Took Medicine <input id="tookPills" type="checkbox"> <span style="font-size:medium">(pill / tablet)</span></p>'
            h += '<p style="font-style:italic;font-size:large">&nbsp Indoors <input id="amIndoors" type="checkbox"> / Outdoors <input id="amOutdoors" type="checkbox"></p>'
            h += '<p style="font-style:italic;font-size:large">&nbsp Exercising <input id="amExercising" type="checkbox"> / Not <input id="notExercising" type="checkbox"></p>'

            asthmaActionRecordUI.innerHTML=h
            // button decoration
            switch(this.style.color) {
                case "green":
                    asthmaLogBookSave.className="btn btn-success"
                    break
                case "orange":
                    asthmaLogBookSave.className="btn btn-warning"
                    break
                case "red":
                    asthmaLogBookSave.className="btn btn-danger"
                    break
            }
            asthmaLogBookSaveOnclick()

            
        }


        // load history
            var loadAsthmaHistory=function(){
                //if(localStorage.asthmaHistory){
                    console.log('loading asthma history')
                    $.getScript('https://www.gstatic.com/charts/loader.js')
                     .then(function(){
                        //var asthmaHistory=JSON.parse(localStorage.asthmaHistory) 
                        google.charts.load('current', {'packages':['timeline']});
                        google.charts.setOnLoadCallback(drawChart);

                        function drawChart() {
                            localforage.getItem('myAsthmaHistory',function(err,dt){
                                if(dt){
                                    var data = new google.visualization.DataTable();
                                    //data.addColumn('string', 'Term');
                                    data.addColumn('string', 'Team');
                                    data.addColumn('date', 'Start Date');
                                    data.addColumn('date', 'End Date');
                                    data.addRows(dt.tarray);
                                    var options = {
                                        height: 180,
                                        timeline: {
                                          groupByRowLabel: true
                                        },
                                        colors: ['green', 'orange', 'red']
                                      }
                                    var chart = new google.visualization.Timeline(myAsthmaHistoryDiv);
                                    chart.draw(data, options);
                                    //asthmaLogBookSaveOnclick()

                                    

                                    myAsthmaPlotDiv.innerHTML='<button id="daySelected" style="font-size:large">day</button> <button  id="weekSelected" style="font-size:large">week</button> <button id="monthSelected" style="font-size:large">month</button> <button id="yearSelected" style="font-size:large">year</button><div id="asthmaPlotLy"></div>'
                                    daySelected.onclick=weekSelected.onclick=monthSelected.onclick=yearSelected.onclick=function(){
                                        myAsthmaPlotDiv.selected=this.textContent
                                        updateButtons()
                                        console.log('myAsthmaPlotDiv.selected="'+myAsthmaPlotDiv.selected+'"')
                                    }
                                    var updateButtons = function(){
                                        if(!myAsthmaPlotDiv.selected){
                                            myAsthmaPlotDiv.selected="week" // default 
                                        }
                                        $('button',myAsthmaPlotDiv).map(function(i,bt){
                                            if(bt.textContent==myAsthmaPlotDiv.selected){
                                                bt.style.color="blue"
                                                bt.style.fontSize="x-large"
                                            }else{
                                                bt.style.color="red"
                                                bt.style.fontSize="large"
                                            }
                                            4
                                        })
                                    }
                                    updateButtons()

                                    //extract data from entries in log book into plotly notation

                                    var getDataColor = function(dt,color,y){
                                        if(!color){color="orange"}
                                        if(!y){
                                            y={
                                                mode: 'markers',
                                                name: 'Well',
                                                marker: {
                                                  color: color,
                                                  line: {color: 'black'}
                                                },
                                                type: 'scatter',
                                                log:[]
                                            }
                                        }
                                        Object.getOwnPropertyNames(dt.book).forEach(function(p){
                                            var d = dt.book[p]
                                            if(d.color==color){
                                                y.log.push(p)
                                            }
                                        })
                                        return y
                                    }

                                    var dtGreen = getDataColor(dt,'green')
                                    var dtOrange = getDataColor(dt,'orange')
                                    var dtRed = getDataColor(dt,'red')

                                    var calcPolar = function(x){
                                        // scale axis
                                        switch(myAsthmaPlotDiv.selected){
                                            case "day":
                                                break;
                                            case "week":
                                                console.log('working scales for '+myAsthmaPlotDiv.selected)
                                                var getRT=function(l){
                                                    var dayOfWeek=function(l){
                                                        if(!l){l=Date()}
                                                        var dw //day of the week
                                                        switch(l.slice(0,3)){
                                                            case "Sun":
                                                                dw=0
                                                            break;
                                                            case "Mon":
                                                                dw=1
                                                            break;
                                                            case "Tue":
                                                                dw=2
                                                            break;
                                                            case "Wed":
                                                                dw=3
                                                            break;
                                                            case "Thu":
                                                                dw=4
                                                            break;
                                                            case "Fri":
                                                                dw=5
                                                            break;
                                                            case "Sat":
                                                                dw=6
                                                            break;
                                                        }
                                                        l = new Date(l)
                                                        dw += (l.getHours()+l.getMinutes()/60+l.getSeconds()/360)/24
                                                        return dw
                                                    }
                                                    var l0 = Date() // now as a string
                                                    dw0=dayOfWeek(l0) // day of the week right now
                                                    l0 = new Date(l0) // now as a Date object
                                                    var RT = x.log.map(function(li){
                                                        // calculate time in fraction of a week since beginning of the week
                                                        var tm = (dw0+(l0.getTime()-(new Date(li)).getTime())/(3600*1000*24))/7
                                                        return [tm-Math.floor(tm),Math.floor(tm)]
                                                    })
                                                    RT.filter(function(rt){
                                                        return rt[1]<=5 // cap it at 5 weeks
                                                    })
                                                    x.r=[]
                                                    x.t=[]
                                                    RT.forEach(function(rt){
                                                        x.r.push(7-rt[1])
                                                        x.t.push(rt[0]*360)
                                                    })
                                                    return x
                                                }
                                            break;
                                            case "month":
                                                break;
                                            case "year":
                                                break;
                                        }


                                        /*
                                        x.r=[]
                                        x.t=[]
                                        x.log.forEach(function(l){
                                            var rt = getRT(l)
                                            x.r.push(rt[0])
                                            x.r.push(rt[1])
                                        })
                                        */


                                        return getRT(x)
                                    }
                                    dtGreen=calcPolar(dtGreen)
                                    dtOrange=calcPolar(dtOrange)
                                    dtRed=calcPolar(dtRed)
                                    
                                    4
                                }else{
                                    localforage.setItem('myAsthmaHistory',
                                       {"tarray":
                                        [
                                            ['Well',     new Date(), new Date(Date.now()+1000)],
                                            ['Caution', new Date(), new Date(Date.now()+1000)],
                                            ['Alert', new Date(), new Date(Date.now()+1000)]
                                        ],
                                        "book":{}
                                       },function(){
                                            drawChart()
                                    })

                                }
                                // plotLy at myAsthmaPlotDiv

                                
                                

                                /*
                                data.push({
                                  r: [1, 0.995, 0.978, 0.951, 0.914, 0.866, 0.809, 0.743, 0.669, 0.588, 0.5, 0.407, 0.309, 0.208, 0.105, 0, 0.105, 0.208, 0.309, 0.407, 0.5, 0.588, 0.669, 0.743, 0.809, 0.866, 0.914, 0.951, 0.978, 0.995, 1, 0.995, 0.978, 0.951, 0.914, 0.866, 0.809, 0.743, 0.669, 0.588, 0.5, 0.407, 0.309, 0.208, 0.105, 0, 0.105, 0.208, 0.309, 0.407, 0.5, 0.588, 0.669, 0.743, 0.809, 0.866, 0.914, 0.951, 0.978, 0.995, 1],
                                  t: [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126, 132, 138, 144, 150, 156, 162, 168, 174, 180, 186, 192, 198, 204, 210, 216, 222, 228, 234, 240, 246, 252, 258, 264, 270, 276, 282, 288, 294, 300, 306, 312, 318, 324, 330, 336, 342, 348, 354, 360],
                                  mode: 'markers',
                                  name: 'Figure8',
                                  marker: {
                                    color: 'none',
                                    line: {color: 'peru'}
                                  },
                                  type: 'scatter'
                                });
                                */
                                data=[dtGreen,dtOrange,dtRed]

                                /*data.push({
                                  r:[0,0.15,0.2,0.3,0.4,0.5],
                                  t:[0,10,20,30,40,50],
                                  mode: 'markers',
                                  name: 'Well',
                                  marker: {
                                    color: 'green',
                                    line: {color: 'black'}
                                  },
                                  type: 'scatter'
                                })
                                */

                                // get times from book

                                var Ind = Object.getOwnPropertyNames(dt.book);

                                var tt = Ind.map(function(ti){ // array of times
                                    return new Date(ti)
                                })

                                var cr = tt.map(function(ti){ // array of color of how u feel
                                    return dt.book[ti].color
                                })

                                


                                4
                                



                                var layout = {
                                  title: 'Mic Patterns',
                                  font: {
                                    family: 'Arial, sans-serif;',
                                    size: 12,
                                    color: '#000'
                                  },
                                  showlegend: true,
                                  width: 500,
                                  height: 400,
                                  margin: {
                                    l: 40,
                                    r: 40,
                                    b: 20,
                                    t: 40,
                                    pad: 0
                                  },
                                  paper_bgcolor: 'rgb(255, 255, 255)',
                                  plot_bgcolor: 'rgb(255, 255, 255)',
                                  orientation: -90
                                };

                                Plotly.newPlot('asthmaPlotLy', data, layout);


                                
                                4
                                
                            })    
                        }
                        howDoYouFeelDiv.drawChart=drawChart
                     })
                //}
            }
            loadAsthmaHistory()

            // PlotLy
            console.log('ready for plotly')

            asthmaPlot=function(){
                
            }

            asthmaPlot()

            4



        

    })
        


})()



// --- Experiments ---

var fb=function(){ // firebase experiments
    fbFun=function(x){
        console.log(9)
    }
    if(typeof(firebase)){
        fbFun()
    }else{
        $.getScript('https://www.gstatic.com/firebasejs/live/3.0/firebase.js',fbFun)
    }
    

}

/*


<script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDBKhPwrVFgF4qPI0VxZLULW68eIcslQxs",
    authDomain: "asthma-34354.firebaseapp.com",
    databaseURL: "https://asthma-34354.firebaseio.com",
    storageBucket: "",
  };
  firebase.initializeApp(config);
</script>
    

*/
