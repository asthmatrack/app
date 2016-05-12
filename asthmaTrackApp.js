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
    h += '<hr><div id="myAsthmaPlanDiv"><img id="myAsthmaPlan" class="zoomTarget"></div>'
    h += '</div>'
    //sbmApps.getScripts([],fun)
    sbmApps.render(h)
    //document.body.innerHTML=h
    sbmApps.getScripts(['https://asthmatrack.github.io/app/src/localforage.js'],function(){
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
                    h += '<p style="background-color:yellow;text-align:center">Time since MEDICAL ALERT: <span id="timeSinceALERT" style="color:blue;font-size:xx-large">0:00</span></p>'
                    howDoYouFeelTxt.innerHTML=h
                    howDoYouFeelTxt.alertTimeCounter = {}
                    howDoYouFeelTxt.alertTimeCounter.time0=new Date()
                    howDoYouFeelTxt.alertTimeCounter.t=setInterval(function(){
                        var t = (new Date()-howDoYouFeelTxt.alertTimeCounter.time0)
                        var mm = Math.floor(t/1000/60)
                        var ss = Math.round((t-mm*60*1000)/1000)
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
            h='<h3> <button id="asthmaLogBookSave" style="font-size:x-large">Save</button> in your Log Book:</h3>'
            h += '<p style="font-style:italic">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Used Inhaler <input id="usedInhaler" type="checkbox"> / Spacer <input id="usedSpacer" type="checkbox"> <a href="http://www.asthma.ca/adults/treatment/spacers.php">?</a></p>'
            h += '<p style="font-style:italic">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Took Medicine <input id="tookPills" type="checkbox"> <span style="font-size:medium">(pill / tablet)</span></p>'
            h += '<p style="font-style:italic">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Indoors <input id="amIndoors" type="checkbox"> / Outdoors <input id="amOutdoors" type="checkbox"></p>'
            h += '<p style="font-style:italic">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Exercising <input id="amExercising" type="checkbox"> / Not <input id="notExercising" type="checkbox"></p>'

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
                                  /*
                                  localforage.setItem('myAsthmaHistory',[
                                    ['Well',     new Date(2000, 8, 5), new Date(2001, 1, 5)],
                                    ['Caution', new Date(2001, 8, 5), new Date(2002, 1, 5)],
                                    ['Alert', new Date(2002, 8, 5), new Date(2003, 1, 5)],
                                    ['Well', new Date(2003, 8, 5), new Date(2004, 1, 5)],
                                    ['Alert', new Date(2004, 8, 5), new Date(2005, 1, 5)],
                                    ['Caution',  new Date(2005, 8, 5), new Date(2006, 1, 5)],
                                    ['Well',   new Date(2006, 8, 5), new Date(2007, 1, 5)],
                                    ['Well',      new Date(2007, 8, 5), new Date(2008, 1, 5)],
                                    ['Caution',  new Date(2008, 8, 5), new Date(2009, 1, 5)],
                                    ['Well',   new Date(2009, 8, 5), new Date(2010, 1, 5)],
                                    ['Alert',    new Date(2010, 8, 5), new Date(2011, 1, 5)],
                                    ['Well',      new Date(2011, 8, 5), new Date(2012, 1, 5)],
                                    ['Caution',     new Date(2012, 8, 5), new Date(2013, 1, 5)],
                                    ['Alert',     new Date(2013, 8, 5), new Date(2014, 1, 5)],
                                  ])
                                  */
                            })    
                        }
                        howDoYouFeelDiv.drawChart=drawChart
                     })
                //}
            }
            loadAsthmaHistory()

        

    })
        


})()

