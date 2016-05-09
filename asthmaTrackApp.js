console.log('loaded myAsthma.js :-)');

(function(){
    //document.body.style.backgroundColor="silver"
    var h ='</div>'
    //h += '<h2 style="color:maroon">Asthma tracker</h2>'
    h += '<h3 style="color:navy" id="msg"> Start by loading an Action Plan:</h3>'
    h += '<h3 id="loadFileDiv"><input type="file" id="inputFile" class="btn btn-primary btn-md"></h3>'
    h += '<hr>'
    h += '<div id="myAsthmaHistoryDiv">'
    h += 'history'
    h += '</div>'
    h += '<div id="howDoYouFeelDiv">'
        //h += 'How do you feel'
        h += '<table id="howDoYouFeelTable"><tr>'
            h += '<td id="howDoYouFeelIcons" style="font-size:50px;border:solid;border-color:white;border-width:10px">'
                h += '<div id="feelFine" style="color:green"><i class="fa fa-smile-o"></i></div>'
                h += '<div id="feelNotso" style="color:orange"><i class="fa fa-meh-o"></i></div>'
                h += '<div id="feelBad" style="color:red"><i class="fa fa-frown-o"></i></div>'
            h += '</td>'
            h += '<td id="howDoYouFeelTxt" style="font-size:16px">'
            h += '<i><p><b>How do you feel today?</b></p><p><i class="fa fa-arrow-left"></i> choose between <b style="color:green">Fine</b> (no coughing or problems breathing), <b style="color:orange">Not good</b> (wheezing, tight chest, waking up at nigh because of asthma), and <b style="color:red">Bad</b> (very short of breath, medication not helping).</p></i>'
            h += '</td>'
        h += '</tr></table>'
    h += '</div>'
    h += '<hr><div id="myAsthmaPicDiv" hidden><img id="myAsthmaPic" class="zoomTarget"></div>'
    h += '</div>'
    //sbmApps.getScripts([],fun)
    sbmApps.render(h)
    //document.body.innerHTML=h
    var reader = new FileReader()
    reader.onload=function(f){
        localStorage.removeItem('myAsthmaPic') // otherwiese localStorage may be full
        localStorage.setItem('myAsthmaPic',f.target.result)
        console.log('pic size '+f.total+' saved in localStorage')
        loadImg()
        showPlan()
    }

    var showPlan=function(){
        console.log('show asthma action plan on file')
        myAsthmaPicDiv.hidden=false
        myAsthmaPic.style.width="100%"
    }

    var hidePlan=function(){
        console.log('hide asthma action plan')
        myAsthmaPicDiv.hidden=true
        myAsthmaPic.style.width="100%"
    }

    var triggerPlan=function(){
        if(document.getElementById('gotoPlanOnFile')){
            gotoPlanOnFile.onclick=function(tg){
                if(myAsthmaPicDiv.hidden){
                    showPlan()
                }else{
                    hidePlan()
                }
            }
        }
    }

    var loadImg=function(){
        var imgSrc = localStorage.myAsthmaPic
        if(imgSrc){
            myAsthmaPic.src=imgSrc
            msg.innerHTML='<button class="btn btn-primary btn-lg" id="gotoPlanOnFile">See asthma plan</button> or load new: <button id="addPlan" class="btn btn-primary btn-md">+</button>'
            triggerPlan()
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
        }
    }
    inputFile.onchange=function(evt){
        var ff = evt.target.files
        reader.readAsDataURL(ff[0])
    }
    loadImg()

    
    triggerPlan() // trigger show/hide behavior for gotoPlanOnFile button    

    // how do you feel
    feelFine.onmouseover=feelNotso.onmouseover=feelBad.onmouseover=function(){
        if(!this.clicked){
            this.style.fontSize=60
        }
    }
    //onmouseleave
    feelFine.onmouseleave=feelNotso.onmouseleave=feelBad.onmouseleave=function(){
        if(!this.clicked){
            this.style.fontSize=50
        }
    }

    feelFine.onclick=feelNotso.onclick=feelBad.onclick=function(){
        //console.log(Date())
        feelFine.clicked=feelNotso.clicked=feelBad.clicked=false
        feelFine.style.fontSize=feelNotso.style.fontSize=feelBad.style.fontSize=50
        this.clicked=true
        this.style.fontSize=75
        howDoYouFeelTxt.style.color=this.style.color
        var h = ''
        switch(this.style.color) {
            case "green":
                console.log('feeling good')
                howDoYouFeelTxt.style.verticalAlign="top"
                var h = 'Glad to hear that. Please consult Asthma medical plan and record medication.'
                break
            case "orange":
                console.log('feeling not so good')
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
        h='<h3> <button id="asthmaLogBookRecord" style="font-size:x-large">Save</button> in your Log Book:</h3>'
        h += '<p style="font-style:italic">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Used Inhaler <input id="usedInhaler" type="checkbox"> / Spacer <input id="usedInhaler" type="checkbox"> <a href="http://www.asthma.ca/adults/treatment/spacers.php">?</a></p>'
        h += '<p style="font-style:italic">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Took Medicine <input id="tookPills" type="checkbox"> <span style="font-size:medium">(pill / tablet)</span></p>'
        h += '<p style="font-style:italic">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Indoors <input id="amIndoor" type="checkbox"> / Outdoors <input id="amOutdoor" type="checkbox"></p>'
        h += '<p style="font-style:italic">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Exercising <input id="amExercising" type="checkbox"> / Not <input id="notExercising" type="checkbox"></p>'
        
        asthmaActionRecordUI.innerHTML=h
        // button decoration
        switch(this.style.color) {
            case "green":
                asthmaLogBookRecord.className="btn btn-success"
                break
            case "orange":
                asthmaLogBookRecord.className="btn btn-warning"
                break
            case "red":
                asthmaLogBookRecord.className="btn btn-danger"
                break
        }
    }

    // load history
    var loadAsthmaHistory=function(){
        if(localStorage.asthmaHistory){
            console.log('load asthma history')
            $.getScript('https://www.gstatic.com/charts/loader.js')
             .then(function(){
                var asthmaHistory=JSON.parse(localStorage.asthmaHistory) 
                google.charts.load('current', {'packages':['timeline']});
                google.charts.setOnLoadCallback(drawChart);

                function drawChart() {
                  var data = new google.visualization.DataTable();
                  //data.addColumn('string', 'Term');
                  data.addColumn('string', 'Team');
                  data.addColumn('date', 'Start Date');
                  data.addColumn('date', 'End Date');

                  data.addRows([
                    ['Fine',     new Date(2000, 8, 5), new Date(2001, 1, 5)],
                    ['NotG', new Date(2001, 8, 5), new Date(2002, 1, 5)],
                    ['Bad', new Date(2002, 8, 5), new Date(2003, 1, 5)],
                    ['Fine', new Date(2003, 8, 5), new Date(2004, 1, 5)],
                    ['Bad', new Date(2004, 8, 5), new Date(2005, 1, 5)],
                    ['NotG',  new Date(2005, 8, 5), new Date(2006, 1, 5)],
                    ['Fine',   new Date(2006, 8, 5), new Date(2007, 1, 5)],
                    ['Fine',      new Date(2007, 8, 5), new Date(2008, 1, 5)],
                    ['NotG',  new Date(2008, 8, 5), new Date(2009, 1, 5)],
                    ['Fine',   new Date(2009, 8, 5), new Date(2010, 1, 5)],
                    ['Bad',    new Date(2010, 8, 5), new Date(2011, 1, 5)],
                    ['Fine',      new Date(2011, 8, 5), new Date(2012, 1, 5)],
                    ['NotG',     new Date(2012, 8, 5), new Date(2013, 1, 5)],
                    ['Bad',     new Date(2013, 8, 5), new Date(2014, 1, 5)],
                  ]);

                  var options = {
                    height: 180,
                    timeline: {
                      groupByRowLabel: true
                    },
                    colors: ['green', 'orange', 'red']

                  }
                  var chart = new google.visualization.Timeline(myAsthmaHistoryDiv);

                  chart.draw(data, options);
                  showPlan();
                }


                     


                 4
             })
            
            4
        }else{
            localStorage.asthmaHistory='[["time","felling"]]'
        }
    }
    loadAsthmaHistory()

        




    // dependencies

    /*
    $.getScript('jquery.zoomooz.min.js',function(){
        //ez = $('.easyzoom').easyZoom();
        //api = ez.data('easyZoom')
    });console.log('loaded zoomooz plugin')
    */




    /*
    $.getScript('easyzoom.js',function(){
        ez = $('.easyzoom').easyZoom();
        api = ez.data('easyZoom')
    });console.log('loaded easyzoom plugin')
    */


})()

